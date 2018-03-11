/* ============================================================== */
/*    LIST OF ALL MODULES IN THE SCRIPT.JS
      - GLOBAL VARIABLES
      - VISUAL ELEMENT OF DOM
      - MAIN NOTE LIST
      - SINGLE LIST CRUD
      - SINGLE DETAIL
      - FORM METHODS
*/
/* ============================================================== */
// GLOBAL VARIABLES
var noteEditBtn, noteDoneBtn, formEl, noteList, addBtn, manageBtn, doneBtn, noteForm, syntaxEditor, descriptionEditor, formTitle, formCategory, formIntroduction, formSyntax, formDescription, formNoteID;

// CALL MAIN JQUERY FUNCTION
jQuery(function($){
    // INITIAL GLOBAL CKEDITOR WYSIWYG FIELDS
    syntaxEditor = CKEDITOR.replace('add-syntax');
    descriptionEditor = CKEDITOR.replace('add-description');
    
    // INITIAL ALL GLOBAL ELEMENT
    noteForm = $("#note-form-container");
    editBtn = $("#note-edit-btn");
    doneBtn = $("#note-done-btn");
    addBtn = $("#note-add-btn");
    manageBtn = $("#note-manage-btn");
    formEl = $("#note-form");
    noteList = $("#noteList");
    doneBtn = $("#note-done-btn");
    formSubmitBtn = $("#form-submit");
    
    // DISPLAY ALL NOTES WHILE LOADING
    for(var i=0; i<notes.length; i++) {
        displayNote(notes[i]);
    }
/* ============================================================== */
/*    VISUAL ELEMENT OF DOM */
/* ============================================================== */ 
    var formToggle = {
        showForm: function() {
            $(noteForm).fadeIn(300);
        },
        hideForm: function() {
            $(noteForm).fadeOut(300);
        },
        toggleForm: function() {
            $(noteForm).fadeToggle(300);
        }
    }

    // TOGGLE FOR ADD BUTTON
    var addBtnToggle = {
        showBtn: function() {
            $(addBtn).show();
        },
        hideBtn: function() {
            $(addBtn).hide();
        }
    }
    // TOGGLE FOR MANAGING MANAGE BUTTON
    var manageBtnToggle = {
        showBtn: function() {
            $(manageBtn).show();
        },
        hideBtn: function() {
            $(manageBtn).hide();
        },
        toggleBtn: function() {
            noteList = $("#noteList");
            if( $(noteList).is(":empty") ) {
                $(manageBtn).hide();
            } else {
                $(manageBtn).show();
            }
        }
    }
    
    // TOGGLE FOR DONE BUTTON
    var doneBtnToggle = {
        showBtn: function() {
            $(doneBtn).show();
        },
        hideBtn: function() {
            $(doneBtn).hide();
        }
    }
    
/* ============================================================== */
/*    MAIN NOTE LIST */
/* ============================================================== */ 
    noteHeader();
    noteBody();
    
    formSubmitBtn.on('click', saveNote);
    
    $(formEl).on('submit', function(e) {
        e.preventDefault();
        formSubmitBtn.click();
    });
    
    // EVENT FOR ALL NOTE HEADING BUTTONS
    function noteHeader() {
        $(addBtn).on("click", function(e) {
            var target = e.target;
            formToggle.toggleForm();
            setForm(e);
            manageBtnToggle.hideBtn();
            addBtnToggle.hideBtn();
            doneBtnToggle.showBtn();
            $("html, body").animate({
                scrollTop: $(noteForm).offset().top 
            });
        });

        $(manageBtn).on("click", function() {
            var itemBtn = $(".item-btns");
            $(itemBtn).toggleClass("active");
            formToggle.hideForm();
            manageBtnToggle.hideBtn();
            addBtnToggle.hideBtn();
            doneBtnToggle.showBtn();
        });

        $(doneBtn).on("click", function() {
            var itemBtn = $(".item-btns");
            $(itemBtn).removeClass("active");
            doneBtnToggle.hideBtn();
            manageBtnToggle.toggleBtn();
            addBtnToggle.showBtn();
            formToggle.hideForm();
        });

        manageBtnToggle.toggleBtn();
    }
    
    // EVENT FOR ALL NOTE BODY BUTTONS
    function noteBody() {
        // MAIN NOTE BODY METHODS
        $(noteList).on("click", function(e) {
            var target = e.target;
            if( $(target).hasClass("delete-btn") ) {
                deleteNote(target);
            } else if( $(target).hasClass("edit-btn") ) {
                setForm(e);
                $("html, body").animate({
                    scrollTop: $(noteForm).offset().top 
                });
            } else if( $(target).hasClass("list-item") ) {
                //requestDetail(target);
            }
        });
    }
    
/* ============================================================== */
/*    SINGLE LIST CRUD  */
/* ============================================================== */
    function saveNote(e) {
        // Update The Current Note
        var obj = getFormData();
        requestNote(obj, 'save', function(noteObj) {
            notes.push(noteObj);
            displayNote(noteObj);
            $("html, body").animate({
                scrollTop: 0
            })
        });
        formToggle.hideForm();
    }
    
    // DELETE A NEW NOTE BASED ON THE ID
    function deleteNote(e) {
        var targetID = $(e).attr("id").slice(10);
        var r = confirm("Are You Sure You Want to Delete This Item?");
        if( r === true ) {
            //notes[targetID] = '';
            //console.table(notes);
            
            var index = notes.findIndex(function(element) {
                return element.id && element.id.toString() === targetID;
            });
            if (index > -1) {
                var targetNote = notes[index];
                requestNote(targetNote, 'delete', function() {
                    // remove from view
                    notes.splice(index,1);
                    $("#note"+targetID).remove();
                });
            }
        } else {
            return false;
        }
    }
    
    // DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE
    function displayNote(note) {
        var itemId, listItem, itemTop, itemBottom, itemHeader, itemTitle, itemCategory, itemIntroduction, itemSyntax, itemDescription, itembtns, itemDelete, itemDeleteBtn;

        // Define ID
        var itemId = "note"+note.id;
        var editId = "noteEdit"+note.id;
        var deleteId = "noteDelete"+note.id;

        // Define Classes
        var itemClass = "list-item list-group-item list-group-item-action";
        var headerClass = "item-header";
        var topClass = "item-top";
        var bottomClass = "item-bottom";
        var TitleClass = "item-title note-field-text";
        var categoryClass = "item-category note-field-select";
        var introductionClass = "item-introduction note-field-area";
        var syntaxClass = "item-syntax note-field-area";
        var descriptionClass = "item-description note-field-area";
        var btnsClass = "item-btns";
        var deleteClass = "item-btn delete-btn";
        var deleteBtnClass = "fas fa-trash-alt";
        var editClass = "item-btn edit-btn";
        var editBtnClass = "far fa-edit";

        /* =========== Item Top ============ */
        // Item Header
        itemTitle = $("<p></p>").addClass(TitleClass).text(note.title);
        itemCategory = $("<h5></h5>").addClass(categoryClass).text(note.category);
        
        itemHeader = $("<div></div>").addClass(headerClass).append(itemTitle, itemCategory);
        
        // Item Introduction
        itemIntroduction = $("<p></p>").addClass(introductionClass).text(note.introduction);
        
        itemTop = $("<div></div>").addClass(topClass).append(itemHeader, itemIntroduction);
        
        /* =========== Item Bottom ============ */
        syntaxTitle = $("<h4></h4>").text("Syntax");
        itemSyntax = $("<div></div>").addClass(syntaxClass).html(note.syntax).prepend(syntaxTitle);
        descriptionTitle = $("<h4></h4>").text("Description");
        itemDescription = $("<div></div>").addClass(descriptionClass).html(note.description).prepend(descriptionTitle);
        
        itemBottom = $("<div></div>").addClass(bottomClass).append(itemSyntax, itemDescription);
        
        /* =========== Item Buttons ============ */
        itemDeleteBtn = $("<i></i>").addClass(deleteBtnClass);
        itemDelete = $("<button></button>").attr("id", deleteId).addClass(deleteClass).append(itemDeleteBtn);
        
        itemEditBtn = $("<i></i>").addClass(editBtnClass);
        itemEdit = $("<button></button>").attr("id", editId).addClass(editClass).append(itemEditBtn);
        
        itembtns = $("<div></div>").addClass(btnsClass).append(itemDelete, itemEdit);
        
        /* =========== List Item ============ */
        listItem = $("<li></li>").attr("id", itemId).addClass(itemClass).append(itemTop, itemBottom, itembtns);
        
        if( $("#"+itemId).length > 0 ) {
            $("#"+itemId).replaceWith(listItem);
            $("#"+itemId).find(".item-btns").addClass("active");
        } else {
            $(noteList).append(listItem);
        }
    }

    
/* ============================================================== */
/* SINGLE DETAIL */   
/* ============================================================== */
    // REQUEST THE CURRENT DETAIL CONTENT
    function requestDetail(target) {
        var idNote = $(target).attr("id").slice(4);
    }
    
/* ============================================================== */
/* FORM METHODS */   
/* ============================================================== */
    // TRIGGER THE SUBMIT FUNCTION WHEN FORM SUBMITS
    function setForm(e) {
        var target = e.target;
        var id, _id, title, category, introduction, syntax, description, btnTxt;
        formTitle = $("#add-title");
        formCategory = $("#add-category");
        formIntroduction = $("#add-introduction");
        formNoteID = '';
        formSyntax = syntaxEditor.activeFilter.editor;
        formDescription = descriptionEditor.activeFilter.editor;
        
        id = $(target).attr("id");
        if ($(target).hasClass("edit-btn")) {
            id = id.slice(8);
            var targetNote = notes.find(function(element) {
                return element.id && element.id.toString() === id;
            });
            if (targetNote) {
                _id = targetNote._id;
                title = targetNote.title;
                category = targetNote.category;
                introduction = targetNote.introduction;
                syntax = targetNote.syntax;
                description = targetNote.description;
                btnTxt = "Update Note";
            }
        }
        else {
            _id = '';
            title = "";
            category = "Category";
            introduction = "";
            syntax = "";
            description = "";
            btnTxt = "Add Note";
        }
        
        formNoteID = _id;
        $(formTitle).val(title);
        $(formCategory).val(category);
        $(formIntroduction).val(introduction);
        formSyntax.setData(syntax);
        formDescription.setData(description);
        $(formSubmitBtn).text(btnTxt);
        
        // SHOW THE FORM AFTER IT HAS BEEN ASSIGNED VALUES
        formToggle.showForm();
        addBtnToggle.showBtn();
        doneBtnToggle.hideBtn();
        manageBtnToggle.toggleBtn();
    }

    function getFormData() {
        // fetch form data
        var _id = formNoteID;
        var title = $(formTitle).val();
        var category = $(formCategory).val();
        var introduction = $(formIntroduction).val();
        var syntax =formSyntax.getData();
        var description = formDescription.getData();
        
        // format obj
        var resObj = {
            title: title,
            category: category,
            introduction: introduction,
            syntax: syntax,
            description: description
        }
        if (_id) {
            resObj['_id'] = _id;
        }
        return resObj;
    }
    
    function requestNote(note, type, cb) {
        if (type === 'save') {
            $.post('/saveNote', {
                noteObj: note
            }, function(data, status) {
                //console.log(data);
                cb(data.result);
            });
        }
        else if (type === 'delete') {
            if (!note || !note._id) {
                return;
            }
            
            $.post('/deleteNote', {
                _idNote: note._id
            }, function(data, status) {
                //console.log(data);
                if (data.code === 0) {
                    cb();
                }
                else {
                    console.log(data.message || data.text);
                }
            });
        }
        else {
            return;
        }
    }
});