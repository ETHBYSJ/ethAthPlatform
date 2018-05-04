var express = require('express');
var router = express.Router();

var model = require('../../mongodb/model');

/* GET login page. */
router.get("/", function(req, res){    
    res.render("login", {title: 'User Login'});
}).post("/", function(req, res){                       
    
    var User =  model.User;
    var uname = req.body.uname;                //获取post上来的 data数据中 uname的值
    
    User.findOne({account: uname}, function(err, result){   //通过此model以用户名的条件 查询数据库中的匹配信息
        if(err){                                         //错误就返回给原post处（login.html) 状态码为500的错误
            res.sendStatus(500);
            console.log(err);
        } else if(!result){                                 //查询不到用户名匹配信息，则用户名不存在
            req.session.error = '用户名不存在';
            res.sendStatus(404);                            //    状态码返回404
        //    res.redirect("/login");
        } else{ 
            if(req.body.upwd != result.password){     //查询到匹配用户名的信息，但相应的password属性不匹配
                req.session.error = "密码错误";
                res.sendStatus(404);
            //    res.redirect("/login");
            }else{                                     //信息匹配成功，则将此对象（匹配到的user) 赋给session.user  并返回成功
                req.session.user = result;
                res.sendStatus(200);
            //    res.redirect("/home");
            }
        }
    });
});
module.exports = router;