jQuery(function ($) {
    // Declare Global Note Vars
    var noteID, notes;
    var categoryList = $("#categories-list"),
        noteList = $("#notes-list"),
        searchResult = $('#search-result'),
        categories = [
        {
            id: 0,
            slug: 'javascript',
            name: 'JavaScript',
            children: [4, 5, 6, 7, 8],
            notes: []
        },
        {
            id: 1,
            slug: 'html-dom',
            name: 'HTML DOM',
            children: [9, 10, 11, 12],
            notes: []
        },
        {
            id: 2,
            slug: 'html-objects',
            name: 'HTML Objects',
            children: [13, 14, 15, 16],
            notes: []
        },
        {
            id: 3,
            slug: 'other-objects',
            name: 'Other Objects',
            children: [17, 18, 19],
            notes: []
        },
        {
            id: 4,
            slug: 'array',
            name: 'Array',
            children: [],
            notes: []
        },
        {
            id: 6,
            slug: 'date',
            name: 'Date',
            children: [],
            notes: []
        },
        {
            id: 7,
            slug: 'error',
            name: 'Error',
            children: [],
            notes: []
        },
        {
            id: 5,
            slug: 'boolean',
            name: 'Boolean',
            children: [],
            notes: []
        },
        {
            id: 8,
            slug: 'global',
            name: 'Global',
            children: [],
            notes: []
        },
        {
            id: 9,
            slug: 'attribute',
            name: 'Attribute',
            children: [],
            notes: []
        },
        {
            id: 10,
            slug: 'console',
            name: 'Console',
            children: [],
            notes: []
        },
        {
            id: 11,
            slug: 'document',
            name: 'Document',
            children: [],
            notes: []
        },
        {
            id: 12,
            slug: 'element',
            name: 'Element',
            children: [],
            notes: []
        },
        {
            id: 13,
            slug: 'anchor',
            name: 'Anchor',
            children: [],
            notes: []
        },
        {
            id: 14,
            slug: 'abbreviation',
            name: 'Abbreviation',
            children: [],
            notes: []
        },
        {
            id: 15,
            slug: 'address',
            name: 'Address',
            children: [],
            notes: []
        },
        {
            id: 16,
            slug: 'area',
            name: 'Area',
            children: [],
            notes: []
        },
        {
            id: 17,
            slug: 'cssstyledeclaration',
            name: 'CSSStyleDeclaration',
            children: [],
            notes: []
        },
        {
            id: 18,
            slug: 'conversion',
            name: 'Conversion',
            children: [],
            notes: []
        },
        {
            id: 19,
            slug: 'storage',
            name: 'Storage',
            children: [],
            notes: []
        },
    ],
    cache = [];

/* ============================================================== */
/*    EVENT FOR ALL NOTE HEADING BUTTONS */
/* ============================================================== */
    var DOMManager = {
        noteHeader: function () {
            headerToggle.menuToggle();
            filterManager.iniCategory();
        },

        noteBody: function () {
            categoryManager.displayCategory();
        }
    };
/* ============================================================== */
/*    FUNCTIONS TO MANAGE THE NOTE HEADER  */
/* ============================================================== */
    // INITIAL NOTE BODY EVENTS
    var filterManager = {
        goSearch: function () {
            $(".filter-search").on("input", function () {
                var result = false;
                var search = $(this).val().trim().toUpperCase();
                if (search === '') {
                    $('.no-result').hide();
                    $(searchResult).hide();
                    $(searchResult).empty();
                    $(categoryList).show();
                    result = true;
                }
                cache.forEach( function(note){
                    // if (
                    //     note.title.trim().toUpperCase().indexOf(search) > -1 || 
                    //     categoryManager.fetchCategory(note.category).name.trim().toUpperCase().indexOf(search) > -1 || 
                    //     note.introduction.trim().toUpperCase().indexOf(search) > -1 || 
                    //     note.syntax.trim().toUpperCase().indexOf(search) > -1 || 
                    //     note.description.trim().toUpperCase().indexOf(search) > -1
                    // ) {
                    if (
                        search !== '' && note.title.trim().toUpperCase().indexOf(search) > -1
                    ) {
                        $('.no-result').hide();
                        $(categoryList).hide();
                        $(searchResult).show();
                        $(searchResult).append(note.element);
                        // $(note.element).show();
                        result = true;
                    }
                });
                // $(categoryList).find("p.list-group-item").each(function () {
                //     $(this).hide();
                //     if ($(this).html().toUpperCase().indexOf(search) > -1) {
                //         $(this).show();
                //         result = true;
                //     }
                // });
                if (result === false) {
                    $(categoryList).hide();
                    $(searchResult).hide();
                    $(searchResult).empty();
                    $('.no-result').show();
                }
            });
        },
        iniCategory: function () {
            var defaultVal = '<option value="" disabled selected>Category</option>';
            var filterCategory = $("#filter-category").append(defaultVal, "<option value='all'>All</option>");
            categories.forEach(function(category) {
                if (category.children.length > 0) {
                    var newCategory = $("<option></option>").text(category.name).val(category.slug).appendTo(filterCategory);
                }
            });
        },
        goFilter: function () {
            $("#filter-category").change(function() {
                var result = false;
                var filterCategory = $(this).val();
                $(categoryList).find(".category").hide();
                $(categoryList).find(".category").each(function () {
                    if( filterCategory === "all") {
                        $(categoryList).find(".category").show();
                        result = true;
                    } else if ($(this).data('category') === filterCategory) {
                        $(this).show();
                        result = true;
                    }
                });
                if (result === false) {
                    $('.no-result').show();
                }
            });
        }
    };

/* ============================================================== */
/*    FUNCTIONS TO MANAGE THE CATEGORY LIST  */
/* ============================================================== */
    var categoryManager = {
        displayCategory: function() {
            var listCategory,
                listClass;
            categories.forEach(function (category) {
                if (category.children.length > 0) {
                    listClass = "category";
                    listTitle = $("<p class='list-group-item'></p>").text(category.name);
                    listCategory = $("<li></li>").addClass(listClass).data('category', category.slug).append(listTitle, "<ul></ul>");
                    category.children.forEach(function (element) {
                        var subcategory = categoryManager.fetchCategory(element),
                            itemClass = "list-item list-group-item list-group-item-action",
                            linkClass = "list-trigger",
                            listLink = $("<a></a>").attr("href", "#" + subcategory.id).text(subcategory.name).addClass(linkClass).append(subcategory);
                            listItem = $("<li></li>").addClass(itemClass).append(listLink);
                            $(listCategory).find('ul').append(listItem);
                    });
                    $(categoryList).append(listCategory);
                }
            });
        },
        fetchCategory: function (targetID) {
            // Get 
            var index = categories.map(function (element) {
                return element.id;
            }).indexOf(targetID);
            return categories[index];
        }
    };
/* ============================================================== */
/*    FUNCTIONS TO MANAGE THE NOTE LIST  */
/* ============================================================== */
    var noteManager = {
        // DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE
        displayNote: function (note) {
            // Define ID
            var itemId = "note" + note.id;

            // Define Classes
            var itemClass = "list-item list-group-item list-group-item-action",
                headerClass = "item-header",
                topClass = "item-top",
                TitleClass = "item-title note-field-text",
                categoryClass = "item-category note-field-select",
                introductionClass = "item-introduction note-field-area",
                linkClass = "detail-trigger";

            /* =========== Item Top ============ */
            // Item Header
            var itemTitle = $("<p></p>").addClass(TitleClass).text(note.title);
            var itemCategory = $("<h5></h5>").addClass(categoryClass).text(categoryManager.fetchCategory(note.subcategory).name);
            var itemHeader = $("<div></div>").addClass(headerClass).append(itemTitle, itemCategory);

            // Item Introduction
            var itemIntroduction = $("<p></p>").addClass(introductionClass).text(note.introduction);
            var itemTop = $("<div></div>").addClass(topClass).append(itemHeader, itemIntroduction);

            /* =========== List Item ============ */
            var listLink = $("<a></a>").attr("href", "#" + itemId).addClass(linkClass).append(itemTop);
            var listItem = $("<li></li>").attr("id", itemId).addClass(itemClass).append(listLink);

            //$(noteList).find(".category-" + note.category).find("ul").append(listItem);
            cache.push({ // Add an object to the cache array
                element: listItem, // This row
                id: note.id,
                title: note.title,
                category: note.category,
                subcategory: note.subcategory,
                introduction: note.introduction,
                syntax: note.syntax,
                description: note.description
            });
        },
        fetchDetail: function (target) {
            var id = target.hash.slice(5);
            var index = notes.map(function (element) {
                return element.id.toString();
            }).indexOf(id);
            note = notes[index];
            noteManager.displayDetail(note);
        },
        displayDetail: function(note) {
            var detailTitle = $(".detail-title").html(note.title),
                detailCategory = $(".detail-category").html(categoryManager.fetchCategory(note.subcategory).name),
                detailIntroduction = $(".detail-introduction").html(note.introduction),
                detailSyntax = $(".detail-syntax").addClass("code").html(note.syntax),
                detailDescription = $(".detail-description").html(note.description);
            hljs.initHighlightingOnLoad();
            hljs.configure({ useBR: true });
            $('.code').each(function (i, block) {
                hljs.highlightBlock(block);
            });
        },
        fetchNote: function(targetID) {
            // Find the note with the assigned ID
            var index = notes.map(function (element) {
                return element.id;
            }).indexOf(targetID);
            return notes[index];
        },
        fetchCache: function (targetID) {
            // Find the note with the assigned ID
            var index = cache.map(function (element) {
                return element.id;
            }).indexOf(targetID);
            return cache[index];
        }
    };

/* ============================================================== */
/* FUNCTIONS TO LOAD AND SAVE JSON DATA */
/* ============================================================== */
    var dataManager = {
        loadData: function () {
            $.getJSON("notes.json")
            .done(function (data) {
                notes = data.notes ? data.notes : [];
                noteID = 0;
                if (notes.length > 0) {
                    notes.forEach(function(note) {
                        noteManager.displayNote(note);
                        var category = categoryManager.fetchCategory(note.subcategory);
                        category.notes.push(note.id);
                        if (note.id >= noteID) { noteID = note.id + 1; }
                    });
                }
                if(location.hash) {
                    noteManager.fetchDetail(location);
                    pageToggle.pageForward(".page1", ".page2");
                }
                DOMManager.noteHeader();
                DOMManager.noteBody();
            })
            .fail(function (d, textStatus, error) {
                console.error("getJSON failed, status: " + textStatus + ", error: " + error);
            })
            .always(function () {
                console.log("complete");
            });
        }
    };
/* ============================================================== */
/* FUNCTIONS TO MANAGE THE PAGE EVENT */
/* ============================================================== */
    function pageManager() {
        pageToggle.pageInit("1");
        $(".page").each(function () {
            $(this).on("click", function (e) {
                var target = e.target;
                if ($(target).is(".detail-trigger")) {
                    e.preventDefault();
                    noteManager.fetchDetail(target);
                    pageToggle.pageForward("2", "3");
                }
                if ($(target).is("p.list-group-item")) {
                    $(target).each(function () {
                        console.log($(this).next("ul"));
                        $(this).next("ul").stop().slideToggle(300);
                        $(this).stop().toggleClass("closed");
                    });
                }
                if ($(target).is(".back-to-all")) {
                    e.preventDefault();
                    pageToggle.pageBackward();
                }
                if ($(target).is('.list-trigger')) {
                    e.preventDefault();
                    var current = target.hash.slice(1),
                        category = categoryManager.fetchCategory(Number(current));
                    $(noteList).empty();
                    category.notes.forEach(function (note) {
                        current = noteManager.fetchCache(note);
                        $(noteList).append(current.element);
                    });
                    pageToggle.pageForward("1", "2");
                }
            });
        });
    }
    // LOAD DATA FROM JSON FILE
    dataManager.loadData();

    // INITIAL HEADER FILTER
    filterManager.goSearch();
    filterManager.goFilter();

    pageManager();
});