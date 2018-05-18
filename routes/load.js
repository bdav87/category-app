const express = require('express');
const router = express.Router();
const session = require('express-session');

router.get('/', (req, res) => {
    res.render('index', {data: 'Load after auth'})
})

module.exports = router;