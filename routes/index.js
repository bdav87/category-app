var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //Testing only
  res.render('index', { loaded: true });
  //res.status('502').end();
});

module.exports = router;
