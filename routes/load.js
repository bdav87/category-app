const express = require('express');
const router = express.Router();
const session = require('express-session');
const BigCommerce = require('node-bigcommerce');
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
        let accessToken, hash, clientId, secret;

        if (error) {
            throw error;
        }
        const db_result = results[0];
        
        accessToken = db_result.access_token;
        hash = db_result.hash;
        clientId = db_result.client_id;
        secret = db_result.secret;

        verifyAndRender(accessToken, hash, clientId, secret);
    })
    
    function verifyAndRender(accessToken, hash, clientId, secret) {
        connection.end();

        const bc = new BigCommerce({
            clientId: clientId,
            secret: secret,
            storeHash: hash,
            accessToken: accessToken,
            responseType: 'json',
            apiVersion: 'v3'
        });

        try {
            const data = bc.verify(req.query['signed_payload']);
            console.log(data);
            res.render('index', {loaded: true})
        } catch (err) {
            throw err;
            res.send(err);
        }
    }  
    
})

module.exports = router;