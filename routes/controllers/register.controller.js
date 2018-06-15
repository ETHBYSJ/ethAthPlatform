var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var model = require('../../mongodb/model');
var web3 = require('../../web3/server.js');

/* GET register page. */
router.get('/', function(req, res, next) {
    res.render('register', { title: 'User Register' });
}).post('/',function(req, res) {
    var User = model.User;
    /* //test log
    console.log(req.body.uname);
    console.log(req.body.upwd);
    */
    if(req.body.uname!=undefined && req.body.upwd!=undefined && req.body.uname!='' && req.body.upwd!='') {
        var uname = req.body.uname;

        var upwd = crypto.createHash('md5').update(req.body.upwd).digest('hex');
        
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
                    eth: null,
                    balance: null,
                    question: null,
                    answer: null
                }, function(err, doc) {
                    if(err) {
                        res.sendStatus(500);
                        console.log(err);
                    } else {
                        req.session.error = '请输入密保信息，完成注册哦';
                        res.sendStatus(200);
                    }
                })
            }
        });
    }
});

module.exports = router;
