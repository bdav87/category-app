const express = require('express');
const router = express.Router();
const session = require('express-session');
const BigCommerce = require('node-bigcommerce');
const mysql = require('mysql');

router.get('/', (req, res) => {
    const bc = req.session.bc;
    console.log(req.session.bc);
    try {
        const data = bc.verify(req.query['signed_payload']);
        res.render('index', {data: data})
    } catch (err) {
        console.log(err);
        res.send(err);
    }
    
})

module.exports = router;