const UserProfile = require('../utils/MongoModels/user');
const ObjectId = require('mongodb').ObjectID;
const SERVICE_CONSTANTS = require('../utils/service-constants');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

class AuthMD {
    getuser(req, res) {
        if (req.params.id) {
            UserProfile.findOne({ '_id': ObjectId(req.params.id) }, function (err, response) {
                if (err) {
                    logger.error({ err });
                    return res.status(400).send(err);
                } else if (!response) {
                    return res.status(404).end();
                } else {
                    let userData = {
                        id: response._id,
                        email: response.email,
                        phone: response.phone,
                        firstname: response.firstname,
                        lastname: response.lastname,
                        isadmin: response.isadmin
                    }
                    return res.status(200).send([userData]);
                }
            });
        } else {
            UserProfile.find({ }, function (err, response) {
                if (err) {
                    logger.error({ err });
                    return res.status(400).send(err);
                } else if (!response) {
                    return res.status(404).end();
                } else {
                    let users = response.map((user) => {
                        return  {
                                id: user._id,
                                email: user.email,
                                pwd: user.pwd,
                                phone: user.phone,
                                firstname: user.firstname,
                                lastname: user.lastname,
                                isadmin: user.isadmin
                            }
                      });

                    return res.status(200).send(users);
                }
            });
        }
    }

    updateuser(req, res) {
        //get credentials coming in from form
        var id = req.body.id;
        var email = req.body.email;
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var phone = req.body.phone;
        var isadmin = req.body.isadmin;

        if (!id || (!email && !phone && !firstname && !lastname && isadmin === undefined)) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        let data = {}
        if (email)
            data['email'] = email;
        if (firstname)
            data['firstname'] = firstname;
        if (lastname)
            data['lastname'] = lastname;
        if (phone)
            data['phone'] = phone;
        if (isadmin)
            data['isadmin'] = isadmin;

        UserProfile.findOneAndUpdate(
            { '_id': ObjectId(req.body.id) },
            data,
            function (err, response) {
                if (err) {
                    logger.error({ err });
                    return res.status(400).send(err);
                } else if (!response) {
                    return res.status(404).send({ msg: SERVICE_CONSTANTS.USER.UNABLE_TO_FIND });
                } else {
                    // logger.debug(response.rows[0]);
                    return res.status(200).send({ msg: SERVICE_CONSTANTS.USER.UPDATED });
                }
            });
    }

    deleteuser(req, res) {
        //get credentials coming in from form
        var id = req.params.id;

        if (!id) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        UserProfile.findOneAndDelete({ '_id': ObjectId(req.body.id) }, function (err, response) {
            if (err) {
                logger.error({ err });
                return res.status(400).send(err);
            } else if (!response) {
                return res.status(404).send({ msg: SERVICE_CONSTANTS.USER.UNABLE_TO_FIND });
            } else {
                // logger.debug(response.rows[0]);
                return res.status(200).send({ msg: SERVICE_CONSTANTS.USER.DELETED });
            }
        });
    }

    addUser(req, res) {
        //get credentials coming in from form
        var email = req.body.email;
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var phone = req.body.phone;
        var pwd = req.body.pwd;
        var isadmin = req.body.isadmin;

        if (!email || !phone || !firstname || !lastname || !pwd || isadmin === undefined) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                logger.error(err);
                return res.status(400).send({ error });
            }

            bcrypt.hash(pwd, salt, function (err, hash) {
                let newUser = new UserProfile({
                    email,
                    firstname,
                    lastname,
                    phone,
                    pwd: hash,
                    isadmin
                });

                newUser.save((err, results) => {
                    if (err) {
                        logger.error({ err, results });
                        if (err.code === 11000) {
                            return res.status(400).send({ error: SERVICE_CONSTANTS.USER.EMAIL_ALREADY_EXISTS });
                        } else {
                            return res.status(400).send(err);
                        }
                    } else {
                        return res.status(200).send({
                            msg: SERVICE_CONSTANTS.USER.CREATED, user: {
                                id: results._id,
                                email: results.email,
                                firstname: results.firstname,
                                lastname: results.lastname,
                                phone: results.phone,
                                isadmin: results.isadmin
                            }
                        });
                    }
                })
            });
        });
    }

    login(req, res) {
        if ((!req.body.email || !req.body.pwd) && !req.params.token) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        if (req.body.email) {
            UserProfile.findOne({ 'email': req.body.email }, function (err, response) {
                if (err) {
                    logger.error({ err });
                    return res.status(400).send(err);
                } else if (!response) {
                    return res.send(404);
                } else {
                    // check if the password is correct
                    bcrypt.compare(req.body.pwd, response.pwd).then(function (result) {
                        if (!result) {
                            return res.status(403).send({ msg: SERVICE_CONSTANTS.USER.INVALID_CREDENTIALS });
                        } else {
                            let userData = {
                                id: response._id,
                                email: response.email,
                                phone: response.phone,
                                firstname: response.firstname,
                                lastname: response.lastname,
                                isadmin: response.isadmin
                            }
                            jwt.sign(userData, SERVICE_CONSTANTS.AUTH.APP_SECRET, { expiresIn: SERVICE_CONSTANTS.AUTH.TOKEN_EXPIRES_IN }, (err, token) => {
                                userData.token = token;
                                return res.status(200).json(userData);
                            });
                        }
                    });
                }
            });
        } else if (req.params.token) {
            jwt.verify(req.params.token, SERVICE_CONSTANTS.AUTH.APP_SECRET, (err, authdata) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    delete authdata.iat;

                    //sign token that expires
                    jwt.sign(authdata, SERVICE_CONSTANTS.AUTH.APP_SECRET, { expiresIn: SERVICE_CONSTANTS.AUTH.TOKEN_EXPIRES_IN }, (err, token) => {
                        authdata.token = token;
                        return res.status(200).json(authdata);
                    });
                }
            });
        }
    }
}

module.exports = new AuthMD();
