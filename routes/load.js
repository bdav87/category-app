const express = require('express');
const router = express.Router();
const session = require('express-session');

router.use(session());

router.get('/', (req, res) => {
    res.render('index', {data: req.session.bc})
})

module.exports = router;