

$(document).on('mouseover','#sidebar', function(){
    fnAnimateSidebarIn();
});
$(document).on('mouseleave','#sidebar', function(){
    fnAnimateSidebarOut();
});
$(document).on('click','#sidebar', function(){
    fnAnimateSidebarOut();
});

var fnAnimateSidebarIn = function (){
    $( "#sidebar" ).animate({
        left: "0"
    }, 200);
};

var fnAnimateSidebarOut = function (){
    $( "#sidebar" ).animate({
        left: "-23vw"
    }, 100);
};