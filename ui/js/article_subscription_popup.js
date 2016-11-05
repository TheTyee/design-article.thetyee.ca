

jQuery(document).ready(function(){


var queryString = window.location.href;
queryString = URI.parse(queryString); 
queryString = queryString.query;

queryObject = URI.parseQuery(queryString);




// If they are, set the subscriber cookie
if ( queryObject.utm_medium === 'email' ) {
    Cookies.set("user_is_a_subscriber", "true", { expires: 365/*, domain: '.thetyee.ca'*/ });
}

// Now let's check the various opt-out values
var userIsaSubscriber       = Cookies.get("user_is_a_subscriber") || false;
var userShownSubOfferOnDate = Cookies.get("user_last_sub_offer_date") || 0;
var userDoesntWantSubOffer  = Cookies.get("user_doesnt_want_sub_offer") || false;
var now = Date.now();
// Figure out how much time has elapsed
var elapsed = now - userShownSubOfferOnDate;
// Has the visitor opted out?
if ( userDoesntWantSubOffer === false  ) {
    // Are they already a subscriber?
    if ( userIsaSubscriber === false ) {
        // Has enough time passed?
        if ( elapsed > 604800000) { // only show if 7 days (604800000 miliseconds) have passed 
            // Then... Fire the popup (immediately for now) 
            window.setTimeout(showPopup, 0);
        } else {
            // Not enough time has passed! ;)
            // console.log('7 days has not yet passed!')
        }
    }
}


function showPopup() {
    // Update the visitor's cookie with the last offer date
    Cookies.set("user_last_sub_offer_date", now, { expires: 365/*, domain: '.thetyee.ca'*/ });
    // Pop the modal!
    jQuery('#modalSub').modal('show');
    // Handle opt-out
    jQuery("#modalSubNoMore").click(function(event){  // Catch the don't show click
        event.preventDefault();
        // Set the don't show again cookie
        Cookies.set("user_doesnt_want_sub_offer", "true", { expires: 365/*, domain: '.thetyee.ca'*/ });
        // Close the modal
        jQuery('#modalSub').modal('hide');
    });
    // Make radio buttons work like checkboxes
    jQuery('.ntnl-sgnup-modal label.checkbox').each(function(){
        var lid = $(this).attr("id");
        jQuery(this).click(function(evt){
            var presentationDiv = jQuery(this).children('.form-checkbox');
           evt.stopPropagation();
        evt.preventDefault();
       // console.log("#" + lid + " .tog");
        
        var inPut  = $("#" + lid + " input");
        var checkBox = $(this).children(".form-checkbox");
        $(checkBox).toggleClass("checked");
        var newVal;
        if ( $(inPut).attr("value") < 1 ) {
            newVal = 1;
        } else {
            newVal = 0
        }
        
        $(inPut).attr("value", newVal);
        
        
        console.log($(inPut).attr("value"));
//       $(checkBoxes.prop("checked", !checkBoxes.prop("checked"));
//            $(checkboxes).prop("checked");
 

            
        });
    });
    // Handle subscription
    jQuery( "#modal-sub-form" ).submit(function( event ) {
        event.preventDefault();
        var email = jQuery('#InputEmail1').val();
        var data = jQuery( "#modal-sub-form").serialize();
        console.log(data);
        var url = "https://webhooks.thetyee.ca/subscribe/";
        jQuery.post( url , data )
        .done(function(data) {
            // Set UserIsaSubscriber cookie to prevent further sub offers
            Cookies.set("user_is_a_subscriber", "true", { expires: 365/*, domain: '.thetyee.ca'*/ });
            var content = '<div class="alert alert-success" role="alert">' +
                'Thank you for subscribing! Now you\'re on the list.' + 
                '<br />You can expect your Tyee email edition to arrive soon...' +
                '</div>';
            jQuery( "#modalSub .modal-body" ).empty().append( content );
            window.setTimeout(hideModal, 4000 );
        })
        .fail(function(data){
            console.log('failed...');
            var content = '<div class="alert alert-danger" role="alert">' +
                'Something went terribly wrong! :-(' + 
                '<br />' +
                'To subscribe manually, <a href="http://subscribe.thetyee.ca" target="_blank">click here</a>' +
                '</div>';
            jQuery( "#modalSub .modal-body" ).empty().append( content );
        }); 
    });
}
function hideModal() {
    jQuery('#modalSub').modal('hide')
}



});

