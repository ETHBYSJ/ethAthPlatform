var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

/**
 * mongoose
 */
var mongoose_bcindex = require('./mongodb/bcindex.js');
var bc_index = mongoose_bcindex();
var mongoose_bcuser = require('./mongodb/user.js');
var bc_user = mongoose_bcuser();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * routers
 */
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
//var loginRouter = require('./routes/login');
//var homeRouter = require('./routes/home');
//var logoutRouter = require('./routes/logout');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', registerRouter);
//app.use('/login', loginRouter);
//app.use('/home', homeRouter);
//app.use('/logout', logoutRouter);

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
