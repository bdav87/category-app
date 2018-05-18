const express = require('express');
const router = express.Router();
const BigCommerce = require('node-bigcommerce');
const session = require('express-session');

const bc = new BigCommerce({
    logLevel: 'info',
    clientId: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    callback: 'https://category-app.dreamhosters.com/auth',
    responseType: 'json',
    apiVersion: 'v3'
});


router.get('/', (req, res) => {
    bc.authorize(req.query)
    .then(data => {
        req.session.testing = data;
        console.log(req.session.testing);
        res.render('index', {data: data});
    })
    .catch(err => res.render('index', {data: `error:${err}`}))
})

module.exports = router;