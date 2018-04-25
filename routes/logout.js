var express = require('express');
var router = express.Router();

/* GET logout page. */
router.get("/",function(req, res){    // 到达 /logout 路径则登出， session中user,error对象置空，并重定向到根路径
    req.session.user = null;
    req.session.error = null;
    res.redirect("/");
});

module.exports = router;