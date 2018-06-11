const express = require('express');
const router = express.Router();
const BigCommerce = require('node-bigcommerce');
const mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { loaded: true });
});

module.exports = router;
