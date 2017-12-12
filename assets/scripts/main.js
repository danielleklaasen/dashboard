/********************************************************************************

 TABLE OF CONTENTS

    Desktop notifications        25

    Feedback to user             82

    Navigation                  133
        Sidebar                 198

    Login                       233

    Search                      250

    Firebase                    276
        Read                    284
        Update                  415
        Delete                  509

 ********************************************************************************/

/********************************************************************************

 Desktop notifications

 ********************************************************************************/

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

var oSound = new Audio('audio/notification.mp3'); // set up audio object
var oChangeTitle;
var iIterations = 0;

function fnShowNotification(title, report){
    oSound.play();
    var sBaseTitle = document.title;
    var sNotificationTitle = "New "+report+" received"; // reports / report depending on amount
    oChangeTitle = setInterval(function(){
        fnChangeTitle(sBaseTitle, sNotificationTitle);
    }, 1000);
    fnShowDesktopNotification(title);
}

function fnChangeTitle(baseTitle, notificationTitle) { // browser tab title change
    if (iIterations < 6){
        if(document.title === baseTitle){
            document.title = notificationTitle;
        }else{
            document.title = baseTitle;
        }
    }else{
        clearInterval(oChangeTitle);
        iIterations = 0;
    }
    iIterations++;
}

function fnShowDesktopNotification(title) {
    if (Notification.permission !== "granted"){
        Notification.requestPermission();
    }
    else {
        var oNotification = new Notification(title);
        oNotification.onclick = function () {
            fnOpenReportWdw();
        };
    }
}

/********************************************************************************

 FEEDBACK TO USER

 ********************************************************************************/
var bTimerIsSet = false; // timer to hide notification

var oMessageTimer;
function fnResetTimer() {
  clearTimeout(oMessageTimer);
}

function fnShowMessage(message, type) {
  var sMessage = $('#message');
  sMessage.text(message);

  switch(type) {
    case "success":
      sMessage.removeClass("error").addClass("success"); // success color notification
      break;
    case "error":
      sMessage.className = "";
      sMessage.removeClass("success").addClass("error"); // error color notification
      break;
    default:
      sMessage.className = "";
  }

  sMessage.animate({
    top: 0
  }, 550);

  // handling multiple messages
  // only call hide message, when the most recent message has been shown for 2 s

  if(bTimerIsSet){
    fnResetTimer();  // there is another message coming in, new timer required
  }

  oMessageTimer = setTimeout(function(){ fnHideMessage(); }, 2000);
  bTimerIsSet = true;
}

function fnHideMessage(){
  bTimerIsSet = false; // reset timer
  var sTopValue="-50px";
  $('#message').animate({
    top: sTopValue
  }, 550);
}

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

var fnOpenReportWdw = function (){
  fnCloseAllWdws();
  fnOpenWdw('report-wdw');
  fnSetActiveMenuItem('open-report-wdw');
};

var fnOpenArchiveWdw = function (){
  fnCloseAllWdws();
  fnOpenWdw('archive-wdw');
  fnSetActiveMenuItem('open-archive-wdw');
};

var fnOpenHomeWdw = function (){
  fnCloseAllWdws();
  fnOpenWdw('home-wdw');
  fnSetActiveMenuItem('open-home');
};

var fnOpenProfileWdw = function (){
  fnCloseAllWdws();
  fnOpenWdw('profile-wdw');
};

// open-report-wdw
$(document).on('click','.open-report-wdw', function(){
    fnOpenReportWdw();
});

// open-archive-wdw
$(document).on('click','.open-archive-wdw', function(){
    fnOpenArchiveWdw();
});

// open-home-wdw
$(document).on('click','.open-home', function(){
    fnOpenHomeWdw();
});

// open-profile-wdw
$(document).on('click','.open-profile', function(){
    fnOpenProfileWdw();
});

/********************************************************************************
 SIDEBAR
 ********************************************************************************/

var sSidebar = $("#sidebar");

var fnOpenSidebar = function (){
  if (!sSidebar.hasClass('open')){
    sSidebar.addClass('open'); // open sSidebar
  }
};

