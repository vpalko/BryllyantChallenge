const express = require('express');
const router = express.Router();
const auth = require('../services/auth');
const report = require('../services/report');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';


router.post('/', auth.verifyToken, auth.isAdmin, (req, res) => {
    report.report(req, res);
})

module.exports = router;
