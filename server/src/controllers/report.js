const express = require('express');
const router = express.Router();
const auth = require('../services/auth');
const reportPG = require('../services/reportPG');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';


router.post('/', auth.verifyToken, auth.isAdmin, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        reportPG.report(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        reportMD.report(req, res);
    }
})

module.exports = router;
