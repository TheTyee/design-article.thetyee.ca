
jQuery( document ).ready( function( $ ) {
	$('.new-nav__burger').click(function() {
        //e.preventDefault();       
			  if ( $('.new-site-nav__dropdown').is(":hidden")) {
			  	$('.new-nav__burger .fas').removeClass('fa-bars').addClass('fa-times');
				window.startPoint = $(window).scrollTop();
			    $(window).scrollTop($(".new-site-nav__search-dropdown").scrollTop() );
			  	} else {
				  	$('.new-nav__burger .fas').removeClass('fa-times').addClass('fa-bars');
				if (typeof startpoint !== "undefined" || startpoing !== null) {				
					$(window).scrollTop(window.startPoint);
				}
				}
		$('#new-search-form-input').focus();		
	});  
});	

function bumpMenu() {
var barHeight = $(".new-site-header__logo-block-wrapper").height();
$("#new-site-navigation").css("margin-top", barHeight + "px");
var menuheight = $(".new-site-navigation").height();
$(".new-site-nav__dropdown").css("top", barHeight-15 + "px");
};


jQuery(document).ready(function() {
bumpMenu();
});

jQuery( window ).on( "load", function() {
    bumpMenu();
	setMain();
    });

jQuery(window).on('resize', function(){
bumpMenu();
setMain();
});




function setMain(){
	if ($("main").offset() ) {
	window.mainPosition = $("main").offset().top;
	} else if ($("header.article__header").offset() ) {
		window.mainPosition = $("header.article__header").offset().top;
	} else if ($($("article")[0]).offset() ) {
	  window.mainPosition = $($("article")[0]).offset().top;
	} else {
		window.mainPosition = 300;
	}
}
// Add/remove classes to navigation based on position


function scrollMenu(){
	setMain();
	if ($(window).scrollTop()  > mainPosition) {
      $('.new-site-header__logo-block').addClass('scroll');
    } else {
      $('.new-site-header__logo-block').removeClass('scroll');
	}
}

$(window).bind('load scroll', function() {
 scrollMenu();
});


