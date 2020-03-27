const jwt = require('jsonwebtoken');
const PostgresHelper = require('../utils/postgres-helper');
const POSTGRES_ERRORS = require('pg-error-constants');
const SERVICE_CONSTANTS = require('../utils/service-constants');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

class Answer {
    getuserquestions(req, res) {
        ///:pollid/:requestid/:userid

        let query = `SELECT q.id, q.question, a.answer FROM bryllyant.questions AS q `; //keep white space after each string
        query += `LEFT OUTER JOIN bryllyant.answers as a ON (a.questionid = q.id AND a.pollid = q.pollid AND a.requestid=${req.params.requestid} AND a.userid=${req.params.userid}) `;
        query += `WHERE q.pollid=${req.params.pollid} `
        query += `ORDER BY q.id`

        PostgresHelper.query(query, (err, response) => {
            logger.debug({ context: { query } }, 'Dumping query');
            if (err) {
                logger.error({ err });
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

    saveanswers(req, res) {
        var pollid = req.body.pollid;
        var pollrequestid = req.body.pollrequestid;
        var userid = req.body.userid;
        var answers = req.body.answers;
        var saveAnswersPromises = [];

        if (!pollid || !pollrequestid || !userid || !answers) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        this.deleteAnswers(pollid, pollrequestid, userid)
        .then(() => {
            for (var index = 0; index < answers.length; index++) {
                saveAnswersPromises.push(this.updateAnswer(pollid, pollrequestid, userid, answers[index]));
            }
    
            Promise.all(saveAnswersPromises)
                .then(function () {
                    return res.status(200).send({ msg: SERVICE_CONSTANTS.ANSWER.SAVED, data: req.body });
                })
                .catch((err) => {
                    logger.error({ err });
                    return res.status(400).send({ error: SERVICE_CONSTANTS.ANSWER.UNABLE_TO_SAVE });
                });
        })
        .catch((err) =>{
            return res.status(400).send({ error: SERVICE_CONSTANTS.ANSWER.UNABLE_TO_SAVE });
        })

    }

    deleteAnswers(pollid, pollrequestid, userid) {
        return new Promise((resolve, reject) => {

            let query = `DELETE FROM bryllyant.answers WHERE pollid=${pollid} AND requestid=${pollrequestid} AND userid=${userid}`;

            PostgresHelper.query(query, (err, response) => {
                logger.debug({ context: { query } }, 'Dumping query');
                if (err) {
                    logger.error({ err })
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    updateAnswer(pollid, pollrequestid, userid, answers) {
        return new Promise((resolve, reject) => {

            let query = `UPDATE bryllyant.answers SET answer=${answers.answer} WHERE pollid=${pollid} AND requestid=${pollrequestid} AND userid=${userid} AND questionid=${answers.id}`;

            PostgresHelper.query(query, (err, response) => {
                logger.debug({ context: { query } }, 'Dumping query');
                if (err) {
                    logger.error({ err })
                    reject(err);
                } else if (!response.rowCount || response.rowCount === 0) {
                    // answer does not exist try to insert
                    this.insertAnswer(pollid, pollrequestid, userid, answers)
                        .then(function () {
                            resolve();
                        })
                        .catch((err) => {
                            reject(err);
                        });

                } else {
                    resolve(response.rows);
                }
            });
        });
    }

    insertAnswer(pollid, pollrequestid, userid, answers) {
        return new Promise((resolve, reject) => {
            let query = 'INSERT INTO bryllyant.answers(pollid, requestid, userid, questionid, answer) VALUES($1, $2, $3, $4, $5)';
            let data = [pollid, pollrequestid, userid, answers.id, answers.answer];

            PostgresHelper.queryData(query, data, (err, response) => {
                logger.debug({ context: { query } }, 'Dumping query');
                if (err) {
                    logger.error({ err })
                    reject(err);
                } else if (!response.rowCount || response.rowCount === 0) {
                    reject();
                } else {
                    resolve(response.rows);
                }
            });
        });
    }

}

module.exports = new Answer();
