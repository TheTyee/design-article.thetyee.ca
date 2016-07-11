//check if an image exists
function imageExists(image_url){
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status != 404;
}

function fixFeaturedMediaOffset(){
    if ($(window).width() >= 1200 && ($('.featured-media .figure').height() >= 5 )  ) {
        var mediaHeight=  $('.featured-media .figure').outerHeight();
        var sectionHeight=  $(".featured-media .ad-box").outerHeight();
        if (  (sectionHeight - mediaHeight) >= 0) {

            var mediamargin =  mediaHeight - sectionHeight + 30;
            $("section.featured-media").css("margin-bottom", mediamargin);
        }
    } else {
        $("section.featured-media").css("margin-bottom", "inherit");
    }
}

// Wrap IIFE around your code
(function($, viewport){
    $(document).ready(function() {
        $('a.btn-comment').click(function(e){
            $('html, body').animate({
                scrollTop: $('[name="' + $.attr(this, 'href').substr(1) + '"]').offset().top
            }, 500, function(){
                $(".comments-section button").click();
            });
            return false;
        });

	// read more expand instead of following link
		
$(".author-more").click(function(e){
    e.preventDefault();
    $(this).hide();
    $(this).parent().css("overflow", "visible");
});

	
	
        //fix offset
        var windowWidth = $(window).width();

        fixFeaturedMediaOffset();

        //Do not kill the dropdowns when users click in them)
        $('.dropdown-menu').children().click(function(e){
            e.stopPropagation();
        });

        //*======= ALLOW MULTIPLE NAV ITEMS TO BE OPEN AT ONCE IN MOBILE
        if ($(window).width() < 992){
            $('.dropdown.keep-open').on({
                "shown.bs.dropdown": function() { this.closable = false; },
                    "click":             function() { this.closable = true; },
                    "hide.bs.dropdown":  function() { return this.closable; }
            });
        } else {
            // this function not related to above just piggybacking on the if statement. It pushes the main content down when latest stories is open
            var menuheight = 0;
            $('.col-sm-12 .dropdown').on('show.bs.dropdown', function(event) {
                if ($(window).width() > 991) {
                    menuheight = $(this).children(".dropdown-menu").outerHeight();
                    $(".article__header").animate({
                        marginTop: "+=" +menuheight
                    }, 250, function() {
                        // Animation complete.
                    });
                }
            });
            $('.col-sm-12 .dropdown').on('hide.bs.dropdown', function(event) {
                if ($(window).width() > 991) {
                    $(".article__header").animate({
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
            if ($(window).width() != windowWidth) {
                // Update the window width for next time
                windowWidth = $(window).width();
                // Do stuff here
                $(".open").removeClass("open");
                $(".article__header").css("margin-top", 0);
                fixFeaturedMediaOffset();
            }
            // Otherwise do nothing
        }

        var doit;
        window.onresize = function(){
            clearTimeout(doit);
            doit = setTimeout(resizedw, 100);
        };

        //Moves focus directly to search field when user begins typing
        $('.search-block').on('show.bs.dropdown', function(event) {

            setTimeout(function(){
                $('input#menu__search--input').focus();
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
            returnedStories = $.ajax({
                method: 'POST',
                url: 'http://api.thetyee.ca/v1/latest/' + storiesRequested,
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
            $('.latest-stories__hed').removeClass('hed_preload_placeholder');
            $('.latest-stories__dek').removeClass('dek_preload_placeholder');

            //API data, to feed into an array of custom story objects
            recentItems = returnedStories;

            //for each item from the API, plug info into a story object
            $.each(recentItems, function(key, value){

                latestStoryImage = value._source.related_media[0].uri;

                // get the smallest image > 200px available
                var bestWidth = value._source.related_media[0].width;
                var bestHeight = value._source.related_media[0].height;
                for (var k in value._source.related_media[0].thumbnails) {
                    var thumb = value._source.related_media[0].thumbnails[k];
                    thumb.uri = thumb.uri.replace("thetyee.cachefly.net", "thetyee.ca");
                    if (
                        // re-enable live to filter out not yet published thumbnails
                        //			imageExists(thumb.uri) == true &&
                        thumb.width >= 200 && thumb.width <= bestWidth) {
                            bestWidth = thumb.width;
                            bestHeight = thumb.height;
                            latestStoryImage = thumb.uri;  }
                }

                //Format the API img uri's so they don't point at cachefly
                latestStoryImage = latestStoryImage.replace("thetyee.cachefly.net", "thetyee.ca");

                //Use moment.js to format the date
                formattedDate = moment(value._source.storyDate).format("DD MMM");

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
            $('.latest-stories__media-wrapper').each(function(key, index){
                $(this).parent().find('li').each(function(i, details){

                    if (key === 0){
                        // TODO swap this out when closer to production
                        //$(this).find('a').attr('href', '#');
                        // Old value
                        $(this).find('a').attr('href', "http://thetyee.ca" + storyObjects[topCounter].urlPath);
                        $(this).find('img').attr('src', storyObjects[topCounter].image);
                        $(this).find('img').attr('width',storyObjects[topCounter].imageWidth);
                        $(this).find('img').attr('height', storyObjects[topCounter].imageHeight);
                        $(this).find('h4').html(storyObjects[topCounter].hed);
                        $(this).find('p').html(storyObjects[topCounter].dek);
                        $(this).find('.latest-stories__date').html(storyObjects[topCounter].date);
                        $(this).find('.latest-stories__authour').html(storyObjects[topCounter].authour);
                        topCounter++;
                    }
                    if (key == 1){
                        // TODO swap this out when closer to production
                        //$(this).find('a').attr('href', '#');
                        // Old value
                        $(this).find('a').attr('href', "http://thetyee.ca" + storyObjects[bottomCounter].urlPath);
                        $(this).find('img').attr('src', storyObjects[bottomCounter].image);
                        $(this).find('img').attr('width',storyObjects[topCounter].imageWidth);
                        $(this).find('img').attr('height', storyObjects[topCounter].imageHeight);
                        $(this).find('h4').html(storyObjects[bottomCounter].hed);
                        $(this).find('p').html(storyObjects[bottomCounter].dek);
                        $(this).find('.latest-stories__date').html(storyObjects[bottomCounter].date);
                        $(this).find('.latest-stories__authour').html(storyObjects[bottomCounter].authour);
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

            $('.latest-stories__media-wrapper').each(function(key, index){
                $(this).on('click', '.next', function(event){

                    $(this).parent().find('li').each(function(i, details){

                        if (key === 0){
                            $(this).find('a').attr('href', storyObjects[topCounter].urlPath);
                            $(this).find('img').attr('src', storyObjects[topCounter].image);
                            $(this).find('h4').html(storyObjects[topCounter].hed);
                            $(this).find('p').html(storyObjects[topCounter].dek);
                            $(this).find('.latest-stories__date').html(storyObjects[topCounter].date);
                            $(this).find('.latest-stories__authour').html(storyObjects[topCounter].authour);

                            topCounter++;

                            if (topCounter >= storiesRequested){
                                topCounter = 0;
                            }

                        }

                        if (key == 1){

                            $(this).find('a').attr('href', storyObjects[bottomCounter].urlPath);
                            $(this).find('img').attr('src', storyObjects[bottomCounter].image);
                            $(this).find('h4').html(storyObjects[bottomCounter].hed);
                            $(this).find('p').html(storyObjects[bottomCounter].dek);
                            $(this).find('.latest-stories__date').html(storyObjects[bottomCounter].date);
                            $(this).find('.latest-stories__authour').html(storyObjects[bottomCounter].authour);
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



                $(this).on('click', '.prev', function(event){
                    $(this).parent().find('li').reverse().each(function(i, details){
                        //infinite backwards scroll
                        if (topPrevCounter <=0){
                            topPrevCounter = 49;
                        }
                        if (key === 0){
                            $(this).find('a').attr('href', storyObjects[topPrevCounter].urlPath);
                            $(this).find('img').attr('src', storyObjects[topPrevCounter].image);
                            $(this).find('h4').html(storyObjects[topPrevCounter].hed);
                            $(this).find('p').html(storyObjects[topPrevCounter].dek);
                            $(this).find('.latest-stories__date').html(storyObjects[topPrevCounter].date);
                            $(this).find('.latest-stories__authour').html(storyObjects[topPrevCounter].authour);
                            topPrevCounter--;
                        }

                        if (bottomPrevCounter <= 0){
                            bottomPrevCounter = 49;
                        }

                        if (key == 1){
                            $(this).find('a').attr('href', storyObjects[bottomPrevCounter].urlPath);
                            $(this).find('img').attr('src', storyObjects[bottomPrevCounter].image);
                            $(this).find('h4').html(storyObjects[bottomPrevCounter].hed);
                            $(this).find('p').html(storyObjects[bottomPrevCounter].dek);
                            $(this).find('.latest-stories__date').html(storyObjects[bottomPrevCounter].date);
                            $(this).find('.latest-stories__authour').html(storyObjects[bottomPrevCounter].authour);
                            bottomPrevCounter--;
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
        $(".comments-section .btn").click(function(e) {
            e.preventDefault();
            var el = $('.comments-section');
            var disqus_div = $('#disqus_thread');
            var anim_height = disqus_div.height() + 40;
            el.css({
                "height": 400,
                "max-height": 9999
            })
            .animate({
                "height": anim_height
            });

            // fade out read-more
            $('.read-more').fadeOut();
        });


    });

})(jQuery, ResponsiveBootstrapToolkit);
