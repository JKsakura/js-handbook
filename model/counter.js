const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjId = mongoose.Schema.ObjId;

let counter = new Schema({
    type: {type: String, trim: true},
    curr: {type: Number},
    dtModified: {type: Date, default: Date.now}
}, {collection: 'Counter'});

let _Counter = mongoose.model('counter', counter);

module.exports = _Counter;