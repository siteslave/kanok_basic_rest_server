var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var jwt = require('./jwt');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var mysql = require('mysql');
let pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '789124',
  database: 'customers',
  port: 3306
});

pool.on('connection', (connection) => {
  connection.query('SET NAMES utf8')
});

app.use((req, res, next) => {
  req.pool = pool;
  next();
});

let authToken = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // console.log(token);
  jwt.verify(token)
    .then((decoded) => {
      req.decoded = decoded;
      next();
    }, err => {
      return res.status(403).send({
        ok: false,
        msg: 'No token provided.'
      });
    });
}

app.use('/users', users);
app.use('/', authToken, index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
