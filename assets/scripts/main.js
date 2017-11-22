/********************************************************************************

 TABLE OF CONTENTS

    Setup

    Feedback to user

    Touch events

    Navigation

    Sidebar

    Search

    Read

    Update

    Delete

    Desktop notifications

    Firebase

 ********************************************************************************/

/********************************************************************************

 SETUP

 ********************************************************************************/

// append to more button, to keep html cleaner
var sBlueprintMore = '<div class="circles-container">' +
    '<div class="circle"></div>' +
    '<div class="circle"></div>' +
    '<div class="circle"></div>' +
    '</div>';

$('.more-btn').each(function( index ) {
    $( this ).append(sBlueprintMore);
});

/********************************************************************************

 FEEDBACK TO USER

 ********************************************************************************/
var bTimerIsSet = false;
var messageTimer;
function fnResetTimer() {
    clearTimeout(messageTimer);
}


function fnShowMessage(message, type) {

    var sMessage = $('#message');
    sMessage.text(message);

    switch(type) {
        case "success":
            sMessage.removeClass("error").addClass("success");
            break;
        case "error":
            sMessage.className = "";
            sMessage.removeClass("success").addClass("error");
            break;
        default:
            sMessage.className = "";
    }

    sMessage.animate({
        top: 0
    }, 550);

    // handeling multiple messages
    // only call hide message, when the message has been shown for 2 s
    if(!bTimerIsSet){
        messageTimer = setTimeout(function(){ fnHideMessage(); }, 2000);
        bTimerIsSet = true;
    }else{
        fnResetTimer();
        messageTimer = setTimeout(function(){ fnHideMessage(); }, 2000);
    }
}

function fnHideMessage(){
    bTimerIsSet = false;
        var topValue="-50px";
        $('#message').animate({
            top: topValue
        }, 550);

}


/********************************************************************************************************
 Desktop notifications
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

var fnCloseAllWdws = function () {
    var sOpenWindow = $('.wdw.open');
    sOpenWindow.fadeOut();
    sOpenWindow.removeClass('open');
};

var fnSetActiveMenuItem = function (activeMenuItem) {
    $('.menu-item').removeClass('active');
    $('.' + activeMenuItem).addClass('active');
};

// open-report-wdw
$(document).on('click','.open-report-wdw', function(){
    fnOpenReportWdw();
});

var fnOpenReportWdw = function (){
    fnCloseAllWdws();
    fnOpenWdw('report-wdw');
    fnSetActiveMenuItem('open-report-wdw');
};

// open-archive-wdw
$(document).on('click','.open-archive-wdw', function(){
    fnOpenArchiveWdw();
});

$(document).on('click','.menu-item', function(){
    fnCloseSidebar();
});

var fnOpenArchiveWdw = function (){
    fnCloseAllWdws();
    fnOpenWdw('archive-wdw');
    fnSetActiveMenuItem('open-archive-wdw');
};

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

// open-profile-wdw
$(document).on('click','.open-profile', function(){
    fnOpenProfileWdw();
});

var fnOpenProfileWdw = function (){
    // close all windows, home page is always open (main html)
    fnCloseAllWdws();
    fnOpenWdw('profile-wdw');
};

/********************************************************************************

 LOGIN

 ********************************************************************************/

$(document).on('click','.btn-login', function(e){
    e.preventDefault();
    fnLogin();
});

var fnLogin = function(){
    var sOpenWindow = $('.login-wdw');
    sOpenWindow.fadeOut();
    fnOpenHomeWdw();
};
/********************************************************************************

 SIDEBAR

 ********************************************************************************/

$(document).on('click', '.open-menu', function(){
  console.log("open");
  fnOpenSidebar();
});

$(document).on('click', '.close-menu', function(){
    console.log("close");
    fnCloseSidebar();
});

$(document).on('mouseover','#sidebar', function(){
   // fnOpenSidebar();
});
$(document).on('mouseenter','#sidebar', function(){
  fnOpenSidebar();
});

$(document).on('mouseleave','#sidebar', function(){
  fnCloseSidebar();
});

$(document).on('click', '.sidebar-close', function(){
    fnCloseSidebar();
});

$(document).on('click', '.menu-item-mobile', function(){
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
      console.log("close");
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

 FIREBASE

 ********************************************************************************/

// Get a reference to the database service
var database = firebase.database();

/********************************************************************************
 Read
 ********************************************************************************/

var iPendingReports = 0;
var sPendingNotification = $('#pending-notification');
sPendingNotification.hide();
var bFirstLoaded = false;
var bNewPendingReports = false;
var aLoadedReports = [];

var bikesRef = database.ref('bikes');
bikesRef.on('value', function(snapshot) {
    sPendingReports = $('.pending-reports-num');
    sPendingReports.text(iPendingReports); // set number of pending reports in notification and dashboard
   // var sPendingReports = snapshot.numChildren();
    snapshot.forEach(function(childSnapshot) { // loop through report items

        var childData = childSnapshot.val();
        var sKey = childData.bikeID;

        if ($.inArray(sKey, aLoadedReports) != -1) {
            //the object ID is already in aIdProperties array
        }else{
            // report not loaded yet
            var sCompanyName = childData.companyName;
            var aDamages = childData.damages;

            var sStatus = childData.status;
            switch(sStatus) {
                case "pending":
                    fnAddPending(sKey, sCompanyName, aDamages);
                    iPendingReports++;
                    sPendingReports.text(iPendingReports); // set number of pending reports in notification and dashboard
                    sPendingNotification.show();
                    bNewPendingReports = true; // setting to true so notification will show
                    break;
                case "accepted":
                    fnAddAccepted(sKey, sCompanyName, aDamages);
                    break;
                case "declined":
                    fnAddDeclined(sKey, sCompanyName, aDamages);
                    break;
                default:
                // default code here
            }

            //add id to array
            aLoadedReports.push(sKey);
        }

    });
    if(bFirstLoaded && bNewPendingReports){
        fnShowNotification("New pending reports","report");
    }
    bNewPendingReports = false; // back to false, will be set to true again if there are new pending reports
    bFirstLoaded = true; // initial batch loaded, ready to show notifications for new ones
});


var fnFormatDamage = function(damage){
    var sDamage = "";
    if(damage){
        //reformatting damage array
        for(var i = 0; i < damage.length; i++){

            if(i < 3){
                sDamage += damage[i] + "<br>";
            }
            if(i===4){
                sDamage += '<button class="more-btn">' +
                    '<div class="circles-container">' +
                    '<div class="circle"></div>' +
                    '<div class="circle"></div>' +
                    '<div class="circle"></div>' +
                    '</div>'+
                    '</button>';
            }
        }
    }
    return sDamage;
};

var fnAddPending = function(key, company, damage ){

    var sDamage = fnFormatDamage(damage);

    //new object: add blueprint with data to html
    var sBlueprint = ' <div id="'+key+'" class="text-report-card card card-1">' +
        '<div class="h4 card-text">' +
        '<p class="bold">Damaged part(s)</p>'+sDamage+'<br/><br/>' +
        '<p class="bold">'+company+'</p>Bike id '+ key +'</div>' +
        '<div class="card-buttons">' +
        '<svg class="lnr lnr-checkmark-circle report-accept link"><use xlink:href="#lnr-checkmark-circle"></use></svg>' +
        '<svg class="lnr lnr-cross-circle report-decline link"><use xlink:href="#lnr-cross-circle"></use></svg>'+
        '<svg class="report-delete lnr lnr-trash link"><use xlink:href="#lnr-trash"></use></svg>' +
        '</div>' +
        '</div>';

    $("#report-container").append( sBlueprint ); // add pending report to container
};

var fnAddAccepted = function(key, company, damage){
    var sDamage = fnFormatDamage(damage);
    //new object: add blueprint with data to html
    var sBlueprint = ' <div id="'+key+'" class="text-report-card card card-1 card-accept">' +
        '<div class="h4 card-text">' +
        '<p class="bold">Damaged part(s)</p>'+sDamage+'<br/><br/>' +
        '<p class="bold">'+company+'</p>Bike id '+ key +'</div>' +
        '<div class="card-buttons">' +
        '<svg class="lnr lnr-checkmark-circle report-accept link"><use xlink:href="#lnr-checkmark-circle"></use></svg>' +
        '<svg class="lnr lnr-cross-circle report-decline link"><use xlink:href="#lnr-cross-circle"></use></svg>' +
        '<svg class="report-delete lnr lnr-trash link"><use xlink:href="#lnr-trash"></use></svg>' +
        '</div></div>';

    $("#archive-container").append( sBlueprint ); // add pending report to container
};

var fnAddDeclined = function(key, company, damage){
    var sDamage = fnFormatDamage(damage);
    //new object: add blueprint with data to html
    var sBlueprint = ' <div id="'+key+'" class="text-report-card card card-1 card-decline">' +
        '<div class="h4 card-text">' +
        '<p class="bold">Damaged part(s)</p>'+sDamage+'<br/><br/>' +
        '<p class="bold">'+company+'</p>Bike id '+ key +'</div>' +
        '<div class="card-buttons">' +
        '<svg class="lnr lnr-checkmark-circle report-accept link"><use xlink:href="#lnr-checkmark-circle"></use></svg>' +
        '<svg class="lnr lnr-cross-circle report-decline link"><use xlink:href="#lnr-cross-circle"></use></svg>' +
        '<svg class="report-delete lnr lnr-trash link"><use xlink:href="#lnr-trash"></use></svg>' +
        '</div></div>';

    $("#archive-container").append( sBlueprint ); // add pending report to container
};


/********************************************************************************
 UPDATE
 ********************************************************************************/

var fnSetStatus = function(id, val){
    database.ref('bikes/' + id + '/status').set(val);
};

var fnArchiveCard = function(id, status){
    var sCard = $('#'+id);
    sCard.appendTo('#archive-container');
    sCard.addClass('card-'+status);
};

var fnRemovePendingNotification = function(){
  iPendingReports--; // not pending anymore
  if(iPendingReports===0){
    sPendingNotification.hide();
  }
  sPendingReports = $('.pending-reports-num');
  sPendingReports.text(iPendingReports); // set number of pending reports in notification and dashboard
};

/********************************************************************************
 Accept
 ********************************************************************************/

$(document).on('click','.report-accept', function(){
    fnAcceptReport(this);
});

var fnAcceptReport = function (that){
    var sId= that.parentNode.parentNode.id;

    // update Database
    fnSetStatus(sId, "accepted");

    // update interface
    fnRemovePendingNotification();
    fnArchiveCard(sId, "accept");
    fnShowMessage("Report accepted","success");

};

/********************************************************************************
 Decline
 ********************************************************************************/
$(document).on('click','.report-decline', function(){
    fnDeclineReport(this);
});

var fnDeclineReport = function (that){
    var sId= that.parentNode.parentNode.id;

    // update Database
    fnSetStatus(sId, "declined");

    // update interface
    fnRemovePendingNotification();
    fnArchiveCard(sId, "decline");
    fnShowMessage("Report declined","error");
};

/********************************************************************************
 Feedback
 ********************************************************************************/
// remove card from interface
var fnRemoveCard = function (id) {
    $('#'+id).remove();
};

/********************************************************************************
 DELETE
 ********************************************************************************/

var fnRemoveFromDB = function(id){
    database.ref('bikes/' + id).remove(function(error){
      // update interface if successful
        if(!error){
          fnShowMessage("Report deleted!","success");
          fnRemoveCard(id);
          aLoadedReports.splice(id, 1);
        }else{
          fnShowMessage("Delete failed...","error");
        }
    });
};

$(document).on('click','.report-delete', function(){
    fnDeleteReport(this);
});

var fnDeleteReport = function (that){
    var sId= that.parentNode.parentNode.id;

    // update database
    fnRemoveFromDB(sId);

};
