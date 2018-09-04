const express = require('express');
const router = express.Router();
const BigCommerce = require('node-bigcommerce');
const mysql = require('mysql');

router.get('/', (req, res) => {
    function initiateVerification(payload) {
        const bc = new BigCommerce({
            secret: process.env.SECRET,
            responseType: 'json'
        });
        try {
            const data = bc.verify(payload);
            const hash = data.store_hash;
            const user = data.user.email;
            console.log(`Remove user request received for account ${user} on store ${hash}`);
            removeUser(user, hash);
        } catch(err){
            console.log('Error verifying payload', err)
            return res.status('403').end();
        }
    }
    initiateVerification(req.query['signed_payload']);

    function removeUser(user, hash) {
        const connection = mysql.createConnection({
            host: process.env.SQLHOST,
            user: process.env.SQLUN,
            password: process.env.SQLPW,
            database: 'cat_app_db'
          });
        
        connection.connect();

        connection.query(`
            DELETE FROM cat_app_db.users WHERE configid=(
            SELECT id from cat_app_db.bc_config WHERE hash='${hash}'
            )
            AND email='${user}'`, (error, result) => {
                if (error) {
                    console.log(`Unable to remove user. Error: ${error}`);
                }
                if (result) {
                    console.log(`Successfully removed user ${user}`);
                }
            });
        
        connection.end();
        res.status('200');
    }

})

module.exports = router;