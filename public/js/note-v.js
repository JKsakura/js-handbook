/* ============================================================== */
/* FUNCTIONS TO LOAD AND SAVE JSON DATA */
/* ============================================================== */
Vue.component('main-menu', {
    data: function() {
        return {
            menus: [
                { text: "Home", link: "index.html" },
                { text: "Admin", link: "admin.html" }
            ]
        };
    },
    template: '<ul id="main-menu"><li v-for="menu in menus"><a href="{{ menu.link }}">{{ menu.text }}</a></li></ul>'
});

var app = new Vue({
    el: '#app',
    data: {
        categories: ["array", "booleans", "date", "error", "global"],
        noteID: null,
        notes: null,
        showMainMenu: false,
        hideNoteList: false,
        showNoteDetail: false,
        detailTitle: null,
        detailCategory: null,
        detailIntroduction: null,
        detailSyntax: null,
        detailDescription: null
    },
    methods: {
        displayNoteDetail: function(note, event) {
            if (event) event.preventDefault();
            this.detailTitle = note.title;
            this.detailCategory = note.category;
            this.detailIntroduction = note.introduction;
            this.detailSyntax = note.syntax;
            this.detailDescription = note.description;
            hljs.initHighlightingOnLoad();
            hljs.configure({ useBR: true });
            $('.code').each(function (i, block) {
                hljs.highlightBlock(block);
            });
            this.hideNoteList = true;
            this.showNoteDetail = true;
        },
        hideNoteDetail: function(event) {
            if (event) event.preventDefault();
            this.showNoteDetail = false;
            this.hideNoteList = false;
        }
    },
    mounted: function() {
        var _this = this;
        $.getJSON("notes.json")
        .done(function (data) {
            _this.notes = data.notes ? data.notes : [];
            noteID = 0;
            _this.notes.forEach(function(note) {
                if (note.id >= _this.noteID) { _this.noteID = note.id + 1; }
            });
        })
        .fail(function (d, textStatus, error) {
            console.error("getJSON failed, status: " + textStatus + ", error: " + error);
        })
        .always(function () {
            console.log("complete");
        });
    }
});