const express = require('express');
const router = express.Router();
const auth = require('../services/auth');
const poll = require('../services/poll');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

router.post('/new', auth.verifyToken, auth.isAdmin, (req, res) => {
    poll.newpoll(req, res);
})

router.post('/pollrequest', auth.verifyToken, auth.isAdmin, (req, res) => {
    poll.pollrequest(req, res);
})

router.post('/pollrequeststatus', auth.verifyToken, auth.isAdmin, (req, res) => {
    poll.pollrequeststatus(req, res);
})

router.get('/', auth.verifyToken, (req, res) => {
    poll.getpoll(req, res);
})

router.get('/:id', auth.verifyToken, (req, res) => {
    poll.getpoll(req, res);
})

router.delete('/:id', auth.verifyToken, auth.isAdmin, (req, res) => {
    poll.deletepoll(req, res);
});

router.get('/author/:authorid', auth.verifyToken, (req, res) => {
    poll.getpoll(req, res);
})
module.exports = router;
