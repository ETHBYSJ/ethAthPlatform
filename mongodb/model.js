/**
 * Collections: bcindexs, users
 */

var mongoose = require('./db.js');

var bcindexSchema = new mongoose.Schema({
    transcode:  { type: String },
    date:       { type: String },
    transhash:  { type: String },
    datahash:   { type: String } 
});

var Bcindex = mongoose.model('Bcindex', bcindexSchema);


var userSchema = new mongoose.Schema({
    account:    { type: String }, //账号
    password:   { type: String }, //密码
    eth:        { type: String }, //以太坊账号
    balance:    { type: Number },  //余额
    id:         { type: String },
    sex:        { type: String },
    birthday:   { type: String },
    intro:      { type: String },
    question:   { type: String },
    answer:     { type: String },
});

var User = mongoose.model('User', userSchema);


module.exports = {
    Bcindex: Bcindex,
    User: User
}