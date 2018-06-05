var express = require('express');
var router = express.Router();

var web3 = require('../../web3/server.js');
var model = require('../../mongodb/model');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('find', { title: 'ethAthPlatform' });
}).post('/', find_trans_data);

function find_trans_data(req, res) {
    var code = req.body.tcode;
    var md5  = req.body.tmd5;

    var Bcindex = model.Bcindex;

    Bcindex.findOne({transcode: code, datahash: md5}, function(err, result) {
        //err
        if(err) {
            console.log(err);
            return;
        }
        //
        if(result == undefined) {
            console.log("Error 2: code not found");
            alert("交易信息不存在哟~");
            res.send([]);
        } else {
            var transhash = result.transhash;
            //web3 查询数据 存到trans_msg
            web3.eth.getTransaction(transhash).then(function(result) {
                var inputData = result.input;
				var res_str = Buffer.from(inputData.replace('0x',''), 'hex').toString();
				var trans_msg = JSON.parse(res_str);

                /** options */
                var type_op = ["数据库表单", "文件库资源"];
                var plat_op = ["平台1", "平台2", "平台3"]
    
                var Data = [];
    
                /** 回显 */
                Data.push({
                    "name": "简介",
                    "value":  trans_msg.intro
                });
                Data.push({
                    "name": "数据类型",
                    "value": type_op[trans_msg.type]
                });
                Data.push({
                    "name": "购买平台",
                    "value":plat_op[trans_msg.platid]
                });
                Data.push({
                    "name": "购买者",
                    "value": trans_msg.buyer
                });
                Data.push({
                    "name": "购买日期",
                    "value": trans_msg.date
                });
                Data.push({
                    "name": "MD5",
                    "value": trans_msg.md5
                });
                Data.push({ 
                    "name": "交易凭证Hash",
                    "value": trans_msg.hash
                });
                
                console.log(Data);
                res.send(Data);
            });
        }
    })
}

module.exports = router;