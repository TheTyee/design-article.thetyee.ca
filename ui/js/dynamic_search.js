function renderLead(unit){

   var target = jQuery(".index-page__featured-story.dummy");
   jQuery(".index-page__featured-story.dummy .mainimage").attr("href", unit.uri);

if (unit.related_media && unit.related_media[0]) {   
   var thumbImg;
            thumbImg = unit.related_media[0].uri.replace("http://thetyee.cachefly.net", "//thetyee.ca");

for (var k in unit.related_media[0].thumbnails) {   
        var thumb = unit.related_media[0].thumbnails[k];
        if (thumb.uri.indexOf("page_thumb") !=-1) {
          //  console.log("found 960: "  +thumb.uri);
            thumbImg = thumb.uri.replace("http://thetyee.cachefly.net", "//thetyee.ca");
        } else {
        }
                       
    
}

 thumbImg = thumbImg.replace("http://", "//");


   
      jQuery(".index-page__featured-story.dummy .mainimage img").attr("src", thumbImg.replace("thetyee.cachefly.net", "thetyee.ca"));
          } else {
jQuery(".index-page__featured-story.dummy .mainimage img").remove(); // remove if there is no image to replace there
}          
            jQuery(".index-page__featured-story.dummy .story-item__description a").attr("href", unit.uri);
            jQuery(".index-page__featured-story.dummy .story-item__description a").text(unit.title);
            jQuery(".index-page__featured-story.dummy .story-item--deck").text(unit.teaser);
            jQuery(".index-page__featured-story.dummy .story-item__author").text(unit.byline);
            formattedDate = moment.utc(unit.storyDate).format("DD MMM");
            jQuery(".index-page__featured-story.dummy .story-item__date").text(formattedDate);
               jQuery(".index-page__featured-story.dummy .badge--story-item-placement a").attr("href", unit.series);
            if ( unit.series.indexOf('not set') >= 0 ) {
                jQuery(".index-page__featured-story.dummy .badge--story-item-placement").remove();
            } else if ( unit.series.indexOf('Balance') >= 0 ) {
                jQuery(".index-page__featured-story.dummy .badge--story-item-placement a img").attr("src", "/ui/img/badge-election.svg");
            }
            jQuery(target).show();
}

function renderRegular(unit){
    var text = '<div class="col-xs-12 col-sm-6 col-md-4">';
       text += '<!-- BEGIN 01-molecules/blocks/story-item -->';
text += '<div class="story-item story-item--index-page index-list-spacing" data-dev-object-descrip="01-molecules/blocks/story-item" data-dev-status="IN-PROGRESS">';
  
            if ( unit.series.indexOf("not set") >= 0 ) {
                
            } else {
                 text += '<!-- 00-atoms/images/story-badge -->';
                text += '<a href="' + unit.series +'" class="series-badge badge--story-item-placement">';
                if ( unit.series.indexOf('Balance') >= 0 ) {
                text += '<img src="/ui/img/badge-election.svg"></a>';
                } else {
                text += '<img src="/ui/img/badge-series.svg"></a>';
                }
            }

if (unit.related_media && unit.related_media[0]) {
text += '<a href="' + unit.uri + '"><!-- 00-atoms/images/image -->';
var thumbImg;
            thumbImg = unit.related_media[0].uri.replace("http://thetyee.cachefly.net", "//thetyee.ca");
for (var k in unit.related_media[0].thumbnails) {   
        var thumb = unit.related_media[0].thumbnails[k];
        if (thumb.uri.indexOf("newcover") !=-1) {
          ///  console.log("found newcover: "  +thumb.uri);
            thumbImg = thumb.uri.replace("http://thetyee.cachefly.net", "//thetyee.ca");
        } else {
        }
                       
    
}
 thumbImg = thumbImg.replace("http://", "//");

text += '<img src="' + thumbImg + '" class="responsive-img" alt="image atom">';
text += '</a>';
} // end if there is an image
text +='<div class="story-item__description">';
text +=	'<h5><a href="' + unit.uri + ' ">' + unit.title + '</a></h5>';  
text +=	'<p class="story-item--deck">' + unit.teaser + '</p>';
text +=	'<span class="story-item__author">' + unit.byline +'&ensp;</span>';
text +=	'<span class="story-item__date">' + moment.utc(unit.storyDate).format("DD MMM") + '</span>';
text +=	'</div>';
text += '</div>';
text += '<!-- END 01-molecules/blocks/story-item -->';
text += '</div>';

return text;
}

