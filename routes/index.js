const ctrl = require('../controller/fnController');

module.exports = function(app) {
    // get
    app.get('/', ctrl.getHome);

    // post
    app.post('/getNotes', ctrl.getNotes);
    app.post('/saveNote', ctrl.saveNote);
    app.post('/deleteNote', ctrl.deleteNote);
};