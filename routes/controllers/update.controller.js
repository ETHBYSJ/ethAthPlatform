var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var fs = require('fs');

var web3 = require('../../web3/server.js');
var model = require('../../mongodb/model');

var pub_keyA = fs.readFileSync('./key/publicA.txt');
var pri_keyC = fs.readFileSync('./key/privateC.txt');

/* GET home page. */
router.get('/', function(req, res, next) {
	if(!req.session.user) {
		req.session.error = "请先登录";
		console.log(res.locals.message);
		res.redirect("/login");
	}
  	res.render('update', { title: 'ethAthPlatform' , user:res.locals.user.account});
}).post('/', find_update);

router.get('/data', function(req, res, net) {
	res.render('test', { title: 'data'});
}).post('/data', make_data);

function randKey() {
	var len = Math.floor(Math.random()*8+8); //8-15
	var text = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	var pwd = "";
	for(var i=0; i<len; ++i) {
		pwd += text.charAt(Math.random()*1000%text.length);
	}
	return pwd;
}

function find_update(req, res) {
	var code = req.body.tcode;
	var md5  = req.body.tmd5;

	var Bcindex = model.Bcindex;

	Bcindex.findOne({transcode: code, datahash: md5}, function(err, result) {
		if(err) {
			console.log(err);
			return;
		}
		if(result == undefined) {
			console.log("Error3: code not found");
			res.send([]);
		} else {
			var transhash = result.transhash;

			web3.eth.getTransaction(transhash).then(function(result) {
				var inputData = result.input;
				var res_str = Buffer.from(inputData.replace('0x',''), 'hex').toString();
				var res_obj = JSON.parse(res_str);

				var sha1 = crypto.createHash('sha1');
				//生成hash
				var u_type  = res_obj.type;
				var u_value = res_obj.value;
				var u_md5	= res_obj.md5;

				var hash_msg = {
					"md5":	 u_md5,
					"type":  u_type,
					"value": u_value,
				}
				sha1.update(JSON.stringify(hash_msg)); //hash的是json
				var u_hash = sha1.digest('hex');
				var update_msg = {
					"md5":   u_md5,
					"type":  u_type,
					"value": u_value,
					"hash":  u_hash
				};
				//AES KEY 生成
				var key = randKey();
				//AES加密 update_msg -> update_cip
				const cipher = crypto.createCipher('aes-128-ecb', key);
				var cipherResult = cipher.update(JSON.stringify(update_msg), 'utf8', 'hex');
				cipherResult = cipherResult + cipher.final('hex');
				
				var rsakey = crypto.publicEncrypt({key:pub_keyA, padding:crypto.constants.RSA_PKCS1_PADDING}, new Buffer(key));
				var update_cip = {
					"cip": cipherResult,
					"key": rsakey.toString('hex')
				};

				res.send(update_cip);
			})
		}
	})
}


function make_data(req, res) {
	var cip = req.body.cip;
	var key = req.body.key;

	console.log('cip: ' + cip);
	console.log('key: ' + key);

	//解密过程 解密cip放入msg
    var dekey = crypto.privateDecrypt({key:pri_keyC, padding:crypto.constants.RSA_PKCS1_PADDING}, new Buffer(key,'hex'))
    var decipher = crypto.createDecipher('aes-128-ecb', dekey);
    var decrypted = decipher.update(cip, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	console.log('decryted: ' + decrypted);
	var msg = JSON.parse(decrypted);
	//验证hash
	var transaction = {
		//"intro": msg.intro,
		//"value": msg.value,
		//"date":  msg.date
		"update": msg.update
	};
	var sha1 = crypto.createHash('sha1');
	sha1.update(JSON.stringify(transaction));
	var tranhash = sha1.digest('hex');
	console.log('hash:' + tranhash);
    //验证失败
    if(tranhash != msg.hash) {
        return;
    }
	//验证成功
	if(msg.update==1) {
		console.log('有更新');
	} else if(msg.update==0) {
		console.log('无更新');
	}
    //else 
	var update_op = ["无更新", "有更新"]
	var display_msg = [{
		"name": "更新情况",
		"value": update_op[msg.update]
	}];
	/*
	[
		{
			"name": "更新简介",
			"value": msg.intro
		},
		{
			"name": "版本号",
			"value": msg.value
		},
		{
			"name": "更新日期",
			"value": msg.date
		}
	]*/

	res.send(display_msg);
}

module.exports = router;