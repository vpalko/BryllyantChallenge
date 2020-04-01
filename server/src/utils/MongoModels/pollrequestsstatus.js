const mongoose = require("../mongo-helper");
const SERVICE_CONSTANTS = require('../service-constants');

const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

const schema = {
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    updatedon: {
        type: Date,
        default: Date.now,
        required: true
    }
};


const collectionName = "pollrequestsstatus"; // Name of the collection of documents
const PollRequestStatusSchema = mongoose.Schema(schema);
const PollRequestStatus = mongoose.model(collectionName, PollRequestStatusSchema);

module.exports = PollRequestStatus;