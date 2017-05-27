var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var FileStore = require('session-file-store')(session);

////////////////////////////////////////////////////////////////////////////////////////////////
//                                      web page server                                       //
////////////////////////////////////////////////////////////////////////////////////////////////

var app = express();
var dbConfig = require('./config/db.js');

var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'controllers')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/uploads/ask')));

//app.use('/uploads', express.static(__dirname + './uploads'));

//app.use(express.static(__dirname+'/controllers'));


//app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.locals.pretty=true;
var passport = require('passport');
var session = require('express-session');
app.use(session({
  secret: 'NaverHackday',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

var flash = require('connect-flash');
app.use(flash()); // use connect-flash for flash messages stored in session


require('./controllers/user_controller')(passport);

require('./routes/index')(app, passport);

//app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
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
    message: err.message,
    error: {}
  });
});
module.exports = app;
