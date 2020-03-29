const mongoose = require("mongoose");
const SERVICE_CONSTANTS = require('./service-constants');

const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

const dbPath = `mongodb://${SERVICE_CONSTANTS.MONGO.USER}:${SERVICE_CONSTANTS.MONGO.PASSWORD}@${SERVICE_CONSTANTS.MONGO.HOST}:${SERVICE_CONSTANTS.MONGO.PORT}/${SERVICE_CONSTANTS.MONGO.DATABASE}`;

mongoose.connect(dbPath, {
    useNewUrlParser: true,
});
const db = mongoose.connection;
db.on("error", () => {
    logger.error("> error occurred from the database");
});
db.once("open", () => {
    logger.info("> successfully opened the database");
});

module.exports = mongoose;