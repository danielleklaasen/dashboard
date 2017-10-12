/********************************************************************************

 TABLE OF CONTENTS

    Navigation
    Sidebar
    Open/close handler Search window

 ********************************************************************************/

/********************************************************************************

 NAVIGATION

 ********************************************************************************/

// open-report-wdw
$(document).on('click','.open-report-wdw', function(){
    fnOpenReportWdw();
});

var fnOpenReportWdw = function (){
    var sReport = $('.report-wdw');
    sReport.addClass('open');
    sReport.fadeIn();

    fnSetActiveMenuItem('open-report-wdw');
};

// open-home-wdw
$(document).on('click','.open-home', function(){
    fnOpenHomeWdw();
});

var fnOpenHomeWdw = function (){
    // close all windows, home page is always open (main html)
    var sOpenWindow = $('.wdw.open');
    sOpenWindow.fadeOut();
    sOpenWindow.removeClass('open');

    fnSetActiveMenuItem('open-home');
};

var fnSetActiveMenuItem = function (activeMenuItem) {
    $('.menu-item').removeClass('active');
    $('.' + activeMenuItem).addClass('active');
};
/********************************************************************************

 SIDEBAR

 ********************************************************************************/


$(document).on('mouseover','#sidebar', function(){
    fnAnimateSidebarIn();
});
$(document).on('mouseleave','#sidebar', function(){
    fnAnimateSidebarOut();
});

var sidebar = $("#sidebar");

var fnAnimateSidebarIn = function (){
    if (!sidebar.hasClass('open')){
        // open sidebar
        $("#sidebar").addClass('open');
    }
};

var fnAnimateSidebarOut = function (){
    if (sidebar.hasClass('open')){
        // close sidebar
        $("#sidebar").removeClass('open');
    }


};

/********************************************************************************

 SEARCH

 ********************************************************************************/

$(document).on('click','.close-search', function(){
    fnCloseSearch();
});

$(document).on('click','.open-search', function(){
    fnOpenSearch();
});

var fnCloseSearch = function (){
    $(".search-wdw").fadeOut();
};

var fnOpenSearch = function (){
    $(".search-wdw")
        .css("display", "flex")
        .hide()
        .fadeIn();
    $( "#search-input" ).focus();
};