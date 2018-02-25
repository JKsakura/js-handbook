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
    saveNote: saveNoteFunc
}

// =========================================
// Function Definitions
// =========================================
function getHomeFunc(req, res, next) {
    return res.render('handbook', {
        title: "Homepage"
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
        })
    });
}