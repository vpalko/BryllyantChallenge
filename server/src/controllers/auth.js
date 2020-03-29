const express = require('express');
const router = express.Router();
const auth = require('../services/auth');
const authPG = require('../services/authPG');
const authMD = require('../services/authMD');
const SERVICE_CONSTANTS = require('../utils/service-constants');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

router.post('/new', auth.verifyToken, auth.isAdmin, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        authPG.addUser(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        authMD.addUser(req, res);
    }
});

router.post('/login', (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        authPG.login(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        authMD.login(req, res);
    }
});

router.get('/login/:token', (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        authPG.login(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        authMD.login(req, res);
    }
});

router.put('/:id', auth.verifyToken, auth.isAdmin, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        authPG.updateuser(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        authMD.updateuser(req, res);
    }
});

router.delete('/:id', auth.verifyToken, auth.isAdmin, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        authPG.deleteuser(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        authMD.deleteuser(req, res);
    }
});

router.get('/:id', auth.verifyToken, auth.isAdmin, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        authPG.getuser(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        authMD.getuser(req, res);
    }
})

router.get('/', auth.verifyToken, auth.isAdmin, (req, res) => {
    if (SERVICE_CONSTANTS.DB === "POSTGRES") {
        authPG.getuser(req, res);
    } else if (SERVICE_CONSTANTS.DB === "MONGO") {
        authMD.getuser(req, res);
    }
})

module.exports = router;
