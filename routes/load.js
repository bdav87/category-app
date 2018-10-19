const express = require('express');
const router = express.Router();
const session = require('express-session');
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
            return validatePayload(hash, user);

        } catch(err){
            console.log('Error verifying payload', err)
            return res.status('403').end();
        }
        
    }

    initiateVerification(req.query['signed_payload']);

    function validatePayload(hash, user) {
        const connection = mysql.createConnection(process.env.JAWSDB_URL);
        
        connection.connect();

        const queryString = `SELECT id FROM bc_config WHERE hash='${hash}'`;

        connection.query(queryString, (error, results) => {
            if (error) {
                throw error;
            }
            const storeConfigID = results[0].id;
            checkUser(storeConfigID, user);
        })

        function checkUser(configID, email) {
            const queryString = `SELECT email from users WHERE configid=${configID}`;
            connection.query(queryString, (error, results) => {
                if (error) {
                    throw error;
                }
                const users = results[0].email;
                const userIndex = users.indexOf(email);
                if (userIndex == -1) {
                    addUser(configID, email);
                } else {
                    connection.end();
                    routeToDashboard(hash);
                }
            })
        }

        function addUser(id, email) {
            const queryString = `INSERT INTO users (email, configid)
            VALUES ('${email}', ${id})`;
            connection.query(queryString, (error, results) => {
                if (error) {
                    throw error;
                }
                connection.end();
                routeToDashboard(hash);
            });
            
        }

    }

    function routeToDashboard(storehash){
        req.session.validated = true;
        req.session.storehash = storehash;
        res.redirect('/');
    } 
    
})

module.exports = router;