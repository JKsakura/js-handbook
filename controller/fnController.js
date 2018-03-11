// =========================================
// Module Dependencies
// =========================================
const mongoose = require('mongoose');
const fs = require('fs');
const async = require('async');
const moment = require('moment');
const dbNote = require('../model/note.js');
const dbCounter = require('../model/counter.js');
const dbCategory = require('../model/category.js');
const dbTag = require('../model/tag.js');

module.exports = {
    // get pages
    getHome: getHomeFunc,
    getCategoryPage: getCategoryPageFunc,
    // ONLY for test
    testCategoryPage: testCategoryPageFunc,
    testUpdateCategoriesFunc: testUpdateCategoriesFunc,

    // post functions
    getNotes: getNotesFunc,
    saveNote: saveNoteFunc,
    deleteNote: deleteNoteFunc
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
        return res.render('./handbook', {
            title: "Homepage",
            notes: result || []
        });
    });
}

function getCategoryPageFunc(req, res, next) {
    // process
    async.waterfall([
        function (cb) {
            dbCategory.find({}, function(err, categories) {
                if (err) {
                    return cb(err);
                }
                var catName = categories.map(obj=>obj.toObject().name);
                cb(null, catName);
            });
        }
    ], function(err, result) {
        if (err) {
            return next(err);
        }
        return res.render('./category', {
            title: "Category",
            category: result || []
        });
    });
}

function testCategoryPageFunc(req, res, next) {
    // process
    async.waterfall([
        
    ], function(err, result) {
        if (err) {
            return next(err);
        }
        return res.render('./testCategory', {
            title: "Test-Category"
        });
    });
}

function testUpdateCategoriesFunc(req, res) {
    // fetch data
    var category = req.body.categoty || [];
    
    dbCategory.remove({}, function (err) {
        if (err) {
            return invalidResult(res, err.message);
        }
        async.eachOfSeries(category, function(cat, i, cb) {
            var newCat = {
                id: i+1,
                name: cat
            };
            dbCategory.create(newCat, function(e) {
                if (e) {
                    return cb(e);
                }
                cb(null);
            });
        }, function(e) {
            if (e) {
                return invalidResult(res, e.message);
            }
            console.log("Success");
            validResult(res, 'Update all categories!');
        });
    });
}

function getUserNotes(params, mainCb) {
    var query = params.query || {};
    var selection = {id:1,category:1,tags:1,title:1,introduction:1};
    var population = [
        {path: "tags"},
        {path: "category"}
    ];
    
    dbNote.find(query).populate(population).select(selection).exec(function(err, results) {
        if (err) {
            return mainCb(err);
        }
        var notes = results.map(obj=>obj.toObject());
        notes.forEach(function(note) {
            if (note.tags && note.tags.length) {
                note.tags = note.tags.map(tag=>tag.name);
            }
            if (note.category && note.category.name) {
                note.category = note.category.name;
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
    let noteCat = noteObj.category;
    
    // process
    async.waterfall([
        // check if category exists. no? return error
        function(cb) {
            if (!noteObj.category || !noteObj.category.trim()) {
                return cb(new Error("Unable to create note because you don't have any category."));
            }
            else {
                findCategoryRef(noteObj, cb);
            }
        },
        
        // check note tags. if any, create new tag if not exists
        function (cb) {
            if (!noteObj.tags || !Array.isArray(noteObj.tags) || !noteObj.tags.length) {
                cb(null);
            }
            else {
                checkAndUpdateNoteTags(noteObj, cb);
            }
        },
        
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
        result.category = noteCat;
        validResult(res, 'Note has been saved!', result);
    });
}

function findCategoryRef(noteObj, mainCb) {
    var category = noteObj.category;
    
    async.waterfall([
        function(cb) {
            dbCategory.findOne({name: category}, function(err, foundCat) {
                if (err) {
                    return cb(err);
                }
                if (!foundCat || !foundCat._id) {
                    return cb(cbMsg('error', "Unable to find the category!"));
                }
                cb(null, foundCat._id);
            });
        }
    ], function(err, idCat) {
        if (err) {
            return mainCb(err);
        }
        noteObj.category = idCat.toString();
        mainCb(null);
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