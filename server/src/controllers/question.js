const express = require('express');
const router = express.Router();
const auth = require('../services/auth');
const questionPG = require('../services/questionPG');
const questionMD = require('../services/questionMD');
const SERVICE_CONSTANTS = require('../utils/service-constants');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

router.post('/new', auth.verifyToken, auth.isAdmin, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        questionPG.newquestion(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        questionMD.newquestion(req, res);
    }
})

router.get('/', auth.verifyToken, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        questionPG.getquestion(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        questionMD.getquestion(req, res);
    }
})

router.get('/:id', auth.verifyToken, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        questionPG.getquestion(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        questionMD.getquestion(req, res);
    }
})

router.delete('/:id', auth.verifyToken, auth.isAdmin, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        questionPG.deletequestion(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        questionMD.deletequestion(req, res);
    }
});

router.get('/poll/:pollid', auth.verifyToken, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        questionPG.getquestion(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        questionMD.getquestion(req, res);
    }
})
module.exports = router;
