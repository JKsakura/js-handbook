const ctrl = require('../controller/fnController');

module.exports = function(app) {
    // get
    app.get('/', ctrl.getHome);
    app.get('/category', ctrl.getCategoryPage);
    app.get('/testCategoryPage', ctrl.testCategoryPage);

    // post
    app.post('/getNotes', ctrl.getNotes);
    app.post('/saveNote', ctrl.saveNote);
    app.post('/deleteNote', ctrl.deleteNote);
    // ONLY FOR TEST
    app.post('/testUpdateCategories', ctrl.testUpdateCategoriesFunc);
};