/********************************************************************************

 TABLE OF CONTENTS

    Touch events
    Navigation
    Sidebar
    Open/close handler Search window

 ********************************************************************************/

/********************************************************************************

 TOUCH EVENTS

 ********************************************************************************/

/********************************************************************************

 NAVIGATION

 ********************************************************************************/

var fnOpenWdw = function (name) {
    var sWdw = $('.' + name);
    sWdw.addClass('open');
    sWdw.fadeIn();
};

// open-report-wdw
$(document).on('click','.open-report-wdw', function(){
    fnOpenReportWdw();
});

var fnOpenReportWdw = function (){
    fnCloseAllWdws();
    fnOpenWdw('report-wdw');
    fnSetActiveMenuItem('open-report-wdw');
    fnGetReports();
};

// open-archive-wdw
$(document).on('click','.open-archive-wdw', function(){
    fnOpenArchiveWdw();
});

var fnOpenArchiveWdw = function (){
    fnCloseAllWdws();
    fnOpenWdw('archive-wdw');
    fnSetActiveMenuItem('open-archive-wdw');
};

// open-archive-wdw
$(document).on('click','.menu-item', function(){
    fnCloseSidebar();
});



// open-home-wdw
$(document).on('click','.open-home', function(){
    fnOpenHomeWdw();
});

var fnOpenHomeWdw = function (){
    // close all windows, home page is always open (main html)
    fnCloseAllWdws();
    fnOpenWdw('home-wdw');
    fnSetActiveMenuItem('open-home');
};

var fnCloseAllWdws = function () {
    var sOpenWindow = $('.wdw.open');
    sOpenWindow.fadeOut();
    sOpenWindow.removeClass('open');
};

var fnSetActiveMenuItem = function (activeMenuItem) {
    $('.menu-item').removeClass('active');
    $('.' + activeMenuItem).addClass('active');
};

fnOpenHomeWdw();
/********************************************************************************

 SIDEBAR

 ********************************************************************************/


$(document).on('mouseover','#sidebar', function(){
    fnOpenSidebar();
});
$(document).on('click','#sidebar', function(){
    fnOpenSidebar();
});
$(document).on('touchstart','#sidebar', function(){
    fnOpenSidebar();
});

$(document).on('mouseleave','#sidebar', function(){
    fnCloseSidebar();
});

var sidebar = $("#sidebar");

var fnOpenSidebar = function (){
    if (!sidebar.hasClass('open')){
        // open sidebar
        $("#sidebar").addClass('open');
    }
};

var fnCloseSidebar = function (){
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


/********************************************************************************

 READ

 ********************************************************************************/

var aLoadedReports = [];
var sUrlReports = "api/reports/api-get-reports.php";
var iItemsFromDbLength = 0;
var iSavedItemsLenght = aLoadedReports.length;

//connect to server and display all properties
function fnGetReports(){
    $.get( sUrlReports, function( sData ){

        if (!$.trim(sData)){
            //sData is empty
            //Don't continue do stuff with sData
        }
        else{
            //sData is NOT empty
            //ready to convert sData to object

            var ajData = JSON.parse(sData);
            iItemsFromDbLength = ajData.length;

            for(var i = 0; i < ajData.length; i++){
                var sIdReport = ajData[i].id;

                if ($.inArray(sIdReport, aLoadedReports) != -1) {
                    //the object ID is already in aIdProperties array
                }
                else{
                    var sTitle=ajData[i].title;
                    //new object: add blueprint with data to html
                    var sBlueprint = ' <div class="text-report-card card card-1">' +
                        '<div class="h4 card-text">'+sTitle+'</div>' +
                        '<div class="card-buttons"> ' +
                        '<img src="dist/images/arrows_circle_check.svg" alt="Accept" class="report-accept"> ' +
                        '<img src="dist/images/arrows_circle_remove.svg" alt="Decline" class="report-decline"> ' +
                        '</div>' +
                        '</div>';

                    $("#report-container").append( sBlueprint );

                    if(iItemsFromDbLength - 1 === aLoadedReports.length){ // when all new reports are added
                        if(iSavedItemsLenght != 0){
                            // show desktop notification in case it's not the first load request
                            // otherwise you'll get notified about EVERY SINGLE item :'(
                            var iNewReports = iItemsFromDbLength - iSavedItemsLenght; // calculate how many new reports are loaded

                            var sReports = "reports";
                            if (iNewReports === 1){
                                sReports = "report";
                            }

                            var sNotificationTitle = iNewReports + " new "+sReports+" added!";

                            fnShowNotification(sNotificationTitle, sReports); // set if its single or plural
                        }

                        iSavedItemsLenght = iItemsFromDbLength; // set number of saved items
                    }

                    //add id to array
                    aLoadedReports.push(sIdReport);
                }
            }
        }
    });
}

// refresh reports each 2 sec
setInterval( function(){
        fnGetReports();
}, 2000 );


/********************************************************************************

 UPDATE

 ********************************************************************************/
/********************************************************************************

 ACCEPT / DECLINE

 ********************************************************************************/

// accept
$(document).on('click','.report-accept', function(){
    fnAcceptReport();
});

var fnAcceptReport = function (){
    swal(
        'Approved!',
        'Report accepted.',
        'success'
    );
};

// decline
$(document).on('click','.report-decline', function(){
    fnDeclineReport();
});

var fnDeclineReport = function (){
    swal(
        'Declined',
        'Report declined.',
        'error'
    );
};

/********************************************************************************

 DELETE

 ********************************************************************************/

$(document).on('click','.report-delete', function(){
    fnDeleteReport();
});

var fnDeleteReport = function (){
    swal(
        'Deleted!',
        'Report deleted.',
        'success'
    );
};

/********************************************************************************************************

 DESKTOP NOTIFICATIONS

 ********************************************************************************************************/

// request permission on page load
document.addEventListener('DOMContentLoaded', function () {
    if (!Notification) {
        console.log("Desktop notifications aren't available in your browser.");
        return;
    }
    if (Notification.permission !== "granted"){
        Notification.requestPermission();
    }
});

var oSound = new Audio('audio/notification.mp3'); //o because Object

var changeTitle;
var iterations = 0;

function fnShowNotification(title, report){
    oSound.play();
    var baseTitle = document.title;
    var notificationTitle = "New "+report+" received"; // report is single or plural --> report(s)
    changeTitle = setInterval(function(){
        fnChangeTitle(baseTitle, notificationTitle);
    }, 1000);
    fnShowDesktopNotification(title);
}

function fnChangeTitle(baseTitle, notificationTitle) {
    if (iterations < 6){
        if(document.title === baseTitle){
            document.title = notificationTitle;
        }else{
            document.title = baseTitle;
        }
    }else{
        clearInterval(changeTitle);
    }
    iterations++;
}

function fnShowDesktopNotification(title) {
    if (Notification.permission !== "granted"){
        Notification.requestPermission();
    }
    else {
        var notification = new Notification(title);

        notification.onclick = function () {
           // open report page on click
           fnOpenReportWdw();
        };
    }
}