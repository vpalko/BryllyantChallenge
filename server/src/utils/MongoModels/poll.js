const mongoose = require("../mongo-helper");
const SERVICE_CONSTANTS = require('../service-constants');

const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

const schema = {
    name: {
        type: String,
        max: 225,
        required: true
    },
    description: {
        type: String
    },
    authorid: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
};

const collectionName = "poll"; // Name of the collection of documents
const PollSchema = mongoose.Schema(schema);
const PollProfile = mongoose.model(collectionName, PollSchema);

module.exports = PollProfile;