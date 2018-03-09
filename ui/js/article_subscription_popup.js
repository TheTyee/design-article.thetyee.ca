        !function(a){var b=/iPhone/i,c=/iPod/i,d=/iPad/i,e=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,f=/Android/i,g=/(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,h=/(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,i=/IEMobile/i,j=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,k=/BlackBerry/i,l=/BB10/i,m=/Opera Mini/i,n=/(CriOS|Chrome)(?=.*\bMobile\b)/i,o=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,p=new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i"),q=function(a,b){return a.test(b)},r=function(a){var r=a||navigator.userAgent,s=r.split("[FBAN");return"undefined"!=typeof s[1]&&(r=s[0]),s=r.split("Twitter"),"undefined"!=typeof s[1]&&(r=s[0]),this.apple={phone:q(b,r),ipod:q(c,r),tablet:!q(b,r)&&q(d,r),device:q(b,r)||q(c,r)||q(d,r)},this.amazon={phone:q(g,r),tablet:!q(g,r)&&q(h,r),device:q(g,r)||q(h,r)},this.android={phone:q(g,r)||q(e,r),tablet:!q(g,r)&&!q(e,r)&&(q(h,r)||q(f,r)),device:q(g,r)||q(h,r)||q(e,r)||q(f,r)},this.windows={phone:q(i,r),tablet:q(j,r),device:q(i,r)||q(j,r)},this.other={blackberry:q(k,r),blackberry10:q(l,r),opera:q(m,r),firefox:q(o,r),chrome:q(n,r),device:q(k,r)||q(l,r)||q(m,r)||q(o,r)||q(n,r)},this.seven_inch=q(p,r),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window?this:void 0},s=function(){var a=new r;return a.Class=r,a};"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=r:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?module.exports=s():"function"==typeof define&&define.amd?define("isMobile",[],a.isMobile=s()):a.isMobile=s()}(this);


jQuery(document).ready(function(){


if (isMobile.apple.phone || isMobile.android.phone || isMobile.seven_inch) {
    // do nothing
} else {

var queryString = window.location.href;
queryString = URI.parse(queryString); 
queryString = queryString.query;
queryObject = URI.parseQuery(queryString);


var proxyAPI;
if ( location.host === 'thetyee.ca' || location.host === 'www.thetyee.ca') {
    proxyAPI = 'https://webhooks.thetyee.ca/subscribe/';
} else if ( location.host === 'preview.thetyee.ca' ) {
    proxyAPI = 'https://preview.webhooks.thetyee.ca/subscribe/';
} else {
    proxyAPI = 'http://127.0.0.1:3000';
}

// If they are coming from an email, set the subscriber cookie
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
        var checkBox = $("#" + lid + " .form-checkbox");
        $(checkBox).toggleClass("checked");
        var newVal;
        if ( $(inPut).attr("value") < 1 ) {
            newVal = 1;
        } else {
            newVal = 0
        }
        
        $(inPut).attr("value", newVal);
        
        // console.log($(inPut).attr("value"));
        // $(checkBoxes.prop("checked", !checkBoxes.prop("checked"));
        // $(checkboxes).prop("checked");

            
        });
    });
    // Handle subscription
    jQuery( "#modal-sub-form" ).submit(function( event ) {
        event.preventDefault();
        var email = jQuery('#InputEmail1').val();
        var data = jQuery( "#modal-sub-form").serialize();
       // console.log(data);
        //var url = "https://webhooks.thetyee.ca/subscribe/";
        jQuery.post( proxyAPI, data )
        .done(function(data, status, jqXHR) {
            // Get the success message back from the subscribe service
            var successJSON   = jqXHR.responseJSON;
            var successHtml = successJSON.html;
            // Set UserIsaSubscriber cookie to prevent further sub offers
            Cookies.set("user_is_a_subscriber", "true", { expires: 365/*, domain: '.thetyee.ca'*/ });
            // Show the message to the user
            var content = '<div class="alert alert-success" role="alert">' +
                successHtml + 
                '</div>';
            jQuery( "#modalSub .modal-body" ).empty().append( content );
            window.setTimeout(hideModal, 6000 );
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            var errorJSON   = jqXHR.responseJSON;
            var errorString = errorJSON.text;
            var content = '<div class="alert alert-danger" role="alert">' +
                errorString + 
                '</div>';
            jQuery( "#modalSub .modal-body" ).empty().append( content );
        }); 
    });
}
function hideModal() {
    jQuery('#modalSub').modal('hide')
}

}

});

