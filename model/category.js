const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjId = Schema.ObjectId;

let category = new Schema({
    id: {type: Number},
    name: {type: String, trim: true},
    idNotes: [{
        type: ObjId, 
        ref: 'note'
    }]
}, {collection: 'Tag'});

let _Category = mongoose.model('category', category);

module.exports = _Category;
