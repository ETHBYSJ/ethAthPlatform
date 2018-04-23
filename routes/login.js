var express = require('express');
var router = express.Router();

/* GET register page. */
router.get('/', function(req, res, next) {
  res.render('login', { message: 'User Login' });
});

module.exports = router;
