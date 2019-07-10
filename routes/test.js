const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.method)
    res.json({'test': 'Dev server is running'});
});

module.exports = router;