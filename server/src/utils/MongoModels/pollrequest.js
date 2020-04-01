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
    sentby: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    senton: {
        type: Date,
        default: Date.now,
        required: true
    }
};

const collectionName = "pollrequests"; // Name of the collection of documents
const PollRequestSchema = mongoose.Schema(schema);
const PollRequest = mongoose.model(collectionName, PollRequestSchema);

module.exports = PollRequest;