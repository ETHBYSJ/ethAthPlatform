var express = require('express');
var router = express.Router();

var model = require('../mongodb/model');

/* GET register page. */
router.get('/', function(req, res, next) {
    res.render('register', { message: 'User Register' });

    var User = model.User;

    var uname = req.body.uname;
    var upwd = req.body.upwd;
    
    User.findOne({account: uname}, function(err, result) {
        if(err) {
            res.send(500);
            req.session.error = '网络异常错误，请检查';
            console.log(err);
        } else if(result!=undefined) {
            req.session.error = '用户名已存在!';
            
        } else {
            User.create({
                account: uname,
                password: upwd
            }, function(err, doc) {
                if(err) {
                    res.send(500);
                    console.log(err);
                } else {
                    req.session.error = '用户创建成功！'
                    res.send(200);
                }
            })
        }
    })
});

module.exports = router;
