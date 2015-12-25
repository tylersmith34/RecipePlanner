var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var homeRoute = require('./source/routes/index');
var planRoute = require('./source/routes/plan');
var maintainRoute = require('./source/routes/maintain');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRoute);
app.use('/plan', planRoute);
app.use('/maintain', maintainRoute);

app.put('/maintain/recipe/:id/descr/:data', maintainRoute);
app.put('/maintain/recipe/:id/name/:data', maintainRoute);
app.post('/maintain/recipe/:id/:tagId', maintainRoute);
app.post('/maintain/new/recipe', maintainRoute);
app.delete('/maintain/recipe/:id/:tagId', maintainRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      activeView: 'none',
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    activeView: 'none',
    message: err.message,
    error: err
  });
});

module.exports = app;
