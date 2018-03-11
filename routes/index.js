const ctrl = require('../controller/fnController');

module.exports = function(app) {
    // get
    app.get('/', ctrl.getHome);
    app.get('/category', ctrl.getCategoryPage);

    // post
    app.post('/getNotes', ctrl.getNotes);
    app.post('/saveNote', ctrl.saveNote);
    app.post('/deleteNote', ctrl.deleteNote);
    app.post('/getSingleNote', ctrl.getSingleNote);
    
    app.post('/getCategories', ctrl.getCategories);
};