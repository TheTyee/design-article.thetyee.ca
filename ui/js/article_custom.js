
//Do not kill the dropdowns when users click in them)
$('.dropdown-menu').children().click(function(e){
        e.stopPropagation();
 });

//LATEST STORIES

//on load, call the api / getLatestStories();
//return 50 stories /getLatestStories()
//put them into a variable / createStoryObjects()
//use that variable to populate the dom / displayLatestStories







//GLOBALS 
var storyPositions = '';
var totalStoryPositions='';
var counter =0;
var topCounter = 0;
var bottomCounter = 0;

var i = 0;
var response;
var recentItems;
var returnedStories = new Array();
var storyObjects = new Array();

//this makes the Ajax call and puts everything into the returnedStories var for manipulation.
getLatestStories();

function getLatestStories(){
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
			recentItems = createStoryObjects(returnedStories);
		},
		error: function(){
			console.log('NO DICE SISTER');
		}
	});
}//end lateststories()


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
	displayLatestStories();
}
//make storyObjects global, so I don't have to keep hitting the API
storyObjects = storyObjects;

function displayLatestStories(){
//	console.log(storyObjects);

	$('.latest-stories__media-wrapper').each(function(key, value){
		if(key == 0){
	//	console.log(key);
		//Loop through latest stories spots and plug in the data
			$.each( $(this).find('li'), function(i, details){
				$(this).find('a').attr('href', storyObjects[topCounter].urlPath);
				$(this).find('img').attr('src', storyObjects[topCounter].image);
				$(this).find('h4').html(storyObjects[topCounter].hed);
				$(this).find('p').html(storyObjects[topCounter].dek);
				$(this).find('.latest-stories__date').html(storyObjects[topCounter].date);
				$(this).find('.latest-stories__authour').html(storyObjects[topCounter].authour);
				//keeps the counter from randomly skipping stories. Needs to be made dynamic based on screen width.
				if((topCounter>5) && (topCounter  % 6 == 0 )){
					return false;
					//counter = 0;
				}
				topCounter++;

			});
		} 

		if (key == 1){

			$.each( $(this).find('li'), function(i, details){
				$(this).find('a').attr('href', storyObjects[bottomCounter].urlPath);
				$(this).find('img').attr('src', storyObjects[bottomCounter].image);
				$(this).find('h4').html(storyObjects[bottomCounter].hed);
				$(this).find('p').html(storyObjects[bottomCounter].dek);
				$(this).find('.latest-stories__date').html(storyObjects[bottomCounter].date);
				$(this).find('.latest-stories__authour').html(storyObjects[bottomCounter].authour);
				//keeps the counter from randomly skipping stories. Needs to be made dynamic based on screen width.
				if((bottomCounter>5) && (bottomCounter  % 6 == 0 )){
					return false;
					//counter = 0;
				}
				bottomCounter++;

			});

		}
	});
}//displayStories


//CLICKING ANY CHEVRON MAKES THE TOP MOVE


//Get the next group of stories on click
$.each($('.latest-stories__media-wrapper'), function(top, bottom){

	$(this).on('click', '.next', function(event){
	
		console.log($(this));
		//Grab the markup for the stories and keep it in a variable for repopulation
		var temp = $('.menu_left-nav-wrap .latest-stories__media-wrapper').children();
		//Clear out last set of stories
		topCounter = topCounter+1;
		bottomCounter = bottomCounter+1;

		console.log(topCounter);
		if (topCounter % 49 == 0){    
	        topCounter = 0;
		};

		if (bottomCounter % 49 == 0){    
	        bottomCounter = 0;
		};


		//Fire request for new stories
		displayLatestStories();
		//createLatestStories(returnedStories);
		//Unbind the click handler so it'll work repeatedly
		$(this).off('click');
	
	});
});


