// =========================================
// Module Dependencies
// =========================================
const mongoose = require('mongoose');
const fs = require('fs');
const async = require('async');
const moment = require('moment');
const dbNote = require('../model/note.js');
const dbCounter = require('../model/counter.js');

module.exports = {
    // get pages
    getHome: getHomeFunc,

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
    if (arguments[2]) obj.result = arguments[2];
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
                    id: id,
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
        return res.render('handbook', {
            title: "Homepage",
            notes: result || []
        });
    });
}

function getUserNotes(params, mainCb) {
    var query = params.query || {};
    
    dbNote.find(query, function(err, notes) {
        if (err) {
            return mainCb(err);
        }
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
        function(cb) {
            if (!noteObj._id) {
                createNote(noteObj, cb);
            }
            else {
                saveNote(noteObj, cb);
            }
        }
    ], function(err) {
        if (err) {
            return invalidResult(res, err);
        }
        validResult(res, 'Note has been saved!');
    });
}

function createNote(noteObj, mainCb) {
    // process
    async.waterfall([
        // assing new ID
        function(cb) {
            assignNewId('note', noteObj, cb);
        }, 
        
        // create new record in DB
        function(cb) {
            dbNote.create(noteObj, function(err, result) {
                if (err) {
                    return cb(err);
                }
                cb(null, result);
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
    dbNote.findOneAndUpdate(query, updateObj, function(err, result) {
        if (err) {
            return mainCb(err);
        }
        mainCb(null, result);
    });
}

function deleteNoteFunc(req, res) {
    var _idNote = req._idNote;
    
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