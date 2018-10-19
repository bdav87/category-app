const express = require('express');
const router = express.Router();
const session = require('express-session');
const BigCommerce = require('node-bigcommerce');
const mysql = require('mysql');
/* const dotenv = require('dotenv');
dotenv.config(); */

/* GET home page. */
router.get('/', function(req, res) {
    if (req.session.validated && req.session.storehash) {
      res.render('index', { loaded: true });
    } 
    else if (process.env.DEVELOPMENT == 'true') {
      res.render('index', { loaded: true });
    } else {
      res.status('403').end();
    }
    
});

module.exports = router;
