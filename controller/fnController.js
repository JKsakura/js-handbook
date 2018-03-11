// =========================================
// Module Dependencies
// =========================================
const mongoose = require('mongoose');
const fs = require('fs');
const async = require('async');
const moment = require('moment');
const dbNote = require('../model/note.js');
const dbCategory = require('../model/category.js');
const dbCounter = require('../model/counter.js');
const dbTag = require('../model/tag.js');

module.exports = {
    // get pages
    getHome: getHomeFunc,
    getCategoryPage: getCategoryPageFunc,

    // post functions
    getNotes: getNotesFunc,
    saveNote: saveNoteFunc,
    deleteNote: deleteNoteFunc,
    getSingleNote: getSingleNoteFunc,
    
    getCategories: getCategoriesFunc
};


// =========================================
// Helper Functions
// =========================================
function cbMsg(type, msg) {
    return {
        code: type === 'success' ? 0 : 1,
        type: type,
        message: msg
    };
}
function validResult(res, msg) {
    var args = arguments;
    var obj = cbMsg('success', msg);
    if (args[2]) obj.result = args[2];
    return res.json(obj);
}
function invalidResult(res, msg) {
    if (typeof msg === 'object') {
        return res.json(msg);
    }
    else if (typeof msg === 'string') {
        return res.json(cbMsg('error', msg));
    }
    else {
        return res.json(new Error('Invalid input: message'));
    }
}
function assignNewId(type, obj, mainCb) {
    // process
    async.waterfall([
        // find old counter
        function(cb) {
            var query = { type: type };
            dbCounter.findOne(query, function(err, cntObj) {
                if (err) {
                    return cb(err);
                }
                if (!cntObj) {
                    cb(null, {});
                }
                else {
                    cb(null, cntObj);
                }
            });
        },
        
        // if no such db
        function(cntObj, cb) {
            if (cntObj && cntObj.type) {
                cb(null, cntObj);
            }
            else {
                var counterObj = {
                    type: type,
                    curr: 0,
                    dtModified: new Date()
                };
                dbCounter.create(counterObj, function(err, newCounter) {
                    if (err) {
                        return cb(err);
                    }
                    cb(null, newCounter);
                });
            }
            
        },
        
        // update counter
        function(cntObj, cb) {
            if (obj.id) {
                delete obj.id;
            }
            // set object id
            var id = cntObj.curr;
            obj.id = ++id;

            // update counter
            var updateObj = {
                $set: {
                    curr: id,
                    dtModified: new Date()
                }
            };
            dbCounter.findOneAndUpdate({ type: type }, updateObj, function(error, updatedObj) {
                if (error) {
                    return cb(error);
                }
                cb(null);
            });
        }
    ], function(err, result) {
        if (err) {
            mainCb(err);
        }
        mainCb(null, result);
    });
}
function getSingleNoteObj(idNote, mainCb) {
    var query = {
        id: idNote
    };
    dbNote.findOne(query, function(err, foundNote) {
        if (err) {
            return mainCb(err);
        }
        if (!foundNote) {
            return mainCb(cbMsg('error', "Unable to find the note!"));
        }
        mainCb(null, foundNote);
    });
}
function getNoteCategories(idCats, mainCb) {
    var query = {};
    if (idCats) {
        if (!Array.isArray(idCats)) {
            query._id = {$in: [idCats]};
        }
        else {
            query._id = {$in: idCats};
        }
    }
    dbCategory.find(query, function(err, categories) {
        if (err) {
            return mainCb(err);
        }
        if (!categories || !categories.length) {
            return mainCb(cbMsg('error', "Unable to find any category"));
        }
        mainCb(null, categories);
    });
}


// =========================================
// Function Definitions
// =========================================
function getHomeFunc(req, res, next) {
    // process
    async.waterfall([
        function (cb) {
            var params = {};
            getUserNotes(params, function(err, notes) {
                if (err) {
                    return cb(err);
                }
                cb(null, notes);
            });
        }
    ], function(err, result) {
        if (err) {
            return next(err);
        }
        return res.render('/handbook', {
            title: "Homepage",
            notes: result || []
        });
    });
}

function getCategoryPageFunc(req, res) {
    // process
    async.waterfall([
        function (cb) {
            getNoteCategories('', function(err, categories) {
                if (err) {
                    return cb(err);
                }
                cb(null, categories);
            });
        }
    ], function(err, result) {
        if (err) {
            return next(err);
        }
        return res.render('/category', {
            title: "Category",
            category: result || []
        });
    });
}

function getUserNotes(params, mainCb) {
    var query = params.query || {};
    var population = [
        {path: "tags"},
        {path: "category"}
    ];
    var selection = {id:1,title:1,category:1,introduction:1};
    
    dbNote.find(query).populate(population).select(selection).exec(function(err, results) {
        if (err) {
            return mainCb(err);
        }
        var notes = results.map(obj=>obj.toObject());
        notes.forEach(function(note) {
            if (note.tags && note.tags.length) {
                note.tags = note.tags.map(tag=>tag.name);
            }
        });
        mainCb(null, notes);
    });
}

function getNotesFunc(req, res) {
    return res.json({
        type: "error",
        code: 1,
        message: "Unable to do this currently"
    });
}

function saveNoteFunc(req, res) {
    let data = req.body;
    let noteObj = data.noteObj;

    // process
    async.waterfall([
        // check note tags. if any, create new tag if not exists
        function (cb) {
            if (!noteObj.tags || !Array.isArray(noteObj.tags) || !noteObj.tags.length) {
                cb(null);
            }
            else {
                checkAndUpdateNoteTags(noteObj, cb);
            }
        },
        
//        // check note Category, 
//        function(cb) {
//            if (!noteObj.category || !Array.isArray(noteObj.category) || !noteObj.category.length) {
//                cb(null);
//            }
//            else {
//                checkAndUpdateNoteCategory(noteObj, cb);
//            }
//        },
        
        // create/update note
        function(cb) {
            if (!noteObj._id) {
                console.log("create");
                createNote(noteObj, cb);
            }
            else {
                console.log("save");
                saveNote(noteObj, cb);
            }
        }
    ], function(err, result) {
        if (err) {
            return invalidResult(res, err);
        }
        validResult(res, 'Note has been saved!', result);
    });
}

function checkAndUpdateNoteTags(noteObj, mainCb) {
    var tags = noteObj.tags;
    var idTags = [];
    
    async.eachOfSeries(tags, function(tag, i, cb) {
        dbTag.findOne({name: tag}, function(err, foundTag) {
            if (err) {
                return cb(err);
            }
            if (foundTag) {
                idTags.push(foundTag._id);
                cb(null);
            }
            else {
                dbTag.create({name :tag}, function(error, newTag) {
                    if (error) {
                        return cb(err);
                    }
                    if (!newTag) {
                        return cb(cbMsg('error', 'Unable to create new tag.'));
                    }
                    idTags.push(newTag._id);
                    cb(null);
                });
            }
        });
    }, function(err) {
        if (err) {
            return mainCb(err);
        }
        noteObj.tags = idTags;
        mainCb(null);
    });
}

function createNote(noteObj, mainCb) {
    // process
    async.waterfall([
        // assing new ID
        function(cb) {
            assignNewId('note', noteObj, function(err, result) {
                if (err) {
                    return cb(err);
                }
                cb(null);
            });
        }, 
        
        // create new record in DB
        function(cb) {
            dbNote.create(noteObj, function(err, result) {
                if (err) {
                    return cb(err);
                }
                var note = result.toObject();
                if (noteObj.tags && noteObj.tags.length) {
                    note.tags = noteObj.tags;
                }
                cb(null, note);
            });
        }
    ], function(err, result) {
        if (err) {
            return mainCb(err);
        }
        mainCb(null, result);
    });
}

function saveNote(noteObj, mainCb) {
    var query = { _id: noteObj._id };
    var updateObj = noteObj;
    dbNote.findOneAndUpdate(query, updateObj, {new: true}, function(err, result) {
        if (err) {
            return mainCb(err);
        }
        var note = result.toObject();
        if (noteObj.tags && noteObj.tags.length) {
            note.tags = noteObj.tags;
        }
        mainCb(null, note);
    });
}

function deleteNoteFunc(req, res) {
    var _idNote = req.body._idNote;
    
    dbNote.findOneAndRemove({_id: _idNote}, function(err) {
        if (err) {
            return res.json(err);
        }
        return res.json({
            type:'succes',
            code: 0,
            message: "Note has been removed!"
        });
    });
}

function getSingleNoteFunc(req, res) {
    // fetch data
    var idNote = req.body.idNote;
    
    // process
    async.waterfall([
        function(cb) {
            getSingleNoteObj(idNote, cb);
        }
    ], function(err, result) {
        if (err) {
            return invalidResult(res, err.message);
        }
        validResult(res, '', result);
    });
}

function getCategoriesFunc(req, res) {
    var idCats = req.body.idCats;
    
    async.waterfall([
        function(cb) {
            getNoteCategories(idCats, cb);
        }
    ], function(err, results) {
        if (err) {
            return invalidResult(res, err.message);
        }
        validResult(res, '', results);
    });
}