/**
 * Collections: dbindexs
 */

var mongoose = require('./db.js');

var bcindexSchema = new mongoose.Schema({
    id:    { type: Number },
    time:  { type: Date },
    index: { type: Number },
    extra: { type: String }   
});

module.exports = mongoose.model('bcindex', bcindexSchema);