/**
 * Collections: users
 */

var mongoose = require('./db.js');

var userSchema = new mongoose.Schema({
    id:         { type: Number },
    account:    { type: String },
    password:   { type: String }   
});

module.exports = mongoose.model('user', userSchema)