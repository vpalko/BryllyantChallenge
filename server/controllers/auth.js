const express = require('express');
const router = express.Router();
const auth = require('../services/auth');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

router.post('/new', auth.verifyToken, auth.isAdmin, (req, res) => {
    auth.addUser(req, res);
});

router.post('/login', (req, res) => {
    auth.login(req, res);
});

router.put('/:id', auth.verifyToken, auth.isAdmin, (req, res) => {
    auth.updateuser(req, res);
});

router.delete('/:id', auth.verifyToken, auth.isAdmin, (req, res) => {
    auth.deleteuser(req, res);
});

router.get('/:id', auth.verifyToken, auth.isAdmin, (req, res) => {
    auth.getuser(req, res);
})

router.get('/', auth.verifyToken, auth.isAdmin, (req, res) => {
    auth.getuser(req, res);
})

module.exports = router;
