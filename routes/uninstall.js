const express = require('express');
const router = express.Router();
const session = require('express');

router.get('/', (req, res) => {
    req.session.destroy(()=> res.status(200).send('Uninstalling'))
})

module.exports = router;