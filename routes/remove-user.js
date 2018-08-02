const express = require('express');
const router = express.Router();
const BigCommerce = require('node-bigcommerce');


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
        } catch(err){
            console.log('Error verifying payload', err)
            return res.status('403').end();
        }
    }
    initiateVerification(req.query['signed_payload']);

})

module.exports = router;