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
    requestid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    questionid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    answer: {
        type: Boolean,
        required: true
    },

};

const collectionName = "answers"; // Name of the collection of documents
const AnsewrSchema = mongoose.Schema(schema);
const AnswerData = mongoose.model(collectionName, AnsewrSchema);

module.exports = AnswerData;