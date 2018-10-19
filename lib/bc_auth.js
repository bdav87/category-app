const BigCommerce = require('node-bigcommerce');
const mysql = require('mysql');

module.exports = function(hash){
    if (!hash){
        console.log('no hash provided to bc_auth');
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

        const connection = mysql.createConnection(process.env.JAWSDB_URL);
        
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
    return connect_and_retrieve_config(hash);
    
}

   
    