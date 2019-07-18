const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', function(req, res) {
    if (process.env.DEVELOPMENT === 'true') {
      router.use(express.static(path.join(__dirname, '../client/build')));
      const options = {
        root: path.join(__dirname, '../client/build')
      }
      return res.sendFile('index.html', options);
    }
    if (req.session) {
      if (req.session.validated && req.session.storehash) {
        return res.render('index', { loaded: true });
      }
    } 
    else {
      res.status('404').end();
    }
});

module.exports = router;
