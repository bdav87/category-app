const BigCommerce = require('node-bigcommerce');
const mysql = require('mysql');

module.exports = function(){

    function connect_and_retrieve_config(){
        return new Promise((resolve, reject) => {
        
        const bc = new BigCommerce({
            responseType: 'json',
            apiVersion: 'v3'
        })

        const connection = mysql.createConnection({
            host: process.env.SQLHOST,
            user: process.env.SQLUN,
            password: process.env.SQLPW,
            database: 'cat_app_db'
          });
        
        connection.connect();
        
        connection.query('SELECT * FROM bc_config WHERE id=1', (error, results) => {
            if (error) {
                reject(Error(`query fail ${error}`));
            }
            const db_result = results[0];
            
            bc.accessToken = db_result.access_token;
            bc.storeHash = db_result.hash;
            bc.clientId = db_result.client_id;
            bc.secret = db_result.secret;
        });
    
        connection.end(() => resolve(bc));
        })
        
    }
    
    return connect_and_retrieve_config();
}

   
    