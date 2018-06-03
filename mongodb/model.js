/**
 * Collections: bcindexs, users
 */

var mongoose = require('./db.js');

var bcindexSchema = new mongoose.Schema({
    transcode:  { type: Number },
    time:       { type: Date },
    transhash:  { type: String },
    datahash:   { type: String } 
});

var Bcindex = mongoose.model('Bcindex', bcindexSchema);


var userSchema = new mongoose.Schema({
    account:    { type: String },
    password:   { type: String }, 
    eth:        { type: String },
    balance:    { type: Number }
});

var User = mongoose.model('User', userSchema);

module.exports = {
    Bcindex: Bcindex,
    User: User
}