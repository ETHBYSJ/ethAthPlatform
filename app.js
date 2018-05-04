var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var cors = require('cors');
var app = express();

/**
 * cors
 */
const corsOptions = {
	origin: [
		'http://localhost:8001'
	],
	methods:'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
	allowedHeaders:['Content-Type', 'Authorization']
};
app.use("/trans", cors(corsOptions));

/**
 * express-session
*/
app.use(session({ 
 	resave: true,
 	saveUninitialized: true,
  	secret: 'secret',
  	cookie:{ 
      	maxAge: 1000*60*30
  	}
}));

app.use(function(req,res,next) { 
  	res.locals.user = req.session.user;   // 从session 获取 user对象
  	var err = req.session.error;   //获取错误信息
  	delete req.session.error;
  	res.locals.message = "";   // 展示的信息 message
  	if(err){ 
      	res.locals.message = '<div class="alert alert-danger" style="margin-bottom:20px;color:red;">'+err+'</div>';
  	}
  	next();  //中间件传递
});

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

var routes = require('./routes/index')(app);

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
