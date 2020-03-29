const express = require('express');
const router = express.Router();
const auth = require('../services/auth');
const pollPG = require('../services/pollPG');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

router.post('/new', auth.verifyToken, auth.isAdmin, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        pollPG.newpoll(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        pollMD.newpoll(req, res);
    }
})

router.post('/pollrequest', auth.verifyToken, auth.isAdmin, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        pollPG.pollrequest(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        pollMD.pollrequest(req, res);
    }
})

router.post('/pollrequeststatus', auth.verifyToken, auth.isAdmin, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        pollPG.pollrequeststatus(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        pollMD.pollrequeststatus(req, res);
    }
})

router.get('/', auth.verifyToken, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        pollPG.getpoll(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        pollMD.getpoll(req, res);
    }
})

router.get('/:id', auth.verifyToken, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        pollPG.getpoll(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        pollMD.getpoll(req, res);
    }
})

router.delete('/:id', auth.verifyToken, auth.isAdmin, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        pollPG.deletepoll(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        pollMD.deletepoll(req, res);
    }
});

router.get('/author/:authorid', auth.verifyToken, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        pollPG.getpoll(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        pollMD.getpoll(req, res);
    }
})
module.exports = router;
