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
                bc.config.storeHash = db_result.hash;
                bc.config.clientId = db_result.client_id;
                bc.config.secret = db_result.secret;
            }
            
        });
    
        connection.end(() => resolve(bc));
        })
        
    }
    
    return connect_and_retrieve_config();
}

   
    