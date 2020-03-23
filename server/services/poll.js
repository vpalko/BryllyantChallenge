const jwt = require('jsonwebtoken');
const PostgresHelper = require('../utils/postgres-helper');
const POSTGRES_ERRORS = require('pg-error-constants');
const SERVICE_CONSTANTS = require('../utils/service-constants');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

class Poll {
    getpoll(req, res) {
        let query =
            `SELECT p.*, concat_ws(', ', u.lastname, u.firstname) AS authorname FROM bryllyant.poll as p LEFT OUTER JOIN bryllyant.userprofile as u ON u.id = p.authorid `; //keep white space after each string

        if (req.params.id) {
            query += `WHERE p.id='${req.params.id}'`;
        } else if (req.params.authorid) {
            query += `WHERE p.authorid='${req.params.authorid}'`;
        }

        PostgresHelper.query(query, (err, response) => {
            logger.debug({ context: { query } }, 'Dumping query');
            if (err) {
                logger.error({ err })
                // if (err.code && err.code === POSTGRES_ERRORS.FOREIGN_KEY_VIOLATION) {
                //     return res.status(400).send({ error: SERVICE_CONSTANTS.POLL.INVALIDAUTHORID });
                // } else {
                return res.status(400).send(err);
                // }
            } else if (!response.rowCount || response.rowCount === 0) {
                return res.status(404).end();
            } else {
                return res.status(200).send(response.rows);
            }
        });
    }

    getauthorpoll(authorid) {
        return new Promise((resolve, reject) => {
            let query = `SELECT p.*, concat_ws(', ', u.lastname, u.firstname) AS authorname FROM bryllyant.poll as p LEFT OUTER JOIN bryllyant.userprofile as u ON u.id = p.authorid WHERE p.authorid='${authorid}' ORDER BY id DESC FETCH FIRST 1 ROW ONLY`;

            PostgresHelper.query(query, (err, response) => {
                logger.debug({ context: { query } }, 'Dumping query');
                if (err) {
                    logger.error({ err })
                    reject();
                } else if (!response.rowCount || response.rowCount === 0) {
                    reject();
                } else {
                    resolve(response.rows);
                }
            });
        });
    }

    deletepoll(req, res) {
        var id = req.params.id;

        if (!id) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        let query = `DELETE FROM bryllyant.poll WHERE id=${id}`;

        PostgresHelper.query(query, (err, response) => {
            logger.debug({ context: { query } }, 'Dumping query');
            if (err) {
                logger.error({ err })
                return res.status(400).send(err);
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

        let query = 'INSERT INTO bryllyant.poll(name, description, authorid) VALUES($1, $2, $3)';
        let data = [name, description, authorid];

        PostgresHelper.queryData(query, data, (err, response) => {
            logger.debug({ context: { query } }, 'Dumping query');
            if (err) {
                logger.error({ err })
                if (err.code && err.code === POSTGRES_ERRORS.FOREIGN_KEY_VIOLATION) {
                    return res.status(400).send({ error: SERVICE_CONSTANTS.POLL.INVALIDAUTHORID });
                } else {
                    return res.status(400).send(err);
                }
            } else {
                this.getauthorpoll(authorid)
                    .then(data => {
                        return res.status(200).send({
                            id: data[0].id,
                            name: data[0].name,
                            description: data[0].description,
                            authorid: data[0].authorid,
                            authorname: data[0].authorname
                        });
                    })
                    .catch((err) => {
                        logger.error({ err });
                        return res.status(500).send(err);
                    }
                    )
            }
        });







        // for (index = 0; index < req.body.length; index++) {
        //     console.log(req.body[index]);
        //   }


        // let users = [['test@example.com', 'Fred'], ['test2@example.com', 'Lynda']];
        // let query1 = format('INSERT INTO users (email, name) VALUES %L returning id', users);

        // async function run() {
        //   let client;
        //   try {
        //     client = new pg.Client({
        //       connectionString: 'postgresql://localhost/node_example'
        //     });
        //     await client.connect();
        //     let {rows} = await client.query(query1);
        //     console.log(rows);
        //   } catch (e) {
        //     console.error(e);
        //   } finally {
        //     client.end();
        //   }
        // }
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
                // id: data[0].id;
                for (var index = 0; index < users.length; index++) {
                    pollRequestPromises.push(this.sendEmail(pollid, data[0].id, users[index]));
                }

                Promise.all(pollRequestPromises)
                    .then(function (tokens) {
                        return res.status(200).send({ msg: `Poll request sent, id# ${data[0].id}`, url: tokens });
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

    addpollrequest(pollid, sentby) {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO bryllyant.pollrequests(pollid, sentby) VALUES($1, $2)';
            let data = [pollid, sentby];

            PostgresHelper.queryData(query, data, (err, response) => {
                logger.debug({ context: { query } }, 'Dumping query');
                if (err) {
                    logger.error({ err })
                    reject(err);
                } else if (!response.rowCount || response.rowCount === 0) {
                    reject();
                } else {
                    let query = `SELECT id FROM bryllyant.pollrequests WHERE sentby='${sentby}' ORDER BY id DESC FETCH FIRST 1 ROW ONLY`;

                    PostgresHelper.query(query, (err, response) => {
                        logger.debug({ context: { query } }, 'Dumping query');
                        if (err) {
                            logger.error({ err })
                            reject();
                        } else if (!response.rowCount || response.rowCount === 0) {
                            reject();
                        } else {
                            resolve(response.rows);
                        }
                    });
                }
            });
        });
    }

    sendEmail(pollid, requestid, user) {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO bryllyant.pollrequestsstatus(id, userid) VALUES($1, $2)';
            let data = [requestid, user.id];

            PostgresHelper.queryData(query, data, (err, response) => {
                logger.debug({ context: { query } }, 'Dumping query');
                if (err) {
                    logger.error({ err })
                    reject(err);
                } else if (!response.rowCount || response.rowCount === 0) {
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
            });
        });
    }
}

module.exports = new Poll();
