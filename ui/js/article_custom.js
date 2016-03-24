
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
var totalStoryPositions;
var counter =0;
var topCounter = 0;
var bottomCounter = 0;
var response;
var recentItems;
var returnedStories = new Array();
var storyObjects = new Array();



//make storyObjects global, so I don't have to keep hitting the API
storyObjects = storyObjects;

//check the DOM to see how many stories we need to show
totalStoryPositions = countStoryPositions();



//returns the number of lis to be populated
function countStoryPositions(){
	$('.latest-stories__media-wrapper').each(function( key, value){
		totalStoryPositions = $(this).children(':visible').length;
		return totalStoryPositions;
	});
}


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
			return recentItems
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

				if (key == 0){

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
			console.log($(this).find('li'));
			
			$(this).parent().find('li').each(function(i, details){

				if (key == 0){

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

			$(this).off('click');
	
	});


});


}




//page loads with first stories, 0-6

//on click, take the last number of stories (6) and add one to pull the next 6 stories.

//if 50 stories have loaded, loop back to start


