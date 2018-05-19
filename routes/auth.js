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
/*
router.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true}
  }))
*/

router.get('/', (req, res) => {
    bc.authorize(req.query)
    .then(data => {
        req.session.bc = bc;
        req.session.bc.config.accessToken = data.access_token;
        req.session.bc.config.storeHash = data.context.split('/')[1];
        console.log(req.session.bc);
        res.render('index', {data: JSON.stringify(req.session.bc)});
    })
    .catch(err => res.render('index', {data: `error:${err}`}))
})

module.exports = router;