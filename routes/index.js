const express = require('express');
const router = express.Router();
const BigCommerce = require('node-bigcommerce');
const mysql = require('mysql');
const session = require('express-session');

router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

/* GET home page. */
router.get('/', function(req, res) {
  if (req.session.validated){
    res.render('index', { loaded: true });
  } else {
    res.status('403').end();
  }
});

module.exports = router;
