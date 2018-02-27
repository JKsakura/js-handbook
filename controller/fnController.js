// =========================================
// Module Dependencies
// =========================================
const mongoose = require('mongoose');
const fs = require('fs');
const async = require('async');
const moment = require('moment');
const dbNote = require('../model/note.js');

module.exports = {
    // get pages
    getHome: getHomeFunc,

    // post functions
    getNotes: getNotesFunc,
    saveNote: saveNoteFunc,
    deleteNote: deleteNoteFunc
};

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
    
    dbNote.create(noteObj, function(err, result) {
        if (err) {
            return res.json(err);
        }
        return res.json({
            type:'succes',
            code: 0,
            message: "Successfully saved!",
            result: result
        });
    });
}

function deleteNoteFunc(req, res) {
    return res.json({
        type: "error",
        code: 1,
        message: "Unable to do this currently"
    });
}