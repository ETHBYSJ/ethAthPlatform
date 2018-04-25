/**
 * Collections: bcindexs, users
 */

var mongoose = require('./db.js');

var bcindexSchema = new mongoose.Schema({
    id:    { type: Number },
    time:  { type: Date },
    index: { type: Number },
    extra: { type: String }   
});

var Bcindex = mongoose.model('Bcindex', bcindexSchema);


var userSchema = new mongoose.Schema({
    account:    { type: String },
    password:   { type: String }, 
    eth:        { type: String },
    category:   { type: Number }
});

var User = mongoose.model('User', userSchema);

module.exports = {
    Bcindex: Bcindex,
    User: User
}