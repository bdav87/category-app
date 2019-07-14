var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const sessionStore = new RedisStore({ url: process.env.REDIS_URL });

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const loadRouter = require('./routes/load');
const uninstallRouter = require('./routes/uninstall');
const apiRouter = require('./routes/api');
const removeUserRouter = require('./routes/remove-user');
const testRoute = require('./routes/test');

const app = express();

app.use(session({
  key: 'session_cookie_name',
  secret: 'session_cookie_secret',
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

app.set('trust proxy', true);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/load', loadRouter);
app.use('/uninstall', uninstallRouter);
app.use('/api', apiRouter);
app.use('/remove-user', removeUserRouter);
app.use('/test', testRoute);

// temporary routing for react app
app.get('*', function (request, response){
  console.log('request', request.url)
  response.sendFile(path.join(__dirname, 'client/build/index.html'));
});

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
  res.send(err.message);
});


module.exports = app;
