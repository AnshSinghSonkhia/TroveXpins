var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// ChatGPT Start
const fs = require('fs');
// ChatGPT End

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// ChatGPT Start
// Serve static files manually
// app.get('/public/stylesheets/style.css', (req, res) => {
//   const filePath = path.join(__dirname, 'public', 'stylesheets', 'style.css');
//   fs.readFile(filePath, 'utf8', (err, data) => {
//       if (err) {
//           res.status(404).send('File not found');
//       } else {
//           res.setHeader('Content-Type', 'text/css');
//           res.send(data);
//       }
//   });
// });

// app.get('/public/stylesheets/input.css', (req, res) => {
//   const filePath = path.join(__dirname, 'public', 'stylesheets', 'input.css');
//   fs.readFile(filePath, 'utf8', (err, data) => {
//       if (err) {
//           res.status(404).send('File not found');
//       } else {
//           res.setHeader('Content-Type', 'text/css');
//           res.send(data);
//       }
//   });
// });
// ChatGPT End

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
