var express = require('express');
var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var config = require('./bin/config');
var raven = require('raven');

var routes = require('./routes/index');
var users = require('./routes/users');
var event = require('./routes/event');

var app = express();
var logDirectory = path.join(__dirname, 'log');

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  date_format: config.logger.dateFormat,
  filename: logDirectory + '/%DATE%.log',
  frequency: config.logger.rotationFrequency,
  verbose: config.logger.verbose
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger(
    config.logger.level,
    {stream: accessLogStream})
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(session({ secret:"Kqc3oqiBBHWQGdQMzCqk", saveUninitialized: true, resave: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression({level:6}));

app.use(raven.middleware.express.requestHandler(config.logger.sentrydsn));
app.use('/', routes);
app.use('/account', users);
app.use('/event', event);

app.use(raven.middleware.express.errorHandler(config.logger.sentrydsn));
raven.patchGlobal(config.logger.sentrydsn);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log('Error: '+res.sentry +' || ' + err.status);
    console.log(err.stack);
    res.render('./error/error', {
      messageID: res.sentry,
      message: err.message,
      error: err
    });
  });
}

// production error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log('Error: '+res.sentry +' || ' + err.status);
  console.log(err.stack);
  res.render('./error/error', {
    messageID: res.sentry,
    message: err.message,
    error: err
  });
});

module.exports = app;