function renderRow(num){
    var i = 0;
    while (i < num) {


    var text = '<div class="row" id="storyrow' + rowCount +'" >';
    if (UnitObjects.length > 0) {
    text += renderRegular(UnitObjects.shift());
    }
    if (UnitObjects.length > 0) {
    text += renderRegular(UnitObjects.shift());
    }
    
    if (rowCount == 0) {
   // console.log("rowcount < 1 :");
    text += '<div class="col-xs-12 col-md-4"><div id="subscribefill" class="messaging-zone index-list-spacing"></div></div>';
    $.get( "/design-article.thetyee.ca/_includes/01-molecules/blocks/messaging-block--subscribe.html", function( data ) {
    jQuery("#subscribefill").html(data);
    enableEmailSubscription();
}, "html");
  
    
    }
    
    if (rowCount == 3) {
               
        text += '</div><div class="row"><div class="col-xs-12 col-md-8" id="joinadfill"></div></div><div class="blank">';
        $.get( "/inc/joinad/include.php", function( data ) {
         jQuery("#joinadfill").html(data);
    }, "html");

    }
     if (rowCount == 2) {
        
    text += '<div class="col-xs-12 col-md-4" id="adfilltop">';
    text += '<aside class="ad-box ad-box--bigbox" data-dev-object-descrip="01-molecules/blocks/ad-box" data-dev-status="IN-PROGRESS">';
    text += '<div class="advertisement" id="ad-bigbox" style="text-align:center">';
    text += '</div>';
    text +='</aside>            </div>';
                
     }
     
          if (rowCount == 4) {
        
    text += '<div class="col-xs-12 col-md-4" id="adfilltop">';
    text += '<aside class="ad-box ad-box--bigbox" data-dev-object-descrip="01-molecules/blocks/ad-box" data-dev-status="IN-PROGRESS">';
    text += '<div class="advertisement" id="ad-bigboxlower" style="text-align:center">';
    text += '</div>';
    text +='</aside>            </div>';
                
     }
    
         if (rowCount == 5) {
            
            
        jQuery("#presentsfill").appendTo(".filler");
            
            
         }
     
         text += '</div>';
    rowCount++;
 //   console.log("rowCount is " + rowCount);
   jQuery(".index-page__story-list .filler").append(text);

        i++;
    }
    
}

        //Stories by Topic (THANKS SALLY, TOTALLY PILFERED YOUR LATEST STORIES CODE --BC)
   

        //Returned stories from the API
        function getUnitStories(number, start, render){
            var ajaxSuccess;
            var inPreview = ''; var ess = 's';
            if (window.location.hostname.indexOf("preview") >= 0) {inPreview = "preview."; ess = '';}
            
            
            storiesRequested = number;
            returnedStories = jQuery.ajax({
                method: 'POST',
                url: 'http' + ess + '://' + inPreview + 'api.thetyee.ca/v1/searchme/' + query + '/' + storiesRequested + '/' + start,
                dataType: 'jsonp',
                data: response,
                crossDomain: true,
                success: function(response){
                    returnedStories = returnedStories.responseJSON.hits.hits;
                    //pass data to the create function so I can create my own Unit objects
                    recentItems = createUnitObjects(returnedStories);
                    ajaxSuccess = 1;
                   // console.log("ajaxsucces shouldbe true: " + ajaxSuccess);
                    if (ajaxSuccess > 0) {  
                          //  console.log("ajaxsuccess");
                            var halfnumber = number/2;
                            if (render > 0) {
                               // console.log("render=true");
                                renderRow(halfnumber);
                            }
                    }
  console.log("search url : " +url);

                    return recentItems;

                },
                error: function(){
                    console.log("error: " + 'https://api.thetyee.ca/v1/topic/' + topic + '/' + storiesRequested + '/1' + response);
                }
            });
            
            
            
        }//end lateststories()

        //Format the json data for ease of manipulation
        function createUnitObjects(returnedStories, callback){
            //remove the placeholder classes
            jQuery('.latest-stories__hed').removeClass('hed_preload_placeholder');
            jQuery('.latest-stories__dek').removeClass('dek_preload_placeholder');

            //API data, to feed into an array of custom Unit objects
            recentItems = returnedStories;

            //for each item from the API, plug info into a Unit object
	            jQuery.each(recentItems, function(key, value){
		if (value._source.related_media && value._source.related_media[0]) {

                latestUnitImage = value._source.related_media[0].uri;
		} else {
		  latestUnitImage = "/ui/img/Blank.JPG";
		}


                //Format the API img uri's so they don't point at cachefly

                //Use moment.js to format the date
                formattedDate = moment.utc(value._source.UnitDate).format("DD MMM");

                //Set default values for the Unit object
                // none fo the Unit stuff being used
                var Unit = {
                    urlPath : 'link',
                    hed : 'title',
                    image : 'image',
                    dek : 'test',
                    date : 'date',
                    authour : 'authour'
                };

                //Populate Unit objects with API data
                Unit.urlPath = value._source.path;
                Unit.hed = value._source.title;
                Unit.image = latestUnitImage;
                Unit.dek = value._source.teaser;
                Unit.date = formattedDate;
                Unit.authour = value._source.byline;


                //Put all objects into a new array for easier handling
               // console.log(value._source);
                UnitObjects.push(value._source);
                // console.log("Done unit");
            });
  
         
        }

 //GLOBALS
  var UnitObjects = [];
  var topic;
  var rowCount = 0;
       var totalUnitPositions;
        var counter =0;
        var topCounter = 0;
        var bottomCounter = 0;
        var response;
        var recentItems;
        var returnedStories = [];
         var firstUnit;
        var topPrevCounter = 0;
        var bottomPrevCounter = 0;

        //Make Ajax call and put data into the returnedStories var for manipulation.
       $(window).ready(function(){
       
        jQuery.fn.reverse = function() {
            return this.pushStack(this.get().reverse(), arguments);
        };

       
topic = jQuery("#topictitle").text();
    // console.log("topic title: " + topic);
    topic = encodeURI(topic);
        
   
    
       

        //make UnitObjects global, so I don't have to keep hitting the API
        UnitObjects = UnitObjects;
                getUnitStories(17,0);
        });
       
       var storiesLoaded = 18;
        $(window).load(function(){
            
            $(".btn--load-more").click(function(){
                getUnitStories(6,storiesLoaded, "1");
                storiesLoaded = storiesLoaded+6;
               
                
                
            });
            
            if (UnitObjects[0].related_media && UnitObjects[0].related_media[0]) {
            renderLead(UnitObjects.shift());
		}
            renderRow(8);
            
        });
        
        
