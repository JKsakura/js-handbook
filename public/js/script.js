//var requestURL = "../notes.json";
//var request = new XMLHttpRequest();
//request.open('GET', requestURL);
//request.responseType = 'json';
//request.send();
//request.onload = function() {
//    var notes = request.response;
//    console.table(notes);
//}

noteManagement();

function noteManagement() {
    var noteEditBtn = document.getElementById("note-edit-btn");
    var noteDoneBtn = document.getElementById("note-done-btn");
    var itemBtns = document.getElementsByClassName("item-btns");
    var formEl = document.getElementById("new-form");
    var noteList = document.getElementById("noteList");
    var notes = [];
    var noteID = 0;
    adding();
    deleting();
    editing();
    done();
    /* ============================================================== */
    /* ALL EVENTS TO MANAGE NOTES CONTENT */
    /* ============================================================== */
    function adding() {
        formEl.addEventListener("submit", function(e) {
            e.preventDefault();
            var id, title, category, introduction, syntax, description;
            id = "note"+noteID;
            title = document.getElementById("add-title").value;
            category = document.getElementById("add-category").value;
            introduction = document.getElementById("add-introduction").value;
            syntax = document.getElementById("add-syntax").value;
            description = document.getElementById("add-description").value;

            addNote(id, title, category, introduction, syntax, description);
            noteID ++;
        }, false);
    }
    function deleting() {
        noteList.addEventListener("click", function(e) {
            deleteNote(e.target);
        }, false);
    }
    function editing() {
        noteEditBtn.addEventListener("click", function(e) {
            var target = e.target;
            target.style.display = "none";
            noteDoneBtn.style.display = "block";
            for(var i=0; i<itemBtns.length; i++) {
                itemBtns[i].style.display = "block";
            }
            editFieldTrigger(target);
        }, false);
    }
    function done() {
        noteDoneBtn.addEventListener("click", function(e) {
            var target = e.target;
            target.style.display = "none";
            noteEditBtn.style.display = "block";
            for(var i=0; i<itemBtns.length; i++) {
                itemBtns[i].style.display = "none";
            }
            doneEditTrigger(e);
        }, false);
    }
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
    
    /* ============================================================== */
    /*    ADD A NEW NOTE ELEMENT WITH PARAMETERS */
    /* ============================================================== */
    function addNote(id, title, category, introduction, syntax, description) {
        var newNote = new note(id, title, category, introduction, syntax, description);
        notes[noteID] = newNote;
        requestNote(newNote, function() {
            displayNote(newNote);
        });

        // reqiest 

    }

    /* ============================================================== */
    /* DELETE A NEW NOTE BASED ON THE ID */ 
    /* ============================================================== */
    function deleteNote(e) {
        if(e.classList.contains("delete-btn")) {
            var targetID = e.getAttribute("id").slice(10);
            var targetItem = document.getElementById("note"+targetID);
            var r = confirm("Are You Sure You Want to Delete This Item?");
            if( r === true ) {
                noteList.removeChild(targetItem);
                notes["note"+targetID] = '';
            } else {
                return false;
            }
        }
    }

    /* ============================================================== */
    /* DISPLAY THE ELEMENT WITH NEW DOM STRUCTURE */   
    /* ============================================================== */
    function displayNote(note) {
        var list = document.getElementById("noteList");
        var listItem = document.createElement("li");
        var itemTop = document.createElement("div");
        var itemBottom = document.createElement("div");
        var itemHeader = document.createElement("div");
        var itemTitle = document.createElement("p");
        var itemCategory = document.createElement("h5");
        var itemIntroduction = document.createElement("p");
        var itemSyntax = document.createElement("div");
        var itemDescription = document.createElement("div");
        var itemHeader = document.createElement("div");
        var itembtns = document.createElement("div");
        var itemDelete = document.createElement("button");
        var itemDeleteBtn = document.createElement("i");

        listItem.setAttribute("id", "note"+noteID);
        itemDelete.setAttribute("id", "noteDelete"+noteID);

        listItem.className = "list-item list-group-item list-group-item-action";
        itemHeader.className = "item-header";
        itemTop.className = "item-top";
        itemBottom.className = "item-bottom";
        itemHeader.className = "item-header";
        itemTitle.className = "item-title note-field-text";
        itemCategory.className = "item-category note-field-select";
        itemIntroduction.className = "item-introduction note-field-text";
        itemSyntax.className = "item-syntax note-field-text";
        itemDescription.className = "item-description note-field-text";
        itembtns.className = "item-btns";
        itemDelete.className = "item-btn delete-btn";
        itemDeleteBtn.className = "fas fa-trash-alt";

        itemTitle.textContent = note.title;
        itemCategory.textContent = note.category;
        itemIntroduction.textContent = note.introduction;
        itemSyntax.textContent = note.syntax;
        itemDescription.textContent = note.description;

        /* =========== Item Top ============ */
        // Item Header
            itemHeader.appendChild(itemTitle); // Item Title
            itemHeader.appendChild(itemCategory); // Item Category
            itemTop.appendChild(itemHeader);
            itemTop.appendChild(itemIntroduction); // Item Introductio
        /* =========== Item Bottom ============ */
            itemBottom.appendChild(itemSyntax); // Item Syntax
            itemBottom.appendChild(itemDescription); // Item Description
        /* =========== Item Buttons ============ */
            itemDelete.appendChild(itemDeleteBtn);
            itembtns.appendChild(itemDelete);
        /* =========== List Item ============ */
        listItem.appendChild(itemTop);
        listItem.appendChild(itemBottom);
        listItem.appendChild(itembtns);

        list.appendChild(listItem);
    }

    // CALL THE FANCY WYSIWYG EDITOR
    // CKEDITOR.replace( 'add-syntax' );
    // CKEDITOR.replace( 'add-description' );
    /* ============================================================== */
    /* EDITE NOTES FUNCTION */
    /* ============================================================== */
    function editFieldTrigger(e) {
        var targetID = e.dataset.targetField;
        var targetEl = document.getElementById(targetID);
        var textField, selectField;
        textField = document.getElementsByClassName("note-field-text");
        selectField = document.getElementsByClassName("note-field-select");
        for(var i=0; i<textField.length; i++) {
            textField[i].setAttribute("contenteditable", true);
        }
        for(var i=0; i<selectField.length; i++) {
            var selectContent;
            var fieldVal = selectField[i].textContent;
            selectContent = "<select class=\"form-control\">";
            selectContent += "<option value=\"Category\""+(fieldVal==="Category"?" selected=\"selected\"":"")+">Category</option>";
            selectContent += "<option value=\"JavaScript\""+(fieldVal==="JavaScript"?" selected=\"selected\"":"")+">JavaScript</option>";
            selectContent += "<option value=\"jQuery\""+(fieldVal==="jQuery"?" selected=\"selected\"":"")+">jQuery</option>";
            selectContent += "</select>";
            selectField[i].innerHTML = selectContent;
        }
    }
    
    function doneEditTrigger(e) {
        var textField = document.getElementsByClassName("note-field-text");
        var selectField = document.getElementsByClassName("note-field-select");
        var item = noteList.childNodes;
        for(var i=0; i<textField.length; i++) {
            textField[i].setAttribute("contenteditable", false);
        }
        for(var i=0; i<selectField.length; i++) {
            selectField[i].textContent = selectField[i].childNodes[0].value;
        }
        for(var i=0; i<item.length; i++) {
            var itemID = item[i].getAttribute("id").slice(4);
            var itemChildren = item[i].childNodes;
            
            for(var j=0; j<itemChildren.length; j++) {
                if(itemChildren[j].className == "item-title note-field-text") {
                    notes[itemID].title = itemChildren[j].textContent;
                } else if(itemChildren[j].className == "item-category note-field-select") {
                    notes[itemID].category = itemChildren[j].textContent;
                } else if(itemChildren[j].className == "item-introduction note-field-text") {
                    notes[itemID].introduction = itemChildren[j].textContent;
                } else if(itemChildren[j].className == "item-syntax note-field-text") {
                    notes[itemID].syntax = itemChildren[j].textContent;
                } else if(itemChildren[j].className == "item-description note-field-text") {
                    notes[itemID].description = itemChildren[j].textContent;
                }
            }
        }
        return;
    }
}

function requestNote(note, cb) {
    $.post('/saveNote', {
        noteObj: note
    }, function(data, status) {
        console.log(data);
    })
}