var fnCloseSidebar = function (){
  if (sSidebar.hasClass('open')){
    sSidebar.removeClass('open'); // close sSidebar
  }
};

$(document).on('click', '.open-menu', function(){
  fnOpenSidebar();
});

$(document).on('mouseenter','#sidebar', function(){
  fnOpenSidebar();
});

$(document).on('mouseleave','#sidebar', function(){
  fnCloseSidebar();
});

$(document).on('click touchend', '.close-menu, .sidebar-close, .menu-item-mobile, .menu-item', function(){
  fnCloseSidebar();
});

/********************************************************************************

 LOGIN

 ********************************************************************************/

var fnLogin = function(){
  var sOpenWindow = $('.login-wdw');
  sOpenWindow.fadeOut();
  fnOpenHomeWdw();
};

$(document).on('click','.btn-login', function(e){
    e.preventDefault();
    fnLogin();
});

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
var oDatabase = firebase.database();

/********************************************************************************
 Read
 ********************************************************************************/

var iPendingReports = 0;
var sPendingNotification = $('#pending-notification');
sPendingNotification.hide();
var bFirstLoaded = false;
var bNewPendingReports = false;
var aLoadedReports = [];

var oBikesRef = oDatabase.ref('bikes');

oBikesRef.orderByChild("timeStamp").on('value', function(snapshot) { // sort on date (ascending)
    sPendingReports = $('.pending-reports-num');
    sPendingReports.text(iPendingReports); // set number of pending reports in notification and dashboard
    snapshot.forEach(function(childSnapshot) { // loop through report items

        var oChildData = childSnapshot.val();
        var sKey = oChildData.bikeID;
        var sTimeStamp = oChildData.timeStamp;

        console.log("timestamp: "+sTimeStamp);

        if ($.inArray(sKey, aLoadedReports) != -1) {
            //the object ID is already in aIdProperties array
        }else{
            // report not loaded yet
            var sCompanyName = oChildData.companyName;
            var aDamages = oChildData.damages;

            var sStatus = oChildData.status;

            switch(sStatus) {
                case "pending":
                    fnAddPending(sKey, sCompanyName, aDamages);
                    iPendingReports++;
                    sPendingReports.text(iPendingReports); // set number of pending reports in notification and dashboard
                    sPendingNotification.show(); // show red dot notification of number new pending reports
                    bNewPendingReports = true; // setting to true so browser notification will show
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
            aLoadedReports.push(sKey); //add id to array
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
        // reformatting damage array
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
    var sDamage = fnFormatDamage(damage); // adds more button if necessary
    // new object: add blueprint with data to html
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
    // new object: add blueprint with data to html
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
    oDatabase.ref('bikes/' + id + '/status').set(val);
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
  $('.pending-reports-num').text(iPendingReports); // set number of pending reports in notification and dashboard
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

/*  Accept and decline combined in 1 function.
    Even though it avoids writing double code I decided not to use this due to readability.

var fnUpdateReportStatus = function (that, status){
  var sId= that.parentNode.parentNode.id;
  var sStatus;
  var sMessageType;

  switch (status){
    case "accept":
        sStatus = "accepted";
        sMessageType = "success";
        break;
    case "decline":
        sStatus = "declined";
        sMessageType = "error";
        break;
    default:
        // default code
  }
  var sMessage = "Report ";
  sMessage += sStatus;
  // update Database
  fnSetStatus(sId, sStatus);

  // update interface
  fnRemovePendingNotification();
  fnArchiveCard(sId, "accept");
  fnShowMessage(sMessage,sMessageType);
};
 */

/********************************************************************************
 DELETE
 ********************************************************************************/

var fnDeleteReport = function(that){
  var sId= that.parentNode.parentNode.id;
    // update database
    oDatabase.ref('bikes/' + sId).remove(function(error){
      // update interface if successful
        if(!error){
          $('#'+sId).remove(); // remove card
          aLoadedReports.splice(sId, 1);
          fnShowMessage("Report deleted!","success");
        }else{
          fnShowMessage("Delete failed...","error");
        }
    });
};

$(document).on('click','.report-delete', function(){
    fnDeleteReport(this);
});