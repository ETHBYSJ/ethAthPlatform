var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var fs = require('fs');

var priv_key = fs.readFileSync('./key/privateC.txt')
var pub_keyA = fs.readFileSync('./key/publicA.txt');


var Async = require('async');
var web3 = require('../../web3/server.js');
var model = require('../../mongodb/model');

function randKey() {
	var len = Math.floor(Math.random()*8+8); //8-15
	var text = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var pwd = "";
	for(var i=0; i<len; ++i) {
		pwd += text.charAt(Math.random()*1000%text.length);
	}
	return pwd;
}


router.get('/', function(req, res, next) {
    res.render("test", {title: 'trans'});
}).post('/', function(req, res) {
    var Bcindex = model.Bcindex;

    var cip = req.body.cip;
    var key = req.body.key;
    console.log('step1: get req');
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
    var sha1 = crypto.createHash('sha1');
    sha1.update(JSON.stringify(transaction));
    var tranhash = sha1.digest('hex');
    console.log("SHA-1:" + tranhash);
    
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

    
    // web3.js

    var coinbase = "0xe8990c58659fa440a18b435b131d2b82fcd26758";
    var user1 = "0xc7e98fdbbbc57fb7768c4df502db14f173bcc263";

    console.log('step2')
    
    Async.waterfall([
        function gen_id(callback) {
            var transcode = "";
            var text = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            for(var i=0; i<16; i++) {
                var codenumber = Math.round(62*Math.random());
                transcode += text.charAt(codenumber);
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
                        transcode: transcode,
                        time: date,
                        transhash: hash,
                        datahash: md5
                    })
                }
            });
            callback(null, transcode);
        },
        function code_back(transcode, callback) {
            var code_msg = {
                "code": transcode
            };
            //sha1 hash
            var sha1 = crypto.createHash('sha1');
            sha1.update(JSON.stringify(code_msg)); //hash的是json
            var hash = sha1.digest('hex');
            
            var msg = {
                "code": transcode,
                "hash": hash
            }
            console.log(JSON.stringify(msg))
            //AES KEY 生成
			var key = randKey();
			//AES加密 update_msg -> update_cip
			const cipher = crypto.createCipher('aes-128-ecb', key);
			var cipherResult = cipher.update(JSON.stringify(msg), 'utf8', 'hex');
			cipherResult = cipherResult + cipher.final('hex');
				
			var rsakey = crypto.publicEncrypt({key:pub_keyA, padding:crypto.constants.RSA_PKCS1_PADDING}, new Buffer(key));
			var data_cip = {
				"cip": cipherResult,
                "key": rsakey.toString('hex')
            };
            res.send(data_cip);
            callback(null);
        }
    ], function(err){
        if(err) 
            console.log(err);
    });  
})

module.exports = router;