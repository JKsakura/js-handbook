jQuery(function($){
    // Declare Global Note Vars
    var noteID, notes;
    // Declare Global CKEditor WYSIWYG Fields
    var syntaxEditor = CKEDITOR.replace("form-syntax"),
        descriptionEditor = CKEDITOR.replace("form-description"),
        formEl = $("#note-form"),
        noteList = $("#note-table"),
        noteBody = $("#note-table tbody"),
        categories = [
            {
                id: 0,
                slug: 'javascript',
                name: 'JavaScript',
                children: [4,5,6,7,8],
                notes: []
            },
            {
                id: 1,
                slug: 'html-dom',
                name: 'HTML DOM',
                children: [9,10,11,12],
                notes: []
            },
            {
                id: 2,
                slug: 'html-objects',
                name: 'HTML Objects',
                children: [13,14,15,16],
                notes: []
            },
            {
                id: 3,
                slug: 'other-objects',
                name: 'Other Objects',
                children: [17,18,19],
                notes: []
            },
            {
                id: 4,
                slug: 'array',
                name: 'Array',
                children: [],
                notes: [0,1,2]
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
                notes: [3,4]
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
            $(".notes-header").on("click", function (e) {
                var target = e.target;
                if ($(target).is(".add-btn")) {
                    formManager.setForm(e);
                } else if ($(target).hasClass("cancel-btn")) {
                    pageToggle.pageBackward();
                }
            });
        },
        noteBody: function () {
            categoryManager.displayCategory();
            $(noteList).find("tbody").each(function () {
                noteManager.orderNote(this);
            });
            noteManager.sortNote();
        }
    };
    
/* ============================================================== */
/*    FUNCTIONS TO MANAGE THE NOTE HEADER  */
/* ============================================================== */
// INITIAL NOTE BODY EVENTS
    var filterManager = {
        goSearch: function () {
            $("#filter-search").on("input", function () {
                var search = $(this).val().trim().toUpperCase();
                var result = false;
                cache.forEach(function (note) {
                    note.element.hide();
                    // if (
                    //     note.title.trim().toUpperCase().indexOf(search) > -1 || 
                    //     categoryManager.fetchCategory(note.category).name.trim().toUpperCase().indexOf(search) > -1 || 
                    //     note.introduction.trim().toUpperCase().indexOf(search) > -1 || 
                    //     note.syntax.trim().toUpperCase().indexOf(search) > -1 || 
                    //     note.description.trim().toUpperCase().indexOf(search) > -1
                    // ) {
                    if (
                        search === '' || note.title.trim().toUpperCase().indexOf(search) > -1
                    ) {
                        $('.no-result').hide();
                        $(noteBody).show();
                        $(note.element).show();
                        result = true;
                    }
                });
                if (result === false) {
                    $(noteBody).hide();
                    $('.no-result').show();
                }
            });
        },
        iniCategory: function () {
            var defaultVal = '<option value="" disabled selected>Category</option>';
            var filterCategory = $("#filter-category").append(defaultVal, "<option value='all'>All</option>");
            categories.forEach(function(category){
                if(category.children.length>0) {
                    var newCategory = $("<option></option>").val(category.id).text(category.name).appendTo(filterCategory);
                }
            });
        },
        goFilter: function () {
            $("#filter-category").change(function () {
                var filterCategory = $(this).val();
                cache.forEach(function(note) {
                    note.element.hide();
                    if(note.category.toString() === filterCategory || filterCategory === "all" ) {
                        note.element.show();
                    }
                });
            });
        }
    };
/* ============================================================== */
/*    FUNCTIONS TO MANAGE THE NOTE LIST  */
/* ============================================================== */
    var noteManager = {
        saveNote: function(obj) {
            var noteObj;
            if (obj.id >= 0 && obj.id!== '') {
                var targetID = obj.id,
                    index = notes.map(function (element) { return element.id; }).indexOf(targetID);
                
                // If the current category or subcategory is updated,
                categoryManager.removeFromCategory(obj, notes[index], targetID); // remove the current note from category
                categoryManager.insertToCategory(obj, notes[index], true); // Push the updated note into updated category

                // Update the note into the notes array
                notes[index] = obj;
                notes[index].id = targetID;
                notes[index].created = obj.created ? obj.created : new Date();
                noteObj = notes[index];

                // Display the updated note
                this.displayNote(noteObj, true);
            } else {
                // Create a new note object and push it into notes array
                newNote = obj;
                newNote.id = noteID;
                newNote.created = new Date();
                notes.push(newNote);

                // Update global note ID
                noteID++;
                noteObj = newNote;

                // Push the new note object into the categories array
                categoryManager.insertToCategory(obj, noteObj, false);

                // Display the new note
                this.displayNote(noteObj, false);
            }

            dataManager.saveData(notes);
        },
        // DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE
        displayNote: function(note, update) {
            var row,
                // Format Date into mm/dd/yyyy
                date = new Date(note.created),
                day = date.getDate(),
                month = date.getMonth(),
                year = date.getFullYear(),
                // Create new note elements into DOM
                id = $("<td></td>").text(note.id),
                title = $("<td></td>").text(note.title),
                created = $("<td></td>").text(month + '/' + day + '/' + year),
                category = $("<td></td>").text(categoryManager.fetchCategory(note.category).name),
                subcategory = $("<td></td>").text(categoryManager.fetchCategory(note.subcategory).name),
                introduction = $("<td></td>").text(note.introduction),
                temEdit = $("<button></button>").addClass("item-btn edit-btn"),
                itemEditBtn = $("<i></i>").addClass("far fa-edit"),
                itemDelete = $("<button></button>").addClass("item-btn delete-btn"),
                itemDeleteBtn = $("<i></i>").addClass("far fa-trash-alt"),
                editBtn = $("<td></td>").append($(temEdit).append(itemEditBtn)),
                deleteBtn = $("<td></td>").append($(itemDelete).append(itemDeleteBtn));
            // Cache note object
            var obj = {
                id: note.id,
                title: note.title,
                category: note.category,
                subcategory: note.subcategory,
                introduction: note.introduction,
                syntax: note.syntax,
                description: note.description
            };
            if (update === true) {
                // Append all elements into DOM
                row = $("<tr></tr>").append(id, title, created, category, subcategory, introduction, editBtn, deleteBtn);
                var index = notes.map(function(element){ return element.id; }).indexOf(note.id);
                obj.element = row;
                cache[index] = obj;
                cache[index].element.replaceWith(row);
            } else {
                row = $("<tr></tr>").append(id, title, created, category, subcategory, introduction, editBtn, deleteBtn).appendTo($(noteList).find('tbody'));
                obj.element = row;
                cache.push(obj);
            }
        },
        // DELETE A NEW NOTE BASED ON THE ID
        deleteNote: function(e) {
            var target = e.target;
            var index = $(target).closest("tr").index();
            var r = confirm("Are You Sure You Want to Delete This Item?");
            if (r === true) {
                // Remove the current note from categories array
                categoryManager.removeFromCategory('', notes[index], notes[index].id);
                
                notes.splice(index, 1); // Remove the current note from notes array
                cache[index].element.remove(); // Remove the DOM element
                cache.splice(index, 1); // Remove the current note from cache
                dataManager.saveData(notes); // Save back the notes array into data
            } else {
                return; // Do nothing if user cancels deleting
            }
        },
        orderNote: function (e) {
            var oldIndex;
            var newIndex;
            var note;
            var oldNum=0;
            var newNum=0;
            var current;
            var currentNote;

            $(e).sortable({
                start: function (e, ui) {
                    oldIndex = ui.item.index();
                },
                update: function (e, ui) {
                    newIndex = ui.item.index();
                    newCat = ui.item.index();
                    current = notes[oldIndex].subcategory;
                    note = notes[oldIndex];
                    for (var i = 0; i < oldIndex; i++) {
                        if (current === notes[i].subcategory) {
                            oldNum++;
                        }
                    }
                    if( oldIndex < newIndex ) {
                        newIndex += 1;
                    } else {
                        oldIndex += 1;
                    }
                    notes.splice(newIndex, 0, note);
                    notes.splice(oldIndex, 1);
                    cache.splice(newIndex, 0, note);
                    cache.splice(oldIndex, 1);
                    if (oldIndex > newIndex-1) {
                        oldNum += 1;
                    }
                    for (var i = 0; i < newIndex; i++) {
                        if (current === notes[i].subcategory) {
                            newNum++;
                        }
                    }
                    currentNote = categoryManager.fetchCategory(current).notes;
                    console.log(currentNote);
                    currentNote.splice(newNum, 0, note.id);
                    console.log(currentNote);
                    currentNote.splice(oldNum, 1);
                    console.log(currentNote);
                    dataManager.saveData(notes);
                }
            });
            $(e).disableSelection();
        },
        sortNote: function () {
            var compare = {
                id: function (a, b) {
                    return a - b;
                },
                title: function (a, b) {
                    if (a < b) {
                        return -1;
                    } else {
                        return a > b ? 1 : 0;
                    }
                },
                date: function (a, b) {
                    a = new Date(a);
                    b = new Date(b);
                    return a - b;
                }
            };

            $(noteList).each(function() {
                var table = this,
                    control = $(table).find("th"),
                    tbody = $(table).find("tbody");
                
                $(control).on("click", function () {
                    var header = this,
                        rows = $(tbody).find("tr").toArray(),
                        order = $(header).data('sort'),
                        column = control.index(this);
                        if (order) {
                            if ($(header).is(".ascending") || $(header).is(".descending")) {
                                $(header).toggleClass('ascending descending');
                                $(tbody).append(rows.reverse());
                            } else {
                                $(control).removeClass("ascending descending");
                                $(header).addClass("ascending");
                                if (compare.hasOwnProperty(order)) {
                                    rows.sort(function (a, b) {
                                        a = $(a).find("td").eq(column).text();
                                        b = $(b).find("td").eq(column).text();
                                        return compare[order](a, b);
                                    });
                                    $(tbody).append(rows);
                                }
                            }
                        }
                });
            });
        }
    };
/* ============================================================== */
/* FUNCTIONS TO MANAGE THE CATEGORY  */
/* ============================================================== */
    var categoryManager = {
        displayCategory: function () {
            var selectCategory = $("#form-category"),
                formCategory;
            // console.log(categories);
            categories.forEach(function (category, index) {
                // console.log(category);
                if (category.children.length > 0) {
                    formCategory = $("<option></option>").val(index).text(category.name);
                    $(selectCategory).append(formCategory);
                }
            });
            $(selectCategory).on('change', function() {
                categoryManager.displaySubcategory($(this).val());
            });
        },
        displaySubcategory: function(index) {
            var selectSubcategory = $("#form-subcategory"),
                formSubcategory,
                category = categories[index];
            $(selectSubcategory).html('');
            subcategories = category.children;
            subcategories.forEach(function (element) {
                var subcategory = categoryManager.fetchCategory(element);
                formSubcategory = $("<option></option>").val(subcategory.id).text(subcategory.name);
                $(selectSubcategory).append(formSubcategory);
            });
        },
        removeFromCategory: function (obj, refObj, id) {
            //If the current note's category or subcategory is changed
            if (obj === '' || (obj.category !== refObj.category || obj.subcategory !== refObj.subcategory)) {
                // Remove it from the category or subcategory
                var catNote = this.fetchCategory(refObj.subcategory).notes,
                    catIndex = catNote.indexOf(id);
                catNote.splice(catIndex, 1);
            } else {
                return;
            }
        },
        insertToCategory: function (obj, refObj, update) {
            if (update === true) {
                // If editing note, then check if category is changed, if so, push current note into category
                if (obj.category !== refObj.category || obj.subcategory !== refObj.subcategory) {
                    this.fetchCategory(obj.subcategory).notes.push(refObj.id); // Push it to the updated category
                } else {
                    return;
                }
            } else {
                // If adding new note, then just push new note into category
                this.fetchCategory(obj.subcategory).notes.push(refObj.id);
            }
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
/* FUNCTIONS TO MANAGE THE FORM */   
/* ============================================================== */
    // TRIGGER THE SUBMIT FUNCTION WHEN FORM SUBMITS
    var formManager = (function(){
        var formSyntax,
            formDescription,
            formTitle = $("#form-title"),
            formCategory = $("#form-category"),
            formSubCategory = $("#form-subcategory"),
            formIntroduction = $("#form-introduction"),
            formSubmitBtn = $("#form-submit");
        var id, title, category, subcategory, introduction, syntax, description, btnTxt;
        
        return {
            setForm: function(e) {
                var target = e.target,
                    index = $(target).closest("tr").index();

                formSyntax = syntaxEditor.activeFilter.editor;
                formDescription = descriptionEditor.activeFilter.editor;
            
                if( index > -1 ) {
                    var note = notes[index];
                    categoryManager.displaySubcategory(note.category);
                    id = note.id;
                    $(formTitle).val(note.title);
                    $(formCategory).val(note.category);
                    $(formSubCategory).val(note.subcategory);
                    $(formIntroduction).val(note.introduction);
                    formSyntax.setData(note.syntax);
                    formDescription.setData(note.description);
                    btnTxt = "Update Note";
                } else {
                    $(formEl)[0].reset();
                    formSyntax.setData("");
                    formDescription.setData("");
                    btnTxt = "Add Note";
                }

                $(formSubmitBtn).text(btnTxt);
                // SHOW THE FORM AFTER IT HAS BEEN ASSIGNED VALUES
                pageToggle.pageForward("1", "2");
            },
            getForm: function() {
                // fetch form data
                title = $(formTitle).val();
                category = categories[Number( $(formCategory).val() )].id;
                subcategory = categories[Number( $(formSubCategory).val() )].id;
                introduction = $(formIntroduction).val();
                syntax =formSyntax.getData();
                description = formDescription.getData();

                // format obj
                var resObj = {
                    id: "",
                    title: title,
                    category: category,
                    subcategory: subcategory,
                    introduction: introduction,
                    syntax: syntax,
                    description: description
                };
                if (id || id>=0) {
                    resObj.id = id;
                }
                return resObj;
            }
        };
    }());
    
/* ============================================================== */
/* FUNCTIONS TO LOAD AND SAVE JSON DATA */   
/* ============================================================== */
    var dataManager = {
        resetData: function() {
            notes = [];
            noteID = 0;
        },
        loadData: function() {
            $.getJSON( "notes.json" )
            .done(function(data) {
                notes = data.notes ? data.notes : [];
                noteID = 0;
                if( notes.length > 0 ) {
                    for(var i=0; i<notes.length; i++) {
                        noteManager.displayNote(notes[i]);
                        if(notes[i].id >= noteID) { noteID = notes[i].id+1; }
                    }
                }
            })
            .fail( function(d, textStatus, error) {
                console.error("getJSON failed, status: " + textStatus + ", error: "+error);
            })
            .always(function() {
                console.log( "complete" );
            });
        },
        saveData: function(notes) {
            var noteData = {"notes": notes};

            $.post("notes.php", {
                json: JSON.stringify(noteData)
            })
            .done(function() {
                console.log( "second success" );
            })
            .fail(function() {
                console.log( "error" );
            })
            .always(function() {
                console.log( "finished" );
            });
        }
    };
/* ============================================================== */
/* FUNCTIONS TO MANAGE THE PAGE EVENT */
/* ============================================================== */
    function pageManager() {
        pageToggle.pageInit("1");
        // INITIAL NOTE BODY EVENTS
        $(".page").each(function () {
            var page = this;
            $(page).on("click", function (e) {
                var target = e.target;
                if ($(target).is(".delete-btn")) {
                    noteManager.deleteNote(e);
                } else if ($(target).is(".edit-btn")) {
                    formManager.setForm(e);
                } else if ($(target).is("p.list-group-item")) {
                    $(target).each(function () {
                        $(this).next("ul").stop().slideToggle(300);
                        $(this).stop().toggleClass("closed");
                    });
                }
            });
        });
    }

    // INITIAL NOTE HEADER VISUAL 
    DOMManager.noteHeader();
    DOMManager.noteBody();
    
    // LOAD DATA FROM JSON FILE
    dataManager.loadData();
    dataManager.resetData();

    // INITIAL HEADER FILTER
    filterManager.goSearch();
    filterManager.goFilter();

    pageManager();
    
    // INITIAL FORM EVENTS
    $(formEl).on('submit', function(e) {
        e.preventDefault();
        // Update The Current Note
        noteManager.saveNote(formManager.getForm());
        
        pageToggle.pageBackward();
    });
});