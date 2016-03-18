
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
var storyObjects = new Array();

//this makes the Ajax call and puts everything into the returnedStories var for manipulation.
getLatestStories();



function getLatestStories(newUrl, callback){
	//Count how many stories are showing
//	storyPositions = $('.menu_left-nav-wrap .latest-stories__media-wrapper li:hidden').length;
	//Return the max number of stories, to avoid multiple costly requests
	storiesRequested =50;
	//API Call
	returnedStories = $.ajax({
		method: 'POST',
		url: 'http://api.thetyee.ca/v1/latest/' + storiesRequested,
		dataType: 'jsonp',
		data: response,
		crossDomain: true,
		success: function(response){
			returnedStories = returnedStories.responseJSON.hits.hits;
			recentItems = createLatestStories(returnedStories);
		},
		error: function(){
			console.log('NO DICE SISTER');
		}
	});
}//end lateststories()


function createLatestStories(returnedStories){
	
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
		Story.date = value._source.storyDate;
		Story.authour = value._source.byline;
		
		//Put all objects into a new array for easier handling
		storyObjects.push(Story);
		//console.log(storyObjects);

	});

	//Loop through latest stories spots and plug in the data
	$.each( $('.menu_left-nav-wrap .latest-stories__media-wrapper li'), function(i, details){

		console.log(storyObjects.length);
		console.log(counter + 'this is it');
		$(this).find('a').attr('href', storyObjects[counter].urlPath);
		$(this).find('img').attr('src', storyObjects[counter].image);
		$(this).find('h4').html(storyObjects[counter].hed);
		$(this).find('p').html(storyObjects[counter].dek);
		$(this).find('.latest-stories__date').html(storyObjects[counter].date);
		$(this).find('.latest-stories__authour').html(storyObjects[counter].authour);
		if((counter> 5) && (counter  % 6 == 0 )){
			return false;
		}
		counter++;
	});



}



//Get the next group of stories on click
$('.latest-stories__media-wrapper').on('click', '.next', function(event){
	
	//Grab the markup for the stories and keep it in a variable for repopulation
	var temp = $('.menu_left-nav-wrap .latest-stories__media-wrapper').children();
	//Clear out last set of stories
	counter = counter+1;
	//Fire request for new stories
	getLatestStories();
	//createLatestStories(returnedStories);
	//Unbind the click handler so it'll work repeatedly
	$(this).off('click');
});


