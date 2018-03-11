const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjId = Schema.ObjectId;

let note = new Schema({
    id: {type: Number},
    title: {type: String, trim: true},
    category: [{
        type: ObjId,
        ref: 'category'
    }],
    introduction: {type: String, trim: true},
    syntax: {type: String, trim: true},
    description: {type: String, trim: true},
    dtCreated: {type: Date, default: Date.now},  
    // tags - for grouping
    tags: []
}, {collection: 'Notes'});

let _Note = mongoose.model('note', note);

module.exports = _Note;