const PostgresHelper = require('../utils/postgres-helper');
const POSTGRES_ERRORS = require('pg-error-constants');
const SERVICE_CONSTANTS = require('../utils/service-constants');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

class Question {
    getquestion(req, res) {
        let query =
            `SELECT * FROM bryllyant.questions `; //keep white space after each string

        if (req.params.id) {
            query += `WHERE id='${req.params.id}'`;
        } else if (req.params.pollid) {
            query += `WHERE pollid='${req.params.pollid}'`;
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
            }
        });
    }

    getpollquestions(pollid) {
        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM bryllyant.questions WHERE pollid='${pollid}' ORDER BY id DESC`;
            
            PostgresHelper.query(query, (err, response) => {
                logger.debug({ context: { query } }, 'Dumping query');
                if (err) {
                    logger.error({ err: err })
                    reject();
                } else if (!response.rowCount || response.rowCount === 0) {
                    reject();
                } else {
                    resolve(response.rows);
                }
            });
        });
    }

    deletequestion(req, res) {
        var id = req.params.id;

        if (!id) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        let query = `DELETE FROM bryllyant.questions WHERE id=${id}`;

        PostgresHelper.query(query, (err, response) => {
            logger.debug({ context: { query } }, 'Dumping query');
            if (err) {
                logger.error({ err: err })
                return res.status(400).send(err);
            } else {
                // logger.debug(response.rows[0]);
                return res.status(200).send({ msg: SERVICE_CONSTANTS.QUESTION.DELETED });
            }
        });
    }

    newquestion(req, res) {
        var question = req.body.question;
        var pollid = req.body.pollid;

        if (!pollid || !question) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        let query = 'INSERT INTO bryllyant.questions(pollid, question) VALUES($1, $2)';
        let data = [pollid, question];

        PostgresHelper.queryData(query, data, (err, response) => {
            logger.debug({ context: { query } }, 'Dumping query');
            if (err) {
                logger.error({ err: err })
                return res.status(400).send(err);
            } else {
                this.getpollquestions(pollid)
                    .then(data => {
                        return res.status(200).send({ 
                            id: data[0].id,
                            question:data[0].question,
                            pollid: data[0].pollid
                         });
                    })
                    .catch(() => {
                        return res.status(500).end();
                        }
                    )
            }
        });

    }
}

module.exports = new Question();
