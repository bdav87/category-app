const express = require('express');
const router = express.Router();
const session = require('express');

router.get('/', (req, res) => {
    if (req.session.validated && req.session.storehash){
        req.session.destroy(() => res.status(200).send('Uninstalling'))
    } else {
        res.status('403').end();
    }
    
})

module.exports = router;