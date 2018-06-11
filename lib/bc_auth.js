const BigCommerce = require('node-bigcommerce');
const mysql = require('mysql');
const session = require('express-session');

module.exports = function(){
    if (req.session.hash && req.session.validated) {
        const hash = req.session.hash;
        return connect_and_retrieve_config(hash);
    } else {
        console.log('There was an issue with the session. Missing hash or validation.')
    }

    function connect_and_retrieve_config(storehash){
        return new Promise((resolve, reject) => {
        
        const bc = new BigCommerce({
            responseType: 'json',
            apiVersion: 'v3',
            clientId: process.env.CLIENTID,
            secret: process.env.SECRET,
            storeHash: storehash
        });

        const connection = mysql.createConnection({
            host: process.env.SQLHOST,
            user: process.env.SQLUN,
            password: process.env.SQLPW,
            database: 'cat_app_db'
          });
        
        connection.connect();
        
        connection.query(`SELECT * FROM bc_config WHERE hash='${storehash}'`, (error, results) => {
            let db_result;
            if (error) {
                reject(Error(`Query failed with error: ${error}`));
            }
            if (!results) {
                reject(Error(`Database query rejected`))
            }
            if (results) {
                db_result = results[0];
                bc.config.accessToken = db_result.access_token;
            }
            
        });
    
        connection.end(() => resolve(bc));
        })
        
    }
    
}

   
    