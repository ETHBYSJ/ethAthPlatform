var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var fs = require('fs');

var priv_key = fs.readFileSync('./key/privateC.txt')
var sha1 = crypto.createHash('sha1');

var Async = require('async');
var web3 = require('../../web3/server.js');
var model = require('../../mongodb/model');

router.post('/', function(res, req) {
    var Bcindex = model.Bcindex;

    var cip = req.body.cip;
    var key = req.body.key;
    //解密过程 解密cip放入certificate
    var dekey = crypto.privateDecrypt({key:priv_key,padding:crypto.constants.RSA_PKCS1_PADDING},new Buffer(key,'hex'))
    var decipher = crypto.createDecipher('aes-128-ecb',dekey);
    var decrypted = decipher.update(cip,'hex','utf8');
    decrypted += decipher.final('utf8');
    var certi = JSON.parse(decrypted);

    var intro = certi.intro;
    var type = certi.type;
    var value = certi.value;
    var md5 = certi.md5;
    var buyer = certi.buyer;
    var date = certi.date;
    var platformID = certi.platformID;
    var hash = certi.hash;

    var transaction = {
        "intro": intro,
        "type" : type,
        "value": value, 
        "md5"  : md5,
        "buyer": buyer,
        "date" : date,
        "platformID": platformID
    };
    //验证hash  return
    //SHA-1 HASH
    sha1.update(JSON.stringify(transaction));
    var tranhash = sha1.digest('hex');
    //验证失败
    if(tranhash != hash) {
        return;
    }
    //验证成功
    //else 
    var certificate = JSON.stringify({
        code: "",
        intro: intro,
        type: type,
        value: value,
        md5: md5,
        buyer: buyer,
        date: date,
        platformID: platformID
    });

    var code = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                'a', 'b', 'c', 'd', 'e', 'f', 'g',
                'h', 'i', 'j', 'k', 'l', 'm', 'n',
                'o', 'p', 'q', 'r', 's', 't',
                'u', 'v', 'w', 'x', 'y', 'z',
                'A', 'B', 'C', 'D', 'E', 'F', 'G',
                'H', 'I', 'J', 'K', 'L', 'M', 'M',
                'O', 'P', 'Q', 'R', 'S', 'T',
                'U', 'V', 'W', 'X', 'Y', 'Z']
    /* web3.js */

    /**
     * 根据实际情况改变
     */
    var coinbase = "0xa64a1f6ac24b3bfe7639c7358158a9fafea7d0c1";
    var user1 = "0x1835893a8564729c56281b1520aee27e2b8593d5";
    
    Async.waterfall([
        function gen_id(callback) {
            var transcode = "";
            for(var i=0; i<16; i++) {
                var codenumber = Math.round(62*Math.random); //id
                transcode = transcode + code[codenumber];
            }
            console.log("transcode: "+ transcode)
            callback(null, transcode);
        },
        function gen_trans(transcode, callback) {
            certificate.code = transcode;

            var data = '0x' + Buffer.from(certificate).toString('hex');

            web3.eth.sendTransaction({
                from: coinbase,
                to: user1,
                value: '0x00',
                data: data
            }, function(err, hash) {
                console.log(hash);
                callback(null, hash, transcode);
            });
        },
        function insert_db(hash, transcode, callback) {
             //操作MONGODB Bcindex 
            Bcindex.findOne({transhash: hash}, function(err, result) {
                if(err) {
                    res.sendStatus(500);
                    req.session.error = '网络异常错误，请检查';
                    console.log(err);
                } else if(result) {
                    console.log('重复存取');
                    res.sendStatus(500);
                } else {
                    Bcindex.create({
                        code: transcode,
                        time: date,
                        transhash: thash,
                        datahash: md5
                    })
                }
            });
            callback(null, transcode);
        },
        function code_back(transcode, callback) {
            
            callback(null);
        }
    ], function(err){
        if(err) 
            console.log(err);
    });  
})

module.exports = router;