var Web3 = require('web3');
var config = require('./config.js')

var web3 = new Web3(config.web3j);


if (web3!==undefined) {
    console.log('geth connection succeeded : '+config.web3j);
} else {
    config.log('Geth connection failed')
}
/*
web3.eth.getAccounts().then(function(res, err){
	console.log(res[0]);
	
	web3.eth.getBalance(res[0]).then(function(doc, err) {
		console.log(doc);
	});
});*/

module.exports = web3;