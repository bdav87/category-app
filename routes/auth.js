const express = require('express');
const router = express.Router();
const BigCommerce = require('node-bigcommerce');
const session = require('express-session');
const mysql = require('mysql');

router.get('/', (req, res) => {
    
    const connection = mysql.createConnection({
        host: process.env.SQLHOST,
        user: process.env.SQLUN,
        password: process.env.SQLPW,
        database: 'cat_app_db'
      });

    connection.connect();

    connection.query('SELECT * FROM bc_config WHERE id=1', (error, results) => {
        let clientId, secret;

        if (error) {
            throw error;
        }

        const db_result = results[0];

        clientId = db_result.client_id;
        secret = db_result.secret;
        
        completeAuth(clientId, secret);
      });

    //connection.end(() => completeAuth(clientId, secret));
    
    function completeAuth(clientId, secret){
        const bc = new BigCommerce({
            logLevel: 'info',
            clientId: clientId,
            secret: secret,
            callback: 'https://category-app.dreamhosters.com/auth',
            responseType: 'json',
            apiVersion: 'v3'
        });

        bc.authorize(req.query)
        .then(data => {
            /*
            bc.config.accessToken = data.access_token;
            bc.config.storeHash = data.context.split('/')[1];
            */
            connection.query(`UPDATE bc_config SET access_token=${data.access_token}`);
            connection.end(() => res.render('index', {data: data}));
        })
        .catch(err => res.render('index', {data: `error:${err}`}))
    }
    

    
})

module.exports = router;