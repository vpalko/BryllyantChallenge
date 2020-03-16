const PostgresHelper = require('../utils/postgres-helper');
const POSTGRES_ERRORS = require('pg-error-constants');
const SERVICE_CONSTANTS = require('../utils/service-constants');

var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

class Auth {
    getuser(req, res){
        let query;
        if(req.params.id){
            query = `SELECT id, email, firstname, lastname, phone, isadmin  FROM bryllyant.userprofile WHERE id='${req.params.id}'`;
        } else {
            query = `SELECT * FROM bryllyant.userprofile`;
        }
        
        PostgresHelper.query(query, (err, response) => {
            logger.debug({ context: { query } }, 'Dumping query');
            if (err) {
                logger.error({ err: err })
                // if (err.code && err.code === POSTGRES_ERRORS.FOREIGN_KEY_VIOLATION) {
                //     return res.status(400).send({ error: SERVICE_CONSTANTS.POLL.INVALIDAUTHORID });
                // } else {
                    return res.status(400).send(err);
                // }
            } else if (!response.rowCount || response.rowCount === 0) {
                return res.status(404).end();
            } else {
                return res.status(200).send(response.rows);

                // return res.status(200).send({ 
                //     id: response.rows[0].id,
                //     name: response.rows[0].name,
                //     description: response.rows[0].description,
                //     authorid: response.rows[0].authorid 
                // });
            }
        });
  
    }

    updateuser(req, res) {
        //get credentials coming in from form
        var id = req.body.id;
        var email = req.body.email;
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        var phone = req.body.phone;
        var isadmin = req.body.isadmin;

        if(!id || (!email && !phone && !firstname && !lastname && isadmin === undefined)) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        let data = email ? `email='${email}', ` : '';
        data += (firstname ? `firstname='${firstname}', ` : '');
        data += (lastname ? `lastname='${lastname}', ` : '');
        data += (phone ? `phone='${phone}', ` : '');
        data += (isadmin ? `isadmin=${isadmin}, ` : '');
        data = data.substring(0, data.length - 2);

        let query = `UPDATE bryllyant.userprofile SET ${data} WHERE id=${id}`;

        PostgresHelper.query(query, (err, response) => {
            logger.debug({ context: { query } }, 'Dumping query');
            if (err) {
                logger.error({ err: err })
                return res.status(400).send(err);
            } else {
                // logger.debug(response.rows[0]);
                return res.status(200).send({ msg: SERVICE_CONSTANTS.USER.UPDATED });
            }
        });
    }

    deleteuser(req, res) {
        //get credentials coming in from form
        var id = req.params.id;

        if(!id) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        let query = `DELETE FROM bryllyant.userprofile WHERE id=${id}`;

        PostgresHelper.query(query, (err, response) => {
            logger.debug({ context: { query } }, 'Dumping query');
            if (err) {
                logger.error({ err: err })
                return res.status(400).send(err);
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

        if(!email || !phone || !firstname || !lastname || !pwd || isadmin === undefined) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                logger.error(err);
                return res.status(400).send({ error });
            }

            bcrypt.hash(pwd, salt, function (err, hash) {
                let query = 'INSERT INTO bryllyant.userprofile(email, phone, firstname, lastname, pwd, isadmin) VALUES($1, $2, $3, $4, $5, $6)';
                let data = [email, phone, firstname, lastname, hash, isadmin];

                PostgresHelper.query(query, data, (err, response) => {
                    logger.debug({ context: { query } }, 'Dumping query');
                    if (err) {
                        logger.error({ err: err })
                        if (err.code && err.code === POSTGRES_ERRORS.UNIQUE_VIOLATION) {
                            return res.status(400).send({ error: SERVICE_CONSTANTS.USER.EMAIL_ALREADY_EXISTS });
                        } else {
                            return res.status(400).send(err);
                        }
                    } else {
                        // logger.debug(response.rows[0]);
                        return res.status(200).send({ msg: SERVICE_CONSTANTS.USER.CREATED });
                    }
                });
            });
        });
    }

    login(req, res) {
        if (!req.body.email || !req.body.pwd) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        let query = `SELECT email, phone, firstname, lastname, isadmin, pwd FROM bryllyant.userprofile WHERE email='${req.body.email}'`;

        PostgresHelper.query(query, (err, response) => {
            logger.debug({ context: { query } }, 'Dumping query');
            if (err) {
                logger.error({ err: err })
                return res.status(400).send(err);
            } else if (response.rowCount && response.rowCount > 0) {
                // check if the password is correct
                bcrypt.compare(req.body.pwd, response.rows[0].pwd).then(function (result) {
                    if (!result) {
                        return res.status(403).send({ msg: SERVICE_CONSTANTS.USER.INVALID_CREDENTIALS });
                    } else {
                        jwt.sign({
                            id: response.rows[0].id,
                            email: response.rows[0].email,
                            phone: response.rows[0].phone,
                            firstname: response.rows[0].firstname,
                            lastname: response.rows[0].lastname,
                            isadmin: response.rows[0].isadmin
                        }, SERVICE_CONSTANTS.AUTH.APP_SECRET, { expiresIn: SERVICE_CONSTANTS.AUTH.TOKEN_EXPIRES_IN }, (err, token) => {
                            return res.status(200).json({
                                token: token
                            });
                        });
                    }
                });
            }
        });
    }

    isAdmin(req, res, next) {
        if (SERVICE_CONSTANTS.NODE_ENV === "test") {
            return next();
        }
        
        if (req.isadmin && req.isadmin === true) {
            next();
        } else {
            // forbidden
            res.sendStatus(403);
        }

    }

    verifyToken(req, res, next) {
        if (SERVICE_CONSTANTS.NODE_ENV === "test") {
            return next();
        }
        // get auth header value
        const bearerHeader = req.headers['authorization'];

        // check if bearer is undefined
        if (typeof bearerHeader !== 'undefined') {
            // split at the space
            const bearer = bearerHeader.split(' ');
            // get token from array
            const bearerToken = bearer[1];
            // set the token
            req.token = bearerToken;
            // next middleware

            jwt.verify(req.token, SERVICE_CONSTANTS.AUTH.APP_SECRET, (err, authdata) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    if (authdata.isadmin === true) {
                        req.isadmin = true;
                    }
                    next();
                }
            });
        } else {
            // forbidden
            res.sendStatus(403);
        }
    }
}

module.exports = new Auth();
