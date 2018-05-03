var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    if(!req.session.user) {
        req.session.error = "请先登录";
        console.log(res.locals.message);
        res.redirect("/login");
    }
    res.render("home", {title: 'Home'})
});

module.exports = router;