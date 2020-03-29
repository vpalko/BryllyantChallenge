const SERVICE_CONSTANTS = require('../utils/service-constants');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

class Auth {
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
