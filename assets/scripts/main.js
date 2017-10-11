

$(document).on('mouseover','#sidebar', function(){
    fnAnimateSidebarIn();
});
$(document).on('mouseleave','#sidebar', function(){
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
};
