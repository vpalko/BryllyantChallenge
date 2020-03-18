var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');

const authController = require('./controllers/auth');
const pollController = require('./controllers/poll');
const questionController = require('./controllers/question');
const PostgresHelper = require('./utils/postgres-helper');
const ProcessListener = require('./utils/process-event-listener');

var app = express();
PostgresHelper.init();
ProcessListener.listen(app);

// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:"true"}));
app.use(bodyParser.json());

app.use(cors({
    exposedHeaders: [
      'Cache-Control',
      'Content-Language',
      'Content-Type',
      'Expires',
      'Last-Modified',
      'Pragma',
      'x-correlationid',
      'X-USR-ID'
    ]
  }));

app.use('/user', authController);
app.use('/poll', pollController);
app.use('/question', questionController);

var port = 3456;
app.listen(port, function(){
    console.log("Server listening on port: " + port);
});