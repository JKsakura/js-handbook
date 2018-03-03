const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjId = mongoose.Schema.ObjId;

let tag = new Schema({
    name: {type: String, trim: true},
    ranking: {type: Number},
    dtCreated: {type: Date, default: Date.now}
}, {collection: 'Tag'});

let _Note = mongoose.model('tag', tag);

module.exports = _Note;
