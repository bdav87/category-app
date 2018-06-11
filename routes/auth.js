const express = require('express');
const router = express.Router();
const session = require('express-session');
const BigCommerce = require('node-bigcommerce');

const mysql = require('mysql');
const EventEmitter = require('events');

class AuthEmitter extends EventEmitter {}

const authEmitter = new AuthEmitter();

router.get('/', (req, res) => {
    console.log('Sessions?', req.session);
    console.log('Auth GET');
    receiveAuthFromBC(req.query);

    function receiveAuthFromBC(query){
        console.log('Dealing with query from BC now');
        const bc = new BigCommerce({
            logLevel: 'info',
            clientId: process.env.CLIENTID,
            secret: process.env.SECRET,
            callback: 'https://category-app.dreamhosters.com/auth',
            responseType: 'json',
            apiVersion: 'v3'
        });

        bc.authorize(query)
        .catch(err => {
            console.log(err);
            res.status('403').end()
        })
        .then(data => processAuth(data))
    }

    function processAuth(data){
        console.log('Processing auth and setting accesstoken');
        const bcDetails = {
            accessToken: data.access_token,
            storeHash: extractHash(data.context),
            user: data.user.email
        }
        return saveAuthToDB(bcDetails);
    }

    function extractHash(context) {
        if (typeof context != 'string') {
            return false;
        }
        const hash = context.split('/')[1];
        return hash;
    }

    function saveAuthToDB(bcDetails){
        console.log('Saving auth token to database');
        const connection = mysql.createConnection({
            host: process.env.SQLHOST,
            user: process.env.SQLUN,
            password: process.env.SQLPW,
            database: 'cat_app_db'
          });

        connection.connect((err) => {
            if (err) {
                console.log('Error connecting to DB:', err);
            }
            authEmitter.emit('connected');
        });
        
        // Did this store install the app previously?
        // If so, we can update their config row with the new access token
        function checkForExistingHash(){
            connection.query(
                `
                SELECT id 
                FROM bc_config 
                WHERE hash="${bcDetails.storeHash}"`, (error, results) => {
                    if (error) {
                        console.log("error on hash query: ", error)
                    }

                    const id = results[0].id;

                    if (id == null) {
                        authEmitter.emit('storeNeeded');
                    }
                    else {
                        authEmitter.emit('existingHashFound', id);
                    }
                })
        }

        function addNewStore(){
            connection.query(
            `
            INSERT INTO bc_config (access_token, hash)
            VALUES ('${bcDetails.accessToken}', '${bcDetails.storeHash}')`, (error, results) => {
                if (error) {
                    console.log("error adding store details to db: ", error)
                }
                const db_result = results[0];
                authEmitter.emit('storeAdded');
            })
        }

        function addNewUser(configId){
            connection.query(
            `
            INSERT INTO users (email, configid)
            VALUES ('${bcDetails.user}', ${configId})`, (error)=>{
                if (error) {
                    console.log('Error adding user to db: ', error);
                }
                authEmitter.emit('installComplete');
            })
        }
        
        function setNewToken(id){
            connection.query(
                `
                UPDATE bc_config SET access_token="${bcDetails.accessToken}" 
                WHERE id=${id}`, (error) => {
                if (error) {
                    console.log("error writing access token to db: ", error)
                }
                authEmitter.emit('storeAdded', id)
            });
        }

        function routeUserAfterAuth(){
            res.redirect('/');
        }

        authEmitter.once('connected', checkForExistingHash);
        authEmitter.once('storeNeeded', addNewStore);
        authEmitter.once('existingHashFound', (id) => setNewToken(id));
        authEmitter.once('storeAdded', (id) => addNewUser(id));
        authEmitter.once('installComplete', () => routeUserAfterAuth());

    }
    

    
})

module.exports = router;