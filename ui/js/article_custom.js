
//Do not kill the dropdowns when users click in them)
$('.dropdown-menu').children().click(function(e){
        e.stopPropagation();
 });

//LATEST STORIES

//Fire the API call on initial load
//latestStories();

//GLOBALS 
var storyPositions = '';
var totalStoryPositions='';
var counter = 0;
var i = 0;
var response;
var recentItems;
var returnedStories = new Array();

getLatestStories();

function getLatestStories(newUrl, callback){
	//Count how many stories are showing
	storyPositions = $('.menu_left-nav-wrap .latest-stories__media-wrapper li:hidden').length;
	//Return the max number of stories, to avoid multiple costly requests
	storiesRequested = 50;
	//API Call
	$.ajax({
		method: 'POST',
		url: 'http://api.thetyee.ca/v1/latest/' + storiesRequested,
		dataType: 'jsonp',
		data: response,
		crossDomain: true,
		success: function(response){
			var recentItems = response.hits.hits;
			//Loop through as many stories as there are available story positions
			$.each($('.menu_left-nav-wrap .latest-stories__media-wrapper li'), function(key, value){
				//Rename the API data for ease of manipulation
				//console.log(counter);
				var latestStory = recentItems[counter]._source;
				var latestStoryImage = latestStory.related_media[0].uri;
				var latestStoryImage = latestStoryImage.replace("thetyee.cachefly.net", "thetyee.ca");
				//Populate the markup
				$(value).find('img').attr('src', latestStoryImage);
				$(value).find('h4').removeClass('hed_preload_placeholder').html(latestStory.title);
				$(value).find('a').attr('href','http://thetyee.ca'+latestStory.path);
				$(value).find('p').removeClass('dek_preload_placeholder').html(latestStory.teaser);
				$(value).find('.latest-stories__date').html(latestStory.storyDate);
				$(value).find('.latest-stories__authour').html(latestStory.byline);
				//Increment the counter to move through the list
				counter++;
				if (counter >= 50){
					$(value).html('Message pushing user elsewhere');
					return false;
				}

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
	$('.menu_left-nav-wrap .latest-stories__media-wrapper').fadeOut('slow',function(){
	//Plug the markup back in for new stories
		$('.menu_left-nav-wrap .latest-stories__media-wrapper').html(temp).fadeIn('slow');
	});
	//Fire request for new stories
	getLatestStories();
	//Unbind the click handler so it'll work repeatedly
	$(this).off('click');
});