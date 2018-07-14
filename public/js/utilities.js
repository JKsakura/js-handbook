
/* ============================================================== */
/*    VISUAL PART EVENTS  */
/* ============================================================== */
// TOGGLE FOR APP HEADER
var headerToggle = (function () {
    var header = $("#header");
    var menu = $("#main-menu");
    var toggle = $("#menu-toggle");
    return {
        menuToggle: function () {
            $(toggle).on("click", function () {
                $(header).toggleClass("open");
            });
        }
    };
}());

// TOGGLE FOR Page
pageToggle = (function() {
    var pages = [];
    return {
        pageInit: function(p) {
            pages.push(p);
        },
        pageForward: function (p1, p2) {
            var page1 = $('.page[data-page="' + p1 + '"]');
                page2 = $('.page[data-page="' + p2 + '"]');
            $(page1).addClass("forward");
            $(page2).addClass("active");
            $(page2).animate({
                scrollTop: 0
            }, 0);
            pages.push(p2);
            // console.log(pages);
        },
        pageBackward: function () {
            var page1 = $('.page[data-page="' + pages[pages.length - 2] + '"]');
                page2 = $('.page[data-page="' + pages[pages.length - 1] + '"]');
            $(page1).removeClass("forward");
            $(page2).removeClass("active");
            $(page1).animate({
                scrollTop: 0
            }, 0);
            pages.pop();
            // console.log(pages);
        }
    };
}());

// TOGGLE FOR ADD BUTTON
var addBtnToggle = (function () {
    var addBtn = $("#note-add-btn");
    return {
        showBtn: function () {
            $(addBtn).show();
        },
        hideBtn: function () {
            $(addBtn).hide();
        }
    };
}());

// TOGGLE FOR CANCEL BUTTON
var cancelBtnToggle = (function () {
    var cancelBtn = $("#note-cancel-btn");
    return {
        showBtn: function () {
            $(cancelBtn).show();
        },
        hideBtn: function () {
            $(cancelBtn).hide();
        }
    };
}());