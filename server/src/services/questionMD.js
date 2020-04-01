const ObjectId = require('mongodb').ObjectID;
const QuestionData = require('../utils/MongoModels/question');
const SERVICE_CONSTANTS = require('../utils/service-constants');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

class Question {
    getquestion(req, res) {
        let query;

        if (req.params.id) {
            query = { '_id': ObjectId( req.params.id ) }
        } else if (req.params.pollid) {
            query = { 'pollid': ObjectId( req.params.pollid ) }
        }

        QuestionData.find(query, function (err, response) {
            if (err) {
                logger.error({ err });
                return res.status(400).send(err);
            } else if (!response) {
                return res.status(404).end();
            } else {
                let questionsData = response.map((q) => {
                    return {
                        id: q._id,
                        pollid: q.pollid,
                        question: q.question
                    }
                });
                return res.status(200).send(questionsData);
            }
        });
    }

    deletequestion(req, res) {
        var id = req.params.id;

        if (!id) {
            return res.status(400).send({ msg: SERVICE_CONSTANTS.BAD_REQUEST });
        }

        QuestionData.findOneAndDelete({ '_id': ObjectId( id ) }, function (err, response) {
            if (err) {
                logger.error({ err });
                return res.status(400).send(err);
            } else if (!response) {
                return res.status(404).send({ msg: SERVICE_CONSTANTS.QUESTION.UNABLE_TO_FIND });
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

        let newQuestion = new QuestionData({
            pollid,
            question
        });

        newQuestion.save((err, results) => {
            if (err) {
                logger.error({ err });
                return res.status(400).send(err);
            } else {
                let questionData = {
                    id: results._id,
                    question,
                    pollid
                }

                return res.status(200).send(questionData);
            }
        });
    }
}

module.exports = new Question();
