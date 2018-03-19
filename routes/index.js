const ctrl = require('../controller/fnController');

module.exports = function(app) {
    // get
    app.get('/', ctrl.getCategoryPage);
    app.get('/admin', ctrl.getHome);

    // post
    app.post('/getNotes', ctrl.getNotes);
    app.post('/saveNote', ctrl.saveNote);
    app.post('/deleteNote', ctrl.deleteNote);

    // ONLY FOR TEST
    app.get('/testCategoryPage', ctrl.testCategoryPage);
    app.post('/testUpdateCategories', ctrl.testUpdateCategoriesFunc);
};