// Wrap IIFE around your code
(function($, viewport){
    $(document).ready(function() {

        
        //Do not kill the dropdowns when users click in them)
        $('.dropdown-menu').children().click(function(e){
            e.stopPropagation();
        });


        //Moves focus directly to search field when user begins typing
        $('.search-block').on('show.bs.dropdown', function(event) {
            $(document).keydown(function(){
                $('input#menu__search--input').focus();
            });
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
            storiesRequested = 50;
            returnedStories = $.ajax({
                method: 'POST',
                url: 'http://api.thetyee.ca/v1/latest/' + storiesRequested,
                dataType: 'jsonp',
                data: response,
                crossDomain: true,
                success: function(response){
                    console.log(response);
                    returnedStories = returnedStories.responseJSON.hits.hits;
                    //pass data to the create function so I can create my own story objects
                    recentItems = createStoryObjects(returnedStories);
                    return recentItems;
                },
                error: function(){
                    console.log('NO DICE SISTER');
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

                //Format the API img uri's so they don't point at cachefly
                latestStoryImage = value._source.related_media[0].uri;
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

                //Put all objects into a new array for easier handling
                storyObjects.push(Story);
            });
            // on load, populate the DOM
            $('.latest-stories__media-wrapper').each(function(key, index){
                $(this).parent().find('li').each(function(i, details){

                    if (key === 0){
                        $(this).find('a').attr('href', storyObjects[topCounter].urlPath);
                        $(this).find('img').attr('src', storyObjects[topCounter].image);
                        $(this).find('h4').html(storyObjects[topCounter].hed + ' key ' + topCounter);
                        $(this).find('p').html(storyObjects[topCounter].dek);
                        $(this).find('.latest-stories__date').html(storyObjects[topCounter].date);
                        $(this).find('.latest-stories__authour').html(storyObjects[topCounter].authour);
                        topCounter++;
                    }
                    if (key == 1){

                        $(this).find('a').attr('href', storyObjects[bottomCounter].urlPath);
                        $(this).find('img').attr('src', storyObjects[bottomCounter].image);
                        $(this).find('h4').html(storyObjects[bottomCounter].hed + ' key ' + bottomCounter);
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

            //console.log(key + ' ' + value);
            $('.latest-stories__media-wrapper').each(function(key, index){
                $(this).on('click', '.next', function(event){
                    //	console.log($(this).find('li'));

                    $(this).parent().find('li').each(function(i, details){

                        if (key === 0){
                            $(this).find('a').attr('href', storyObjects[topCounter].urlPath);
                            $(this).find('img').attr('src', storyObjects[topCounter].image);
                            $(this).find('h4').html(storyObjects[topCounter].hed + ' key ' + topCounter);
                            $(this).find('p').html(storyObjects[topCounter].dek);
                            $(this).find('.latest-stories__date').html(storyObjects[topCounter].date);
                            $(this).find('.latest-stories__authour').html(storyObjects[topCounter].authour);

                            topCounter++;

                            if (topCounter >=50){
                                topCounter = 0;
                            }

                        }

                        if (key == 1){

                            $(this).find('a').attr('href', storyObjects[bottomCounter].urlPath);
                            $(this).find('img').attr('src', storyObjects[bottomCounter].image);
                            $(this).find('h4').html(storyObjects[bottomCounter].hed + ' key ' + bottomCounter);
                            $(this).find('p').html(storyObjects[bottomCounter].dek);
                            $(this).find('.latest-stories__date').html(storyObjects[bottomCounter].date);
                            $(this).find('.latest-stories__authour').html(storyObjects[bottomCounter].authour);
                            bottomCounter++;

                            if (bottomCounter >=50){
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
                            $(this).find('h4').html(storyObjects[topPrevCounter].hed + ' key ' + topPrevCounter);
                            $(this).find('p').html(storyObjects[topPrevCounter].dek);
                            $(this).find('.latest-stories__date').html(storyObjects[topPrevCounter].date);
                            $(this).find('.latest-stories__authour').html(storyObjects[topPrevCounter].authour);
                            topPrevCounter--;
                        }

                        if (bottomPrevCounter <= 0){
                            bottomPrevCounter = 49;
                        }

                        if (key == 1){
                            console.log('left click - ' + bottomPrevCounter);
                            $(this).find('a').attr('href', storyObjects[bottomPrevCounter].urlPath);
                            $(this).find('img').attr('src', storyObjects[bottomPrevCounter].image);
                            $(this).find('h4').html(storyObjects[bottomPrevCounter].hed + ' key ' + bottomPrevCounter);
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

        //==== COLLAPSING AUTHOR BIO
        var fullBio = $('.author-info__bio').html();
        function trimBio(){
        if ($(window).width() < 667){
            $('.author-more').show();
        
            var annotatedBio = fullBio.substr(0, 107) + "\u2026";
            $('.author-info__bio').html(annotatedBio);

                function collapseAuthourBox(){
                    $('.author-info').click(function(){
                      $('.author-more').toggleClass('up');
                        
                        if($('.author-more').hasClass('up')){
                            $('.author-info__bio').html(fullBio);  
                            $('.author-more').html('Less'); 
                        } else {
                            $('.author-info__bio').html(annotatedBio);
                            $('.author-more').html('More');
                        }

                    });
                }

                collapseAuthourBox()
            }
        }
        trimBio();


         $(window).resize(function() {
            if ($(window).width() < 667){
                trimBio();
            } else {
             $('.author-info__bio').html(fullBio);
             $('.author-more').hide();
            }
         });





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
