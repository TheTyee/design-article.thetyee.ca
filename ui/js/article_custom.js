//check if an image exists
function imageExists(image_url){
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status != 404;
}

// add .ad-blocker if ad blocker present
// if(typeof canRunAds == "undefined") {
//     jQuery("body").addClass("ad-blocker");
// }


function latestFix(){
    var latestHeight= 0;
    jQuery(".latest-stories__media-wrapper li").height("auto");
    jQuery(".latest-stories__media-wrapper li").each(function(){
        if (latestHeight < jQuery(this).height()) {
            latestHeight =  jQuery(this).height();
        }

    });

    jQuery(".latest-stories__media-wrapper li").height(latestHeight + 10);
}


function fixFeaturedMediaOffset(){
    if (jQuery(window).width() >= 1200 && (jQuery('.featured-media .figure').height() >= 5 )  ) {
        var mediaHeight=  jQuery('.featured-media .figure').outerHeight();
        var sectionHeight=  jQuery(".featured-media .ad-box").outerHeight();
        if (  (sectionHeight - mediaHeight) >= 0  && jQuery(".featured-media .ad-box").css("display") === "block" ) {

            var mediamargin =  mediaHeight - sectionHeight + -13;
            jQuery("section.featured-media").css("margin-bottom", mediamargin);

            if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1)  {
                var negmargin = -1 * mediamargin;
                jQuery(jQuery("article .container-fluid aside")[0]).css("margin-top", negmargin);
            }
        }
    } else {
        jQuery("section.featured-media").css("margin-bottom", "inherit");
        jQuery(jQuery("article .container-fluid aside")[0]).removeAttr("style");
    }
}


// function to hide comments unless a link being followed to a specific comment ( comments are not hidden in css anymore by default)

function mobileFriendlyCommentsStr() {
    // Adds the .stric-comment-cnt class to the Disqus comment counter
    // so it can be hidden on mobile
    var str = jQuery('.str-comment').text();
    if (str ===  "No comments yet") {
var newstr =  "None yet"; 
 jQuery('.str-comment').html(newstr);
} else {
    var newstr = str.replace(/comments/i, '<span class="str-comment-cnt hidden-sm hidden-xs">Comments</span>');
    jQuery('.str-comment').html(newstr);
    }
}

function hideIfNoHash() {
    var hash = window.location.hash;
    if (hash.indexOf("comment") !== -1 ) {
        jQuery('.read-more').fadeOut();
    } else {
        var el = jQuery('.comments-section');
        el.css(
            "height", "660px"
        );
        
    
        
    }
}

function enableEmailSubscription() {
    var proxyAPI;
    if ( location.host === 'thetyee.ca' || location.host === 'www.thetyee.ca') {
        proxyAPI = 'https://webhooks.thetyee.ca/subscribe/';
    } else if ( location.host === 'preview.thetyee.ca' ) {
        proxyAPI = 'https://preview.webhooks.thetyee.ca/subscribe/';
    } else {
        proxyAPI = 'http://127.0.0.1:3000';
    }

    jQuery(".btn--subscribe").click(function(e){
        e.preventDefault();
        var theForm = jQuery(this).parents("form")[0];
        var selectid =  jQuery(this).attr("id") + "option";
        var selectvalue = jQuery("#" +selectid).val();
        jQuery('<input />').attr('type', 'hidden').attr('name', selectvalue).attr('value', "1").appendTo(theForm);
        var theData = jQuery(theForm).serialize();
        jQuery.ajax({
            type : 'POST',
            url : proxyAPI,
            data: theData,
            success: function (data, status, jqXHR) {
                var successJSON = jqXHR.responseJSON;
                var successHtml = successJSON.html;
                jQuery("#subscribesection").hide().html("<section id='subscribe-success'><div class='alert alert-success' role='alert'>" + successHtml + "</div></section>").fadeIn('slow');
            },
            error: function(jqXHR, string, errorThrown) {
                var errorJSON = jqXHR.responseJSON;
                var errorString = errorJSON.text;
                jQuery("#subscribesection").hide().html('<div class="subscription-error alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span>' + errorString + '</div>').fadeIn('slow');
            }
        });
    });  
}

jQuery(window).load(function() {
    // attaching to window load
    latestFix();
  mobileFriendlyCommentsStr();
   //  hideIfNoHash();
    enableEmailSubscription();
});
window.data;
window.url;
window.encodedURL;
window.combined;
window.datatwo;

function showShares() {
    
      if (combined > 20) {
                         jQuery("#sharecount span.count").text(combined);
                        jQuery("#sharecount").fadeIn();
                     } else {
                        jQuery(".tool-bar .count").hide();
                        console.log("facebook sharecount not loading");
                     }  
    
}

function sharesFromFB() {
    console.log("adding / usng shares direct from fb");
     var encodedURL = encodeURIComponent(url);
        var fbfetch = 'https://graph.facebook.com/?ids=' + encodedURL + '&fields=engagement';
        var abc;
        var request = jQuery.ajax({
                dataType: "jsonp",
                url:fbfetch,
                data: abc,
                success: function(dd ) {
                    window.data = dd;
                        combined = combined + parseInt(window.data[url].share.share_count);
                   showShares();
                    },
                timeout: 4000
            }).fail( function( xhr, status ) {
                if( status == "timeout" ) {
                    // do stuff in case of timeout
                }
            });
    

}



