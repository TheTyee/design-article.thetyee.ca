
jQuery( document ).ready( function( $ ) {
	$('.new-nav__burger, .nav-bar__link--more, .nav-bar__link--search').click(function() {
        //e.preventDefault();       
			  if ( $('.new-site-nav__dropdown').is(":hidden")) {
			  	$('.new-nav__burger .fas').removeClass('fa-bars').addClass('fa-times');
				window.startPoint = $(window).scrollTop();
			    $(window).scrollTop($(".new-site-nav__search-dropdown").scrollTop() );
			  	} else {
				  	$('.new-nav__burger .fas').removeClass('fa-times').addClass('fa-bars');
				if (typeof startpoint !== "undefined" || startpoint !== null) {				
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
}


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

var window.mainPosition = $("main").offset().top;


function setMain(){
	
	window.mainPosition = $("main").offset().top;
}

// Add/remove classes to navigation based on position

var hideHeaderOnScrollDelay = 200;

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

