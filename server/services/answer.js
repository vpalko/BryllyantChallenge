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
}

module.exports = new Answer();
