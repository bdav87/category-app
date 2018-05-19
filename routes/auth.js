const express = require('express');
const router = express.Router();
const BigCommerce = require('node-bigcommerce');
const session = require('express-session');
const mysql = require('mysql');


router.get('/', (req, res) => {
    
    const bc = new BigCommerce({
        logLevel: 'info',
        clientId: process.env.CLIENT_ID,
        secret: process.env.SECRET,
        callback: 'https://category-app.dreamhosters.com/auth',
        responseType: 'json',
        apiVersion: 'v3'
    });

    bc.authorize(req.query)
    .then(data => {
        bc.config.accessToken = data.access_token;
        bc.config.storeHash = data.context.split('/')[1];
        console.log(JSON.stringify(bc));
        res.render('index', {data: data});
    })
    .catch(err => res.render('index', {data: `error:${err}`}))
})

module.exports = router;