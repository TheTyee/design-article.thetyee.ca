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
        if (  (sectionHeight - mediaHeight) >= 0) {

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
    var str = jQuery('.str-comment').html();
    if (str) {
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
            "height", "460px"
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
                var successString = jqXHR.responseText;
                jQuery("#subscribesection").hide().html("<section id='subscribe-success'><div class='alert alert-success' role='alert'>" + successString + "</div></section>").fadeIn('slow');
            },
            error: function(jqXHR, string, errorThrown) {
                var errorString = jqXHR.responseText;
                jQuery("#subscribesection").hide().html('<div class="subscription-error alert alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span>' + errorString + '</div>').fadeIn('slow');
            }
        });
    });  
}

jQuery(window).load(function() {
    // attaching to window load
    latestFix();
    mobileFriendlyCommentsStr();
    hideIfNoHash();
    enableEmailSubscription();
});

// Wrap IIFE around your code
(function($, viewport){
    jQuery(document).ready(function() {

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
        var url = meta.attr("content");
        url = url.replace(/http:/i, "https:");
        var httpurl = url.replace(/https:/i, "http:");
        url = url.replace(/preview.thetyee/i, "thetyee");

        var combined = 0;
              
        jQuery.getJSON('https://graph.facebook.com/?ids=' + url, function(data) {
            combined = combined + parseInt(data[Object.keys(data)[0]].share.share_count);
            console.log(data);
            jQuery.getJSON( shareAPI + '/shares/url/all.json?url=' + url, function(datatwo) {
            combined = combined +  parseInt(datatwo.result.email.shares) + parseInt(datatwo.result.twitter.count);
             jQuery("#sharecount span.count").text(combined);
            jQuery("#sharecount").fadeIn();

            });

        });

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
        jQuery('.search-block').on('show.bs.dropdown', function(event) {

            setTimeout(function(){
                jQuery('input#menu__search--input').focus();
            }, 500);
        });



        //LATEST STORIES


        jQuery.fn.reverse = function() {
            return this.pushStack(this.get().reverse(), arguments);
        };


        //GLOBALS
        var totalStoryPositions;
        var counter =0;
        var topCounter = 0;
        var bottomCounter = 0;
        var response;
        var recentItems;
        var returnedStories = [];
        var storyObjects = [];
        var firstStory;
        var topPrevCounter = 0;
        var bottomPrevCounter = 0;

        //make storyObjects global, so I don't have to keep hitting the API
        storyObjects = storyObjects;

        //Returned stories from the API
        function getLatestStories(){
            storiesRequested = 25;
            returnedStories = jQuery.ajax({
                method: 'POST',
                url: 'https://api.thetyee.ca/v1/latest/' + storiesRequested,
                dataType: 'jsonp',
                data: response,
                crossDomain: true,
                success: function(response){
                    returnedStories = returnedStories.responseJSON.hits.hits;
                    //pass data to the create function so I can create my own story objects
                    recentItems = createStoryObjects(returnedStories);
                    return recentItems;
                },
                error: function(){
                }
            });
        }//end lateststories()

        //Format the json data for ease of manipulation
        function createStoryObjects(returnedStories, callback){
            //remove the placeholder classes
            jQuery('.latest-stories__hed').removeClass('hed_preload_placeholder');
            jQuery('.latest-stories__dek').removeClass('dek_preload_placeholder');

            //API data, to feed into an array of custom story objects
            recentItems = returnedStories;

            //for each item from the API, plug info into a story object
            jQuery.each(recentItems, function(key, value){

                latestStoryImage = value._source.related_media[0].uri;

                // get the smallest image > 200px available
                var bestWidth = value._source.related_media[0].width;
                var bestHeight = value._source.related_media[0].height;
                 var latestThumbFound=0;
                for (var k in value._source.related_media[0].thumbnails) {
                    var thumb = value._source.related_media[0].thumbnails[k];
                    thumb.uri = thumb.uri.replace("http://thetyee.cachefly.net", "//thetyee.ca");
                    thumb.url = thumb.uri.replace("http://thetyee", "//thetyee");
                    if (thumb.uri.indexOf("latest") > -1) {
                        latestStoryImage = thumb.uri;
                        LatestThumbFound = 1;
                        break; }
                    };

                if (latestThumbFound < 1) {
                    for (var k in value._source.related_media[0].thumbnails) {
                        var thumb = value._source.related_media[0].thumbnails[k];
                        if (thumb.uri.indexOf("square") > -1) { continue; }
                        thumb.uri = thumb.uri.replace("thetyee.cachefly.net", "thetyee.ca");
                        if (
                            // re-enable live to filter out not yet published thumbnails
                            //			imageExists(thumb.uri) == true &&
                            thumb.width >= 200 && thumb.width <= bestWidth) {
                                bestWidth = thumb.width;
                                bestHeight = thumb.height;
                                latestStoryImage = thumb.uri;
                                }
                          
                    }
                }

                //Format the API img uri's so they don't point at cachefly
                latestStoryImage = latestStoryImage.replace("thetyee.cachefly.net", "thetyee.ca");
               // also remove http references
                latestStoryImage = latestStoryImage.replace("http://thetyee", "//thetyee");

                //Use moment.js to format the date
                formattedDate = moment.utc(value._source.storyDate).format("DD MMM");

                //Set default values for the Story object
                var Story = {
                    urlPath : 'link',
                    hed : 'title',
                    image : 'image',
                    dek : 'test',
                    date : 'date',
                    authour : 'authour'
                };

                //Populate Story objects with API data
                Story.urlPath = value._source.path;
                Story.hed = value._source.title;
                Story.image = latestStoryImage;
                Story.dek = value._source.teaser;
                Story.date = formattedDate;
                Story.authour = value._source.byline;
                Story.imageWidth = bestWidth;
                Story.imageHeight = bestHeight;

                //Put all objects into a new array for easier handling
                storyObjects.push(Story);
            });
            // on load, populate the DOM
            jQuery('.latest-stories__media-wrapper').each(function(key, index){
                jQuery(this).parent().find('li').each(function(i, details){

                    if (key === 0){
                        // TODO swap this out when closer to production
                        //jQuery(this).find('a').attr('href', '#');
                        // Old value
                        jQuery(this).find('a').attr('href', "//thetyee.ca" + storyObjects[topCounter].urlPath);
                        if (storyObjects[topCounter].urlPath.indexOf("/Presents/") > -1) {
                          jQuery(this).find('.media-body').prepend('<a class="remove" href="/Presents"><strong>TYEE PRESENTS</strong></a>');
                            jQuery(this).addClass("sponsored");
                        }
                        jQuery(this).find('img').attr('src', storyObjects[topCounter].image);
                        jQuery(this).find('img').attr('width',storyObjects[topCounter].imageWidth);
                        jQuery(this).find('img').attr('height', storyObjects[topCounter].imageHeight);
                        jQuery(this).find('h4').html(storyObjects[topCounter].hed);
                        jQuery(this).find('p').html(storyObjects[topCounter].dek);
                        jQuery(this).find('.latest-stories__date').html(storyObjects[topCounter].date);
                        jQuery(this).find('.latest-stories__authour').html(storyObjects[topCounter].authour);
                        topCounter++;
                    }
                    if (key == 1){
                        // TODO swap this out when closer to production
                        //jQuery(this).find('a').attr('href', '#');
                        // Old value
                        jQuery(this).find('a').attr('href', "//thetyee.ca" + storyObjects[bottomCounter].urlPath);
                        if (storyObjects[bottomCounter].urlPath.indexOf("/Presents/") > -1) {
                            jQuery(this).find('.media-body').prepend('<a class="remove" href="/Presents"><strong>TYEE PRESENTS</strong></a>');
                            jQuery(this).addClass("sponsored");
                        }
                        jQuery(this).find('img').attr('src', storyObjects[bottomCounter].image);
                        jQuery(this).find('img').attr('width',storyObjects[topCounter].imageWidth);
                        jQuery(this).find('img').attr('height', storyObjects[topCounter].imageHeight);
                        jQuery(this).find('h4').html(storyObjects[bottomCounter].hed);
                        jQuery(this).find('p').html(storyObjects[bottomCounter].dek);
                        jQuery(this).find('.latest-stories__date').html(storyObjects[bottomCounter].date);
                        jQuery(this).find('.latest-stories__authour').html(storyObjects[bottomCounter].authour);
                        bottomCounter++;
                    }
                });
            });
            //control the scrolling
            scrollLatestStories();
        }


        //Make Ajax call and put data into the returnedStories var for manipulation.
        getLatestStories();



        //takes parameters of current slider
        function scrollLatestStories(){
            //Get the next group of stories on click

            function stylePresents(counter, element) {
                                                            if (counter && counter.urlPath.indexOf("/Presents/") > -1) {
                                    jQuery(element).children('.media-body').prepend('<a class="remove" href="/Presents"><strong>TYEE PRESENTS</strong></a>');
                                    jQuery(element).addClass("sponsored");
                            } else {
                                   jQuery(element).find(".remove").remove();
                                   jQuery(element).removeClass("sponsored");
                            }
    
    
}
            
            jQuery('.latest-stories__media-wrapper').each(function(key, index){
                jQuery(this).on('click', '.next', function(event){

                    jQuery(this).parent().find('li').each(function(i, details){

                        if (key === 0){
                            
                            if (storyObjects[topCounter]) {
                             stylePresents(storyObjects[topCounter], this);
                             jQuery(this).find('a').attr('href', "//thetyee.ca" + storyObjects[topCounter].urlPath);                            
                            jQuery(this).find('a').attr('href', storyObjects[topCounter].urlPath);
                            jQuery(this).find('img').attr('src', storyObjects[topCounter].image);
                            jQuery(this).find('h4').html(storyObjects[topCounter].hed);
                            jQuery(this).find('p').html(storyObjects[topCounter].dek);
                            jQuery(this).find('.latest-stories__date').html(storyObjects[topCounter].date);
                            jQuery(this).find('.latest-stories__authour').html(storyObjects[topCounter].authour);
                            }
                            topCounter++;

                            if (topCounter >= storiesRequested){
                                topCounter = 0;
                            }

                        }

                        if (key == 1){
                           if (storyObjects[bottomCounter]) {
                                        stylePresents(storyObjects[bottomCounter], this);
                                        jQuery(this).find('a').attr('href', storyObjects[bottomCounter].urlPath);
                                        jQuery(this).find('img').attr('src', storyObjects[bottomCounter].image);
                                        jQuery(this).find('h4').html(storyObjects[bottomCounter].hed);
                                        jQuery(this).find('p').html(storyObjects[bottomCounter].dek);
                                        jQuery(this).find('.latest-stories__date').html(storyObjects[bottomCounter].date);
                                        jQuery(this).find('.latest-stories__authour').html(storyObjects[bottomCounter].authour);
                            
                             }
                            bottomCounter++;

                            if (bottomCounter >= storiesRequested){
                                bottomCounter = 0;
                            }
                        }


                    });
                    //reset the counter so I can scroll the other way
                    topPrevCounter = topCounter - 7;
                    bottomPrevCounter = bottomCounter - 7;

                    //reset the click event

                });



                jQuery(this).on('click', '.prev', function(event){
                    jQuery(this).parent().find('li').reverse().each(function(i, details){
                        //infinite backwards scroll
                        if (topPrevCounter <=0){
                            topPrevCounter = (storiesRequested-1);
                        }
                        if (key === 0){
                        if (storyObjects[topPrevCounter]) {
                            stylePresents(storyObjects[topPrevCounter], this);
                            jQuery(this).find('a').attr('href', storyObjects[topPrevCounter].urlPath);
                            jQuery(this).find('img').attr('src', storyObjects[topPrevCounter].image);
                            jQuery(this).find('h4').html(storyObjects[topPrevCounter].hed);
                            jQuery(this).find('p').html(storyObjects[topPrevCounter].dek);
                            jQuery(this).find('.latest-stories__date').html(storyObjects[topPrevCounter].date);
                            jQuery(this).find('.latest-stories__authour').html(storyObjects[topPrevCounter].authour);

                        }        
                            topPrevCounter--;
                        }

                        if (bottomPrevCounter <= 0){
                            bottomPrevCounter = 24;
                        }

                        if (key == 1){
                             if (storyObjects[topPrevCounter]) {
                            stylePresents(storyObjects[bottomPrevCounter], this);
                            jQuery(this).find('a').attr('href', storyObjects[bottomPrevCounter].urlPath);
                            jQuery(this).find('img').attr('src', storyObjects[bottomPrevCounter].image);
                            jQuery(this).find('h4').html(storyObjects[bottomPrevCounter].hed);
                            jQuery(this).find('p').html(storyObjects[bottomPrevCounter].dek);
                            jQuery(this).find('.latest-stories__date').html(storyObjects[bottomPrevCounter].date);
                            jQuery(this).find('.latest-stories__authour').html(storyObjects[bottomPrevCounter].authour);
                             }
                            bottomPrevCounter--;
                                console.log(bottomPrevCounter);
                        }

                    });
                    //reset the counter so i can go the other way
                    topCounter = topPrevCounter + 7;
                    bottomCounter = bottomPrevCounter + 7;
                    //reset the counter for infinite scrolling

                });
            });

        }//END LATEST STORIES SCROLLER


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
