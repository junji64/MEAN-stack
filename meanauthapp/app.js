var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//========================================<
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

mongoose.Promise = require('bluebird');
mongoose.connect(config.database, { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + config.database);
});
mongoose.connection.on('error', (err) => {
  console.log('Database error ' + err);
});

//========================================>

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//========================================<
// CORS Middleware
app.use(cors());
// Body Parser Middleware
app.use(bodyParser.json());
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
//========================================>

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
