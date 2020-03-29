const PostgresHelper = require('../utils/postgres-helper');
const POSTGRES_ERRORS = require('pg-error-constants');
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

        let query;

        if (reportid === 1) {
            //poll request info with status count
            query = `SELECT pr.id as requestid, pr.senton, concat_ws(', ', u.lastname, u.firstname) AS requestorname `;
            query += `FROM bryllyant.pollrequests as pr `;
            query += `LEFT OUTER JOIN bryllyant.userprofile as u ON (pr.sentby = u.id) `;
            query += `WHERE pr.pollid=${pollid} `;
            query += `ORDER BY pr.senton DESC`;
        }

        PostgresHelper.query(query, (err, response) => {
            logger.debug({ context: { query } }, 'Dumping query');
            if (err) {
                logger.error({ err });
                // if (err.code && err.code === POSTGRES_ERRORS.FOREIGN_KEY_VIOLATION) {
                //     return res.status(400).send({ error: SERVICE_CONSTANTS.POLL.INVALIDAUTHORID });
                // } else {
                return res.status(400).send(err);
                // }
            // } else if (!response.rowCount || response.rowCount === 0) {
            //     return res.status(404).end();
            } else {
                let pollRequestData = response.rows.map(x => {
                    x.senton = moment(x.senton).format("MMMM Do YYYY, hh:mm a");
                    return x;
                }
                );

                this.getRequestStatusCount(pollid)
                .then((data)=>{
                    for (var index = 0; index < pollRequestData.length; index++) {
                        let rs = lodash.filter(data, function(item) {
                            return item.requestid === pollRequestData[index].requestid;
                        });

                        pollRequestData[index]['statuscount'] = rs.map(({requestid, ...rest}) => rest);
                    }

                    return res.status(200).send(response.rows);
                })
                .catch((err)=>{
                    logger.error({ err });
                    return res.status(400).send(err);
                });
            }
        });
    }

    getRequestStatusCount(pollid) {
        return new Promise((resolve, reject) => {
            let query = `SELECT id as requestid, status, count(*) FROM bryllyant.pollrequestsstatus `;
            query += `WHERE id IN (SELECT id FROM bryllyant.pollrequests WHERE pollid=${pollid}) `
            query += `GROUP BY id, status ORDER BY id, status`;

            PostgresHelper.query(query, (err, response) => {
                logger.debug({ context: { query } }, 'Dumping query');
                // if (err) {
                //     logger.error({ err });
                //     reject(err);
                // } else {
                    resolve(response.rows);
                // }
            });
        });
    }

}

module.exports = new Report();
