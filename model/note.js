const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjId = mongoose.Schema.ObjId;

let note = new Schema({
    id: {type: String, trim: true},
    title: {type: String, trim: true},
    cat: {type: String, trim: true}
}, {collection: 'Notes'});

let _Note = mongoose.model('note', note);

module.exports = _Note;