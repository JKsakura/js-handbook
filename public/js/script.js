//var requestURL = "../notes.json";
//var request = new XMLHttpRequest();
//request.open('GET', requestURL);
//request.responseType = 'json';
//request.send();
//request.onload = function() {
//    var notes = request.response;
//    console.table(notes);
//}
// Declare Global CKEditor WYSIWYG Fields
var syntaxEditor = CKEDITOR.replace('add-syntax');
var descriptionEditor = CKEDITOR.replace('add-description');

// Declare Global Note Vars
var noteEditBtn, noteDoneBtn, formEl, noteList, notes, noteID, addBtn, manageBtn, doneBtn, noteForm, notes, noteID;
noteForm = $("#note-form-container");
editBtn = $("#note-edit-btn");
doneBtn = $("#note-done-btn");
addBtn = $("#note-add-btn");
manageBtn = $("#note-manage-btn");
formEl = $("#note-form");
noteList = $("#noteList");
doneBtn = $("#note-done-btn");
formSubmitBtn = $("#form-submit");
// Auto Increment ID with General Order
noteID = notes.length>0 ? notes.length : 0;
// Auto Increment ID with Random Order
//noteID = notes.length>0 ? notes.currentID : 0;
//notes.currentID = noteID+1;
notes = notes.length>0 ? notes : [];

/* ============================================================== */
/*    DECLARE A NEW NOTE OBJECT */
/* ============================================================== */
function note(id, title, category, introduction, syntax, description) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.introduction = introduction;
    this.syntax = syntax;
    this.description = description;
}

jQuery(function($){
    noteHeader();
    noteBody();
    console.log(notes);
    for(var i=0; i<notes.length; i++) {
        displayNote(notes[i]);
    }
});

/* ============================================================== */
/*    EVENT FOR ALL NOTE HEADING BUTTONS */
/* ============================================================== */
function noteHeader() {
    $(addBtn).on("click", function(e) {
        var target = e.target;
        formToggle.toggleForm(300);
        initialForm(e);
        manageBtnToggle.hideBtn();
        addBtnToggle.hideBtn();
        doneBtnToggle.showBtn();
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
    
    //manageBtnToggle.toggleBtn();
}

/* ============================================================== */
/* EVENT FOR ALL NOTE BODY BUTTONS */
/* ============================================================== */
function noteBody() {
    $(noteList).on("click", function(e) {
        var target = e.target;
        if( $(target).hasClass("delete-btn") ) {
            deleteNote(target);
        } else if( $(target).hasClass("edit-btn") ) {
            initialForm(e);
        } else if( $(target).hasClass("item-top") ) {
            $(target).parent().find(".item-bottom").stop().slideToggle(150);
        }
    });
}

/* ============================================================== */
/*    TOGGLE FOR NOTE FORM */
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

/* ============================================================== */
/*    TOGGLE FOR ADD BUTTON */
/* ============================================================== */ 
var addBtnToggle = {
    showBtn: function() {
        $(addBtn).show();
    },
    hideBtn: function() {
        $(addBtn).hide();
    }
}

/* ============================================================== */
/*    TOGGLE FOR MANAGING MANAGE BUTTON */
/* ============================================================== */ 
var manageBtnToggle = {
    showBtn: function() {
        $(manageBtn).show();
    },
    hideBtn: function() {
        $(manageBtn).hide();
    },
    toggleBtn: function() {
        if( $(noteList).is(":empty") ) {
            $(manageBtn).hide();
        } else {
            $(manageBtn).show();
        }
    }
}

/* ============================================================== */
/*    TOGGLE FOR DONE BUTTON */
/* ============================================================== */ 
var doneBtnToggle = {
    showBtn: function() {
        $(doneBtn).show();
    },
    hideBtn: function() {
        $(doneBtn).hide();
    }
}
/* ============================================================== */
/*    FUNCTIONS TO MANAGE THE NOTE LIST  */
/* ============================================================== */
function addNote(id, title, category, introduction, syntax, description) {
    var newNote = new note(id, title, category, introduction, syntax, description);
    notes[noteID] = newNote;
    //console.table(notes);
    
    requestNote(newNote, function() {
        displayNote(newNote);
    });
    
    displayNote(newNote);
}

// DELETE A NEW NOTE BASED ON THE ID
function deleteNote(e) {
    var targetID = $(e).attr("id").slice(10);
    var r = confirm("Are You Sure You Want to Delete This Item?");
    if( r === true ) {
        $("#note"+targetID).remove();
        notes[targetID] = '';
        //console.table(notes);
    } else {
        return false;
    }
}

// EDIT A NEW NOTE BASED ON THE ID
function editNote(id, title, category, introduction, syntax, description) {
    notes[id].title = title;
    notes[id].category = category;
    notes[id].introduction = introduction;
    notes[id].syntax = syntax;
    notes[id].description = description;

    //console.table(notes);
    displayNote(notes[id]);
}

// DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE
function displayNote(note) {
    var itemId, listItem, itemTop, itemBottom, itemHeader, itemTitle, itemCategory, itemIntroduction, itemSyntax, itemDescription, itembtns, itemDelete, itemDeleteBtn;
    // Create New Element
    listItem = $("li");

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
    itemTitle = "<p class=\""+TitleClass+"\">"+note.title+"</p>";
    itemCategory = "<h5 class=\""+categoryClass+"\">"+note.category+"</h5>";
    itemHeader = "<div class=\""+headerClass+"\">"+itemTitle+itemCategory+"</div>";
    // Item Introduction
    itemIntroduction = "<p class=\""+introductionClass+"\">"+note.introduction+"</p>";

    itemTop = "<div class=\""+topClass+"\">"+itemHeader+itemIntroduction+"</div>";

    /* =========== Item Bottom ============ */
    itemSyntax = "<div class=\""+syntaxClass+"\">"+note.syntax+"</div>";
    itemDescription = "<div class=\""+descriptionClass+"\">"+note.description+"</div>";

    itemBottom = "<div class=\""+bottomClass+"\">"+itemSyntax+itemDescription+"</div>";

    /* =========== Item Buttons ============ */
    itemEditBtn = "<i class=\""+editBtnClass+"\"></i>";
    itemEdit = "<button id=\""+editId+"\" class=\""+editClass+"\">"+itemEditBtn+"</button>";
    itemDeleteBtn = "<i class=\""+deleteBtnClass+"\"></i>";
    itemDelete = "<button id=\""+deleteId+"\" class=\""+deleteClass+"\">"+itemDeleteBtn+"</button>";

    itembtns = "<div class=\""+btnsClass+"\">"+itemDelete+itemEdit+"</div>";

    /* =========== List Item ============ */
    listItem = "<li id=\""+itemId+"\" class=\""+itemClass+"\">"+itemTop+itemBottom+itembtns+"</li>";
    
    if( $("#"+itemId).length > 0 ) {
        $("#"+itemId).html(itemTop+itemBottom+itembtns);
        $("#"+itemId).find(".item-btns").addClass("active");
    } else {
        $(noteList).append(listItem);
    }
}

/* ============================================================== */
/* FUNCTIONS TO MANAGE THE FORM */   
/* ============================================================== */
// TRIGGER THE SUBMIT FUNCTION WHEN FORM SUBMITS
function initialForm(e) {
    var target = e.target;
    var id, targetID, title, category, introduction, syntax, description;
    formTitle = $("#add-title");
    formCategory = $("#add-category");
    formIntroduction = $("#add-introduction");
    formSyntax = syntaxEditor.activeFilter.editor;
    formDescription = descriptionEditor.activeFilter.editor;
    
    if( $(target).hasClass("edit-btn") ) {
        id = $(target).attr("id").slice(8);
        targetID = $(target).attr("id");
        title = $(formTitle).val(notes[id].title);
        category = $(formCategory).val(notes[id].category);
        introduction = $(formIntroduction).val(notes[id].introduction);
        syntax =formSyntax.setData(notes[id].syntax);
        description = formDescription.setData(notes[id].description);
        formSubmitBtn.text("Update Note");
        $(formEl).unbind("submit").on("submit", function(e) {
            e.preventDefault();
            title = $(formTitle).val();
            category = $(formCategory).val();
            introduction = $(formIntroduction).val();
            syntax =formSyntax.getData();
            description = formDescription.getData();
             
            // Update The Current Note
            editNote(id, title, category, introduction, syntax, description);
        });
    } else if( $(target).hasClass("add-btn") ) {
        title = $(formTitle).val('');
        category = $(formCategory).val('Category');
        introduction = $(formIntroduction).val('');
        syntax = formSyntax.setData('');
        description = formDescription.setData('');
        formSubmitBtn.text("Add Note");
        $(formEl).unbind("submit").submit(function(e) {
            e.preventDefault();
            id = noteID;
            title = $(formTitle).val();
            category = $(formCategory).val();
            introduction = $(formIntroduction).val();
            syntax =formSyntax.getData();
            description = formDescription.getData();
            // ADD A NEW ITEM WITH NEW VALUES WHEN ADDING FINISHES
            
            // Create A New Note
            addNote(id, title, category, introduction, syntax, description);
            // Increase Note ID
            noteID ++;
            //console.log('work2');
        });
    }
    // SHOW THE FORM AFTER IT HAS BEEN ASSIGNED VALUES
    formToggle.showForm();
}

function requestNote(note, cb) {
    $.post('/saveNote', {
        noteObj: note
    }, function(data, status) {
        console.log(data);
    })
}
