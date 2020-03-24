const express = require('express');
const router = express.Router();
const auth = require('../services/auth');
const answer = require('../services/answer');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

router.get('/:pollid/:requestid/:userid', auth.verifyToken, (req, res) => {
    answer.getuserquestions(req, res);
})

module.exports = router;