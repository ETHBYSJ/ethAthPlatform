var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.session.user) {
    req.session.error = "请先登录";
    console.log(res.locals.message);
    res.redirect("/login");
  }
  
  res.render('index', { title: 'ethAthPlatform', user: res.locals.user.account });
});

module.exports = router;
