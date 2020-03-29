const express = require('express');
const router = express.Router();
const auth = require('../services/auth');
const answerPG = require('../services/answerPG');
const SERVICE_CONSTANTS = require('../utils/service-constants');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

router.get('/:pollid/:requestid/:userid', auth.verifyToken, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        answerPG.getuserquestions(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        answerMD.getuserquestions(req, res);
    }
})

router.post('/save', auth.verifyToken, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        answerPG.saveanswers(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        answerMD.saveanswers(req, res);
    }
})

module.exports = router;