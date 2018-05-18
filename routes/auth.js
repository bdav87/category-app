const express = require('express');
const router = express.Router();
const BigCommerce = require('node-bigcommerce');
const session = require('express-session');

const bc = new BigCommerce({
    logLevel: 'info',
    clientId: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    callback: '/auth',
    responseType: 'json',
    apiVersion: 'v3'
});

router.use(session());

router.get('/', (req, res) => {
    bc.authorize(req.query)
    .then(data => {res.render('index', {data: data})
    .catch(err => new Error(err))
    })
})

module.exports = router;