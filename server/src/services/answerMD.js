const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectID;
const AnswerData = require('../utils/MongoModels/answer');
const QuestionData = require('../utils/MongoModels/question');
const SERVICE_CONSTANTS = require('../utils/service-constants');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

class Answer {
    getuserquestions(req, res) {
        ///:pollid/:requestid/:userid

        // let query = `SELECT q.id, q.question, a.answer FROM bryllyant.questions AS q `; //keep white space after each string
        // query += `LEFT OUTER JOIN bryllyant.answers as a ON (a.questionid = q.id AND a.pollid = q.pollid AND a.requestid=${req.params.requestid} AND a.userid=${req.params.userid}) `;
        // query += `WHERE q.pollid=${req.params.pollid} `
        // query += `ORDER BY q.id`

        QuestionData.aggregate([
            { $match: { pollid: ObjectId(req.params.pollid) } },
            { $sort: { _id: 1 } },
            {
                $lookup:
                {
                    from: "answers",
                    let: {
                        aquestionid: "$_id"
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$requestid", ObjectId(req.params.requestid)] },
                                        { $eq: ["$userid", ObjectId(req.params.userid)] },
                                        { $eq: ["$$aquestionid", "$questionid"] }
                                    ]
                                }
                            },
                        }
                    ],
                    as: "answersOuter"
                }
            },
        ], function (err, data) {
            if (err) {
                logger.error({ err });
                return res.status(400).send(err);
            } else if (!data) {
                return res.status(404).end();
            } else {
                let userAnswers = data.map((q) => {
                    return {
                        id: q._id,
                        question: q.question,
                        answer: (q.answersOuter && q.answersOuter[0] && q.answersOuter[0].answer != null) ? q.answersOuter[0].answer : null
                    }
                });
                return res.status(200).send(userAnswers);
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
                    saveAnswersPromises.push({
                        pollid: ObjectId(pollid),
                        requestid: ObjectId(pollrequestid),
                        userid: ObjectId(userid),
                        questionid: ObjectId(answers[index].id),
                        answer: answers[index].answer
                    });
                }

                AnswerData.insertMany(saveAnswersPromises, function (err, response) {
                    if (err) {
                        logger.error({ err });
                        return res.status(400).send({ error: SERVICE_CONSTANTS.ANSWER.UNABLE_TO_SAVE });
                    } else {
                        return res.status(200).send({ msg: SERVICE_CONSTANTS.ANSWER.SAVED, data: req.body });
                    }
                });
            })
            .catch((err) => {
                return res.status(400).send({ error: SERVICE_CONSTANTS.ANSWER.UNABLE_TO_SAVE });
            })
    }

    deleteAnswers(pollid, pollrequestid, userid) {
        return new Promise((resolve, reject) => {
            AnswerData.deleteMany({ pollid: ObjectId(pollid), 'requestid': ObjectId(pollrequestid), 'userid': ObjectId(userid) }, function (err, response) {
                if (err) {
                    logger.error({ err })
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = new Answer();
