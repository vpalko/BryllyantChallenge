const express = require('express');
const router = express.Router();
const auth = require('../services/auth');
const question = require('../services/question');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

router.post('/new', auth.verifyToken, auth.isAdmin, (req, res) => {
    question.newquestion(req, res);
})

router.get('/', auth.verifyToken, (req, res) => {
    question.getquestion(req, res);
})

router.get('/:id', auth.verifyToken, (req, res) => {
    question.getquestion(req, res);
})

router.delete('/:id', auth.verifyToken, auth.isAdmin, (req, res) => {
    question.deletequestion(req, res);
});

router.get('/poll/:pollid', auth.verifyToken, (req, res) => {
    question.getquestion(req, res);
})
module.exports = router;
