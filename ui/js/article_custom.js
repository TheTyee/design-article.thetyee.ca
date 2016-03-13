
//Do not kill the dropdowns when users click in them)
$('.dropdown-menu').children().click(function(e){
        e.stopPropagation();
 });

//LATEST STORIES

//Fire the API call on initial load
latestStories();

//GLOBALS 
var storyPositions = '';
var totalStoryPositions='';
var counter = 0;


function latestStories(){
	//Count how many stories are showing
	storyPositions = $('.menu_left-nav-wrap .latest-stories__media-wrapper li:hidden').length;
	//Return the max number of stories, to avoid multiple costly requests
	storiesRequested = 50;
	//API Call
	$.ajax({
		method: 'POST',
		url: 'http://api.thetyee.ca/v1/latest/' + storiesRequested,
		dataType: 'jsonp',
		crossDomain: true,
		success: function(d){
			var recentItems = d.hits.hits;
			
			//Loop through as many stories as there are available story positions
			$.each($('.menu_left-nav-wrap .latest-stories__media-wrapper li'), function(key, value){
				//Rename the API data for ease of manipulation
				var latestStory = recentItems[counter]._source;
				var latestStoryImage = latestStory.related_media[0].uri;
				var latestStoryImage = latestStoryImage.replace("thetyee.cachefly.net", "thetyee.ca");
				//Populate the markup
				$(value).find('img').attr('src', latestStoryImage);
				$(value).find('h4').html(latestStory.title);
				$(value).find('a').attr('href','http://thetyee.ca'+latestStory.path);
				$(value).find('p').html(latestStory.teaser);
				$(value).find('.latest-stories__date').html(latestStory.storyDate);
				$(value).find('.latest-stories__authour').html(latestStory.byline);
				//Increment the counter to move through the list
				counter++;
				//Increment by the number of story positions, to make sure the same stories don't show over and over again
				totalStoryPositions = totalStoryPositions + storyPositions;
			});
		},
		error: function(){
			console.log('NO DICE SISTER');
		}
	});
}//end lateststories()


//Get the next group of stories on click
$('.latest-stories__media-wrapper').on('click', '.chevron', function(event){
	
	//Grab the markup for the stories and keep it in a variable for repopulation
	var temp = $('.menu_left-nav-wrap .latest-stories__media-wrapper').children();
	//Clear out last set of stories
	$('.menu_left-nav-wrap .latest-stories__media-wrapper').empty();
	//Plug the markup back in for new stories
	$('.menu_left-nav-wrap .latest-stories__media-wrapper').html(temp);
	//Fire request for new stories
	latestStories();
	//Unbind the click handler so it'll work repeatedly
	$(this).off('click');
});