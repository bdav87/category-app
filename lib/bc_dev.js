const BigCommerce = require('node-bigcommerce');
const dotenv = require('dotenv') || null;

function createBC() {
    if (dotenv !== null) {
        dotenv.config();

        const BC = new BigCommerce({
            responseType: 'json',
            apiVersion: 'v3',
            clientId: process.env.CLIENTID,
            secret: process.env.SECRET,
            storeHash: process.env.STOREHASH
        });
        BC.config.accessToken = process.env.TOKEN;
        return Promise.resolve(BC);
    } else {
        return Promise.reject(false);
    }
}

const checkForEnv =  () => {
    const envFile = '.env';
    const fs = require('fs');

    return new Promise((resolve, reject) => {
        fs.access(envFile, fs.constants.F_OK, (err) => {
            if (!err) {
                resolve(true);
            }
            if (err) {
                reject(err);
            }
        });
    })
}

module.exports = createBC;