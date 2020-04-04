
const ObjectId = require('mongodb').ObjectID;
const UserProfile = require('../utils/MongoModels/user');
const PollProfile = require('../utils/MongoModels/poll');
const PollRequest = require('../utils/MongoModels/pollrequest');
const PollRequestStatus = require('../utils/MongoModels/pollrequestsstatus');
const SERVICE_CONSTANTS = require('../utils/service-constants');
const lodash = require('lodash');
const moment = require('moment');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

class Report {
    report(req, res) {
        var reportid = req.body.reportid;
        var pollid = req.body.pollid;

        if (!reportid || (reportid === 1 && !pollid)) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        let match = {}

        match = { pollid: ObjectId(pollid) }
        PollRequest.aggregate([
            { $match: match },
            {
                $lookup:
                {
                    from: "userprofiles",
                    localField: "sentby",
                    foreignField: "_id",
                    as: "author_info"
                },
            },
            { $project: { requestid: "$_id", senton: "$senton", author_info: "$author_info" } }
        ], function (err, data) {
            if (err) {
                logger.error({ err });
                return res.status(400).send(err);
            } else if (!data) {
                return res.status(404).end();
            } else {
                let pollRequestData = data.map((poll) => {
                    let authorName = poll.author_info ? (poll.author_info[0] ? poll.author_info[0].lastname + ', ' + poll.author_info[0].firstname : 'N/A') : 'N/A';
                    return {
                        requestid: poll.requestid,
                        senton: moment(poll.senton).format("MMMM Do YYYY, hh:mm a"),
                        requestorname: authorName
                    }
                });

                PollRequestStatus.aggregate([
                    { "$group": { _id: { id: "$id", status: "$status" }, count: { $sum: 1 } } },
                    { $lookup: { from: "pollrequests", localField: "_id.id", foreignField: "_id", as: "details" } },
                    { $project: { count: "$count", details: { $arrayElemAt: ['$details', 0] } } },
                    { $match: { "details.pollid": ObjectId(pollid) } }
                ], function (err, data) {
                    if (err) {
                        logger.error({ err });
                        return res.status(400).send(err);
                    } else {
                        for (var index = 0; index < pollRequestData.length; index++) {
                            let rs = lodash.filter(data, function (item) {
                                return item._id['id'].toString() === pollRequestData[index].requestid.toString();
                            });

                            pollRequestData[index]['statuscount'] = rs.map(({ requestid, ...rest }) => rest);
                        }

                        logger.debug("###############", JSON.stringify(pollRequestData));
                        return res.status(200).send(response.rows);
                    }
                });
            }
        });
    }


    /*
    
    	
    db.pollrequestsstatuses.aggregate([
        { "$group": { _id: { id: "$id", status: "$status" }, count: { $sum: 1 } } },
        { $lookup: { from: "pollrequests", localField: "_id.id", foreignField: "_id", as: "details" } },
        { $project: { count: "$count", details: { $arrayElemAt: ['$details', 0] } } },
        { $match: { "details.pollid": ObjectId("5e874dd9d273a2f9c60abf37") } }
    ])
    
    */

}

module.exports = new Report();
