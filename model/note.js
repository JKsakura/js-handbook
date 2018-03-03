const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjId = mongoose.Schema.ObjId;

let note = new Schema({
    id: {type: Number},
    title: {type: String, trim: true},
    category: {type: String, trim: true},
    introduction: {type: String, trim: true},
    syntax: {type: String, trim: true},
    description: {type: String, trim: true},
    dtCreated: {type: Date, default: Date.now}
}, {collection: 'Notes'});

let _Note = mongoose.model('note', note);

module.exports = _Note;