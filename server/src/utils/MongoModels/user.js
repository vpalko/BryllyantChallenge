const mongoose = require("../mongo-helper");
const SERVICE_CONSTANTS = require('../service-constants');

const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'debug';

const schema = {
    // _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        trim: true,
        unique: true,
        max: 125,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    pwd: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        max: 10,
        required: true
    },
    firstname: {
        type: String,
        max: 125,
        required: true
    },
    lastname: {
        type: String,
        max: 125,
        required: true
    },
    isadmin: {
        type: Boolean,
        default: false
    }
};

const collectionName = "userprofile"; // Name of the collection of documents
const UserSchema = mongoose.Schema(schema);
const UserProfile = mongoose.model(collectionName, UserSchema);

function validateEmail(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

module.exports = UserProfile;