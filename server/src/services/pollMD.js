const UserProfile = require('../utils/MongoModels/user');
const PollProfile = require('../utils/MongoModels/poll');
const PollRequest = require('../utils/MongoModels/pollrequest');
const PollRequestStatus = require('../utils/MongoModels/pollrequestsstatus');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectID;
const SERVICE_CONSTANTS = require('../utils/service-constants');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

class Poll {
    getpoll(req, res) {
        let match = {}
        if (req.params.id) {
            match = { _id: ObjectId(req.params.id) }
        } else if (req.params.authorid) {
            match = { authorid: ObjectId(req.params.authorid) }
        }

        PollProfile.aggregate([
            { $match: match },
            {
                $lookup:
                {
                    from: "userprofiles",
                    localField: "authorid",
                    foreignField: "_id",
                    as: "author_info"
                }
            }
        ], function (err, data) {
            if (err) {
                logger.error({ err })
                return res.status(400).send(err);
            } else if (!data) {
                return res.status(404).end();
            } else {
                let pollInfo = data.map((poll) => {
                    let authorName = poll.author_info ? (poll.author_info[0] ? poll.author_info[0].lastname + ', ' + poll.author_info[0].firstname : 'N/A') : 'N/A';
                    return {
                        id: poll._id,
                        name: poll.name,
                        description: poll.description,
                        authorid: poll.authorid,
                        authorname: authorName
                    }
                });
                return res.status(200).send(pollInfo);
            }
        });
    }

    deletepoll(req, res) {
        var id = req.params.id;

        if (!id) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        PollProfile.findOneAndDelete({ '_id': ObjectId(id) }, function (err, response) {
            if (err) {
                logger.error({ err });
                return res.status(400).send(err);
            } else if (!response) {
                return res.status(404).send({ msg: SERVICE_CONSTANTS.POLL.UNABLE_TO_FIND });
            } else {
                // logger.debug(response.rows[0]);
                return res.status(200).send({ msg: SERVICE_CONSTANTS.POLL.DELETED });
            }
        });
    }

    newpoll(req, res) {
        //get credentials coming in from form
        var name = req.body.name;
        var description = req.body.description ? req.body.description : '';
        var authorid = req.body.authorid;

        if (!name || !authorid) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        let newPoll = new PollProfile({
            name,
            description,
            authorid
        });

        newPoll.save((err, results) => {
            if (err) {
                logger.error({ err, results });
                return res.status(400).send(err);
            } else {
                // get author info
                UserProfile.findOne({ '_id': ObjectId(authorid) }, function (err, author) {
                    if (err) {
                        logger.error({ err });
                        return res.status(400).send(err);
                    } else if (!author) {
                        return res.status(404).end();
                    } else {
                        let userData = {
                            id: results._id,
                            name: results.name,
                            description: results.description,
                            authorid: author._id,
                            authorname: `${author.lastname}, ${author.firstname}`
                        }

                        return res.status(200).send(userData);
                    }
                });
            }
        });
    }

    pollrequest(req, res) {
        var pollid = req.body.pollid;
        var sentby = req.body.sentby;
        var users = req.body.userid;

        var pollRequestPromises = [];

        if (!pollid || !sentby || !users || users.length === 0) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        this.addpollrequest(pollid, sentby)
            .then(data => {
                for (var index = 0; index < users.length; index++) {
                    pollRequestPromises.push(this.sendEmail(pollid, data._id, users[index]));
                }

                Promise.all(pollRequestPromises)
                    .then(function (tokens) {
                        return res.status(200).send({ msg: `Poll request sent, id# ${data._id}`, url: tokens });
                    })
                    .catch((err) => {
                        logger.error({ err });
                        return res.status(400).send({ error: SERVICE_CONSTANTS.POLL.UNABLE_TO_SEND_INVITATION });
                    });
            })
            .catch((err) => {
                logger.error({ err });
                return res.status(500).send(err);
            }
            )
    }

    pollrequeststatus(req, res) {
        var prid = req.body.pollrequestid;
        var userid = req.body.userid;
        var status = req.body.status;
        var force = req.body.force ? req.body.force : false;

        if (!prid || !userid || !status) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        let filter = { '_id': ObjectId(prid), 'userid': ObjectId(userid) };

        if (force === false) {
            // update only if new status greater than current
            filter['status'] = { "$lt": status }
        }

        PollRequestStatus.findOneAndUpdate(
            filter,
            { status, updatedon: Date.now() },
            {
                new: true,
                upsert: true
            },
            function (err, response) {
                if (err) {
                    if (err.code && err.code === 11000) {
                        logger.info({ msg: 'Status not updated to lower one' });
                    } else {
                        logger.error({ err });
                    }

                    //try to find current status
                    if (filter.status) {
                        delete filter['status'];
                    }
                    PollRequestStatus.findOne(
                        filter,
                        function (err, response) {
                            if (err) {
                                logger.error({ err });
                                return res.status(400).send(err);

                            } else if (!response) {
                                return res.status(404).send({ msg: SERVICE_CONSTANTS.USER.UNABLE_TO_FIND });
                            } else {
                                return res.status(200).send({ msg: SERVICE_CONSTANTS.POLL_REQUEST.STATUS_UPDATED, status: response.status, updatedon: response.updatedon });
                            }
                        });

                } else if (!response) {
                    return res.status(404).send({ msg: SERVICE_CONSTANTS.USER.UNABLE_TO_FIND });
                } else {
                    return res.status(200).send({ msg: SERVICE_CONSTANTS.POLL_REQUEST.STATUS_UPDATED, status: response.status, updatedon: response.updatedon });
                }
            });
    }

    addpollrequest(pollid, sentby) {
        return new Promise((resolve, reject) => {
            let newRequest = new PollRequest({
                pollid,
                sentby
            });

            newRequest.save((err, results) => {
                if (err) {
                    logger.error({ err });
                    reject(err);
                } else if (!results) {
                    reject();
                } else {
                    resolve(results);
                }
            })
        });
    }

    sendEmail(pollid, requestid, user) {
        return new Promise((resolve, reject) => {
            let newRequestStatus = new PollRequestStatus({
                id: requestid,
                userid: user.id
            });

            newRequestStatus.save((err, results) => {
                if (err) {
                    logger.error({ err });
                    reject(err);
                } else if (!results) {
                    reject();
                } else {
                    //1. send email then resolve     
                    //1.1 generate user access token
                    // jwt.sign(user, SERVICE_CONSTANTS.AUTH.APP_SECRET, { expiresIn: SERVICE_CONSTANTS.AUTH.TOKEN_EXPIRES_IN }, (err, token) => {

                    user.pollid = pollid;
                    user.requestid = requestid;
                    jwt.sign(user, SERVICE_CONSTANTS.AUTH.APP_SECRET, (err, token) => {
                        logger.debug({ token });
                        resolve(token);
                    });
                }
            })
        });
    }
}

module.exports = new Poll();
