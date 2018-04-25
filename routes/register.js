var express = require('express');
var router = express.Router();

var model = require('../mongodb/model');

/* GET register page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'User Register' });
}).post('/',function(req, res) {
    var User = model.User;

    console.log(req.body.uname);
    console.log(req.body.upwd);

    if(req.body.uname!=undefined && req.body.upwd!=undefined && req.body.uname!='' && req.body.upwd!='') {
        var uname = req.body.uname;
        var upwd = req.body.upwd;
        
        User.findOne({account: uname}, function(err, result) {
            if(err) {
                res.sendStatus(500);
                req.session.error = '网络异常错误，请检查';
                console.log(err);
            } else if(result) {
                req.session.error = '用户名已存在!';
                console.log('用户名已存在');
                res.sendStatus(500);
            } else {
                User.create({
                    account: uname,
                    password: upwd,
                    eth: 0,
                    category: 1
                }, function(err, doc) {
                    if(err) {
                        res.sendStatus(500);
                        console.log(err);
                    } else {
                        req.session.error = '用户创建成功,请登录'
                        res.sendStatus(200);
                        console.log('用户名创建成功');
                    }
                })
            }
        });
    }
});

module.exports = router;
