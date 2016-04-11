// Wrap IIFE around code
(function($){
    $(document).ready(function() {


   
//*======= DO NOT KILL THE DROPDOWNS WHEN USERS CLICK IN THEM
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
        }

//*======= MOVE FOCUS DIRECTLY TO SEARCH FIELD WHEN USER STARTS TYPING
        $('.search-block').on('show.bs.dropdown', function(event) {
            $(document).keydown(function(){
                $('input#menu__search--input').focus();
            });
        });

//*======= LATEST STORIES CODE =====*/

        //*======= REVERSE FUNCTION FOR ALLOWING STORIES TO GO BACKWARDS
        jQuery.fn.reverse = function() {
            return this.pushStack(this.get().reverse(), arguments);
        };

        //*=======  GLOBALS
        var visibleStories;
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




        function determineViewport(visibleStories){
            viewportSize = $(window).width();

            if(viewportSize > 1200){
                totalStoryPositions = 6;
            }

            if((viewportSize > 992 && viewportSize <1200)){
                totalStoryPositions = 4;
                i=1;
            }

            if((viewportSize > 768 && viewportSize < 992)){
                totalStoryPositions = 3;
            }
            return totalStoryPositions;
        }

        totalStoryPositions = determineViewport(visibleStories);

        console.log(totalStoryPositions);

        //*======= MAKE STORY OBJECTS GLOBAL, SO I DON'T HAVE TO KEEP HITTING THE API
        storyObjects = storyObjects;

        //*======= RETURNED STORIES FROM THE API
        function getLatestStories(){
            storiesRequested = 50;
            returnedStories = $.ajax({
                method: 'POST',
                url: 'http://api.thetyee.ca/v1/latest/' + storiesRequested,
                dataType: 'jsonp',
                data: response,
                crossDomain: true,
                success: function(response){
                    //console.log(response);
                    returnedStories = returnedStories.responseJSON.hits.hits;
                    //pass data to the create function so I can create my own story objects
                    recentItems = createStoryObjects(returnedStories);
                    
                    return recentItems;
                },
                error: function(){
                    //console.log('NO DICE SISTER');
                }
            });
        }//END LATESTSTORIES

        //*======= FUNCTION TO POPULATE THE DOM ELEMENTS BASED ON EVENTS
        // Parameter 'el' is the current element, parameter 'counterPosition' is whether we need top or bottom counter
        function storyData( el, counterPosition){
                counter = counterPosition;
                el.find('a').attr('href', storyObjects[counter].urlPath);
                el.find('img').attr('src', storyObjects[counter].image);
                el.find('h4').html(storyObjects[counter].hed);
                el.find('p').html(storyObjects[counter].dek);
                el.find('.latest-stories__date').html(storyObjects[counter].date);
                el.find('.latest-stories__authour').html(storyObjects[counter].authour); 
                counterPosition= counter;  
            }

        //*======= FORMAT RETURNED JSON FOR EASE OF MANIPULATION
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
            
            // on load, populate all spaces in the DOM
            $('.latest-stories__media-wrapper').each(function(key, index){
                $(this).parent().find('li').each(function(i, details){
                    if (key === 0){
                        //this populates the top scroller
                        storyData($(this), topCounter);
                        topCounter++; //separate counters let scroller move independently
                       
                        
                        //break out of the lis, depending on viewport size
                        if(i == (totalStoryPositions-1)){
                            return false;
                        }

                    }
                    if (key == 1){
                        //this populates the lower scroller
                        storyData($(this), bottomCounter);
                        bottomCounter++; //separate counters let scroller move independently
                        //break out of the lis, depending on viewport size
                        if(i == (totalStoryPositions - 1)){
                            return false;
                        }
                    }
                });
            });
            //Click events for scrolling
            scrollLatestStories();
        }

        //*======= MAKE AJAX CALL AND PUT DATA INTO RETURNEDSTORIES VAR FOR MANIPULATION
        getLatestStories();

        //*======= SETS UP CLICK EVENTS
        function scrollLatestStories(){
            //Get the next group of stories on click
            $('.latest-stories__media-wrapper').each(function(key, index){
                $(this).on('click', '.next', function(event){
                    $(this).parent().find('li').each(function(i, details){
                        console.log('i = ' + i + 'and totalStoryPositions = ' + totalStoryPositions);
                        if(i === totalStoryPositions){
                            return false;
                        }
                        if (topCounter >49){
                            topCounter = 0;
                        }
                        if (key === 0){
                            storyData($(this), topCounter);
                            topCounter++;
                            if (topCounter >49){
                                topCounter = 0;
                            }
                       
                        }

                        if(i === totalStoryPositions){
                            return false;
                        }
                        if (bottomCounter >49){
                            bottomCounter = 0;
                        }
                        if (key == 1){
                            storyData($(this), bottomCounter);
                            bottomCounter++;
                            if (bottomCounter >49){
                                bottomCounter = 0;
                            }
                        }

                        
                    });
                    //reset the counter so I can scroll the other way
                    topPrevCounter = topCounter - totalStoryPositions;
                    bottomPrevCounter = bottomCounter - totalStoryPositions;
                });

                console.log(topPrevCounter);

                //Get the prev group of stories on click
                $(this).on('click', '.prev', function(event){
                    $(this).parent().find('li').reverse().each(function(i, details){

                     
                        if (totalStoryPositions === 4){

                            if ((i === 0) || (i === 1)){
                                return;
                            }
                             if( i === totalStoryPositions + 2){
                                return false;
                             }
                         } else {


                             if( i === totalStoryPositions + 1){
                                return false;
                             }

                         }
                     console.log('i = ' + i + 'and totalStoryPositions = ' + totalStoryPositions);
                          //infinite backwards scroll
                        if (topPrevCounter < 0){
                            topPrevCounter = 49;
                        }

                     console.log('topprev' + topPrevCounter);
                 
                   

                        if (key === 0){
                            storyData($(this), topPrevCounter);
                            topPrevCounter--;
                        }

                      

                        if (bottomPrevCounter < 0){
                            bottomPrevCounter = 49;
                        }

                        if (key == 1){
                            storyData($(this), bottomPrevCounter);
                            bottomPrevCounter--;
                        }

                    });
                    //reset the counter so i can go the other way
                    topCounter = topPrevCounter + totalStoryPositions;
                    bottomCounter = bottomPrevCounter + totalStoryPositions;
                    //reset the counter for infinite scrolling

                });
            });

        }//END LATEST STORIES SCROLLER


//*======= END LATEST STORIES CODE

//*======= COLLAPSING AUTHOR BIO
        var fullBio = $('.author-info__bio').html();
        function trimBio(){
            if ($(window).width() < 670){
                $('.author-more').show();
                var annotatedBio = fullBio.substr(0, 107) + "\u2026";
                $('.author-info__bio').html(annotatedBio);

                function collapseAuthourBox(){
                    $(document).on('click','.author-more', function(){
                        event.preventDefault();
                        $('.author-more').toggleClass('up');

                        if($('.author-more').hasClass('up')){
                            $('.author-info__bio').html(fullBio);
                            $('.author-more').html('Show Less');
                        } else {
                            $('.author-info__bio').html(annotatedBio);
                            $('.author-more').html('Show More');
                        }

                    });
                }

                collapseAuthourBox();
            }
        }
        trimBio();


        $(window).resize(function() {
            if ($(window).width() < 670){
                trimBio();
            } else {
                $('.author-info__bio').html(fullBio);
                $('.author-more').hide();
            }
        });


//*======= SHOW DISQUS COMMENTS
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

})(jQuery);
