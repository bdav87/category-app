var createError = require('http-errors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const loadRouter = require('./routes/load');
const uninstallRouter = require('./routes/uninstall');
const apiRouter = require('./routes/api');

const fs = require('fs');
const hbs = require('hbs');

const partialsDir = __dirname + '/views/partials';

const filenames = fs.readdirSync(partialsDir);

filenames.forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', true);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/load', loadRouter);
app.use('/uninstall', uninstallRouter);
app.use('/api', apiRouter);

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

const sqlOptions = {
  host: process.env.SQLHOST,
  user: process.env.SQLUN,
  password: process.env.SQLPW,
  database: 'cat_app_db'
}

const sessionStore = new MySQLStore(sqlOptions);

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  store: sessionStore,
  saveUninitialized: true,
  cookie: { secure: true }
}));

app.use((req,res, next) => {
  console.log("session???", req.session);
  next();
})

module.exports = app;
