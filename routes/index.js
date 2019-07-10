const express = require('express');
const router = express.Router();

const envFile = '.env';
const fs = require('fs');

fs.access(envFile, fs.constants.F_OK, (err) => {
  if (!err) {
    console.log('Running dev environment')
    const dotenv = require('dotenv');
    dotenv.config();
  }
});

/* GET home page. */
router.get('/', function(req, res) {
    if (process.env.DEVELOPMENT === 'true') {
      /* return res.sendFile('index.html'); */
      return res.render('index', { loaded: true });
    }
    if (req.session) {
      if (req.session.validated && req.session.storehash) {
        return res.render('index', { loaded: true });
      }
    } 
    else {
      res.status('403').end();
    }
});

module.exports = router;