// Wrap IIFE around your code
(function($, viewport){
    jQuery(document).ready(function() {
jQuery(".chevron").click(function(){
$(".latest-stories__media-wrapper li").toggle();
});

        jQuery('a.btn-comment, a.str-comment').click(function(e){
            jQuery('html, body').animate({
                scrollTop: jQuery("#disqus_thread").offset().top
            }, 500, function(){
                jQuery(".comments-section button").click();
            });
            return false;
        });

        // populate shared count

        var shareAPI;
        if ( location.host === 'thetyee.ca' || location.host === 'www.thetyee.ca') {
            shareAPI = 'https://widgets.thetyee.ca';
        } else if ( location.host === 'preview.thetyee.ca' ) {
            shareAPI = 'http://preview.widgets.thetyee.ca';
        } else {
            shareAPI = 'http://127.0.0.1:3000';
        }
        var meta = jQuery('meta[property="og:url"]');
       url = meta.attr("content");
        url = url.replace(/http:/i, "https:");
        var httpurl = url.replace(/https:/i, "http:");
        url = url.replace(/preview.thetyee/i, "thetyee");

        combined = 0;
      
              function getShares() {
                  
                   jQuery.getJSON( shareAPI + '/shares/url/all.json?url=' + url, function(dttwo) {
                    datatwo = dttwo;
                        combined = combined +  parseInt(datatwo.result.total); 
console.log(datatwo.result);   
                  if (combined < 1 &&  parseInt(datatwo.result.facebook.engagement.share_count) < 1 ) {
                   // sharesFromFB();
                   console.log("no shares found");
                  } else {
                  console.log("using widget share count");
                  showShares();
                  
                  }
                  
                  }).error(function() {  console.log('error fetching shares');   });
                
       
       }
       // getShares();
       jQuery("li.count").hide();
       
       
       

        // Shows asides that contain img child element, as per the draft :has css pseudo-class described here:
        // http://www.ericponto.com/blog/2015/01/10/has-pseudo-class-parent-selector/
        // The polyfill is no longer working so this is now done via js
        jQuery(".aside:has(> img)").css("display", "block");


        // read more expand instead of following link

        jQuery(".author-more").click(function(e){
            e.preventDefault();
            jQuery(this).hide();
            jQuery(".author-info__text").addClass("overflow");
        });





        //fix offset
        var windowWidth = jQuery(window).width();

        fixFeaturedMediaOffset();

        //Do not kill the dropdowns when users click in them)
        jQuery('.dropdown-menu').children().click(function(e){
            e.stopPropagation();
        });

        //*======= ALLOW MULTIPLE NAV ITEMS TO BE OPEN AT ONCE IN MOBILE
        if (jQuery(window).width() < 992){
            jQuery('.dropdown.keep-open').on({
                "shown.bs.dropdown": function() { this.closable = false; },
                    "click":             function() { this.closable = true; },
                    "hide.bs.dropdown":  function() { return this.closable; }
            });
        } else {
            // this function not related to above just piggybacking on the if statement. It pushes the main content down when latest stories is open
            var menuheight = 0;
            jQuery('.col-sm-12 .dropdown').on('show.bs.dropdown', function(event) {
                if (jQuery(window).width() > 991) {
                    menuheight = jQuery(this).children(".dropdown-menu").outerHeight();
                    jQuery(".article__header").animate({
                        marginTop: "+=" +menuheight
                    }, 250, function() {
                        // Animation complete.
                    });
                }
            });
            jQuery('.col-sm-12 .dropdown').on('hide.bs.dropdown', function(event) {
                if (jQuery(window).width() > 991) {
                    jQuery(".article__header").animate({
                        marginTop: "-=" +menuheight
                    }, 250, function() {
                        // Animation complete.
                    });
                }
            });
        }
        // resets margin-top on .article__header when window resized to prevent stuck margin on resize/orientation shift
        function resizedw(){
            //modified to fire after only 100ms so that it doesn't go multiple times per resize
            // Store the window width
            // Resize Event
            // Check window width has actually changed and it's not just iOS triggering a resize event on scroll
            if (jQuery(window).width() != windowWidth) {
                // Update the window width for next time
                windowWidth = jQuery(window).width();
                // Do stuff here
                jQuery(".open").removeClass("open");
                jQuery(".article__header").css("margin-top", 0);
                fixFeaturedMediaOffset();
                latestFix();
            }
            // Otherwise do nothing
        }

        var doit;
        window.onresize = function(){
            clearTimeout(doit);
            doit = setTimeout(resizedw, 100);
        };

        //Moves focus directly to search field when user begins typing
/*
        jQuery('.search-block').on('show.bs.dropdown', function(event) {

            setTimeout(function(){
                jQuery('input#menu__search--input').focus();
            }, 500);
        });
*/

		/* place cursor in search field on toggle */
		jQuery('.nav-bar__link--search').click(function(e) {      
			$('input#new-search-form-input').focus();
		});

       

        // Show Disqus comments
        jQuery(".comments-section .btn").click(function(e) {
            e.preventDefault();
            var el = jQuery('.comments-section');
            el.css({
                "height": "auto",
            });

            // fade out read-more
            jQuery('.read-more').fadeOut();
	    jQuery('#comment_agreement').fadeOut();
        });
    });

})(jQuery, ResponsiveBootstrapToolkit);
