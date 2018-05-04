import { randomBytes } from 'crypto';

var express = require('express');
var router = express.Router();

var Async = require('async');
var web3 = require('../../web3/server.js');
var model = require('../../mongodb/model');

app.post('/', function(res, req) {
    var Bcindex = model.Bcindex;

    var intro = req.body.intro; //string
    var type  = req.body.type;  //number
    var value = req.body.value; //string
    var md5   = req.body.md5;   //string
    var date  = req.body.date;  //date
    /* web3.js */
    var msg = JSON.stringify({
        intro: intro,
        type: type,
        value: value,
        md5: md5,
        date: date
    });
    console.log(msg);
    var data = '0x' + Buffer.from(msg).toString('hex');
    var coinbase = "0xa64a1f6ac24b3bfe7639c7358158a9fafea7d0c1";
    var user1 = "0x1835893a8564729c56281b1520aee27e2b8593d5";
    
    Async.waterfall([
        function gen_trans(callback) {
            web3.eth.sendTransaction({
                from: coinbase,
                to: user1,
                value: '0x00',
                data: data
            }, function(err, hash) {
                console.log(hash);
                callback(null, hash);
            });
        },
        function gen_id(hash, callback) {
            var idnumber = Math.round(99999999*Math.random); //id
            
            console.log(idnumber);
            var thash = hash;
            callback(null, thash, idnumber);
        },
        function insert_db(thash, idnumberm, callback) {
             /* 操作MONGODB Bcindex */
            Bcindex.findOne({transhash: thash}, function(err, result) {
                if(err) {
                    res.sendStatus(500);
                    req.session.error = '网络异常错误，请检查';
                    console.log(err);
                } else if(result) {
                    console.log('重复存取');
                    res.sendStatus(500);
                } else {
                    Bcindex.create({
                        id: idnumber,
                        time: date,
                        transhash: thash,
                        datahash: md5
                    })
                }
            });
            callback(null);
        }
    ], function(err){
        if(err) 
            console.log(err);
    });

})