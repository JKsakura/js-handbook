const ctrl = require('../controller/fnController');

module.exports = function(app) {
    // get
    app.get('/', ctrl.getHome);

    // post
    app.post('/saveNote', ctrl.saveNote);
}