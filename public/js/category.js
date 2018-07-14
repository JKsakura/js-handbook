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