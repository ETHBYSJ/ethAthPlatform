var express = require('express');
var router = express.Router();

var web3 = require('../../web3/server.js');

/* GET test page. */
router.get('/', function(req, res) {
  res.render('test', { title: 'Express' });

  web3.eth.getAccounts().then(function(res, err) {
    if(err) {
      console.log(err);
    } else {
      console.log(res[0]);
    }
  })
});

module.exports = router;