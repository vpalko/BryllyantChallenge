const mongoose = require("../mongo-helper");
const SERVICE_CONSTANTS = require('../service-constants');

const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

const schema = {
    pollid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    question: {
        type: String,
        max: 500,
        required: true
    },

};

const collectionName = "questions"; // Name of the collection of documents
const QuestionSchema = mongoose.Schema(schema);
const QuestionData = mongoose.model(collectionName, QuestionSchema);

module.exports = QuestionData;