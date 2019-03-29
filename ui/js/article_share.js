// Validation and submission of email to a friend form
var validator = jQuery('form#share').validate({
    errorPlacement: function(error, element) {
        if (element.attr("name") == "subscription" ) {
            error.insertAfter("#radio-error");
        } else {
            error.insertAfter(element);
        }
    },
    rules: {
        subscription: {
            required: true
        },
        email_to: { 
            required: true,
            minlength: 5
        },
        email_from: {
            required: true,
            email: true
        },
        message: {
            required: true,
            minlength: 25,
            maxlength: 1024
        }
    },
    messages: {
        email_from: {
            required: "We need your email address to send the article on your behalf.",
        },
        email_to: {
            required: "We can't send the article unless you tell us who to send it to!"
        },
        message: {
            required: "Please provide a bit of context so the person receiving understands why you sent it.",
            minlength: "If you only write a few words here, we have no way of knowing you're not an evil robot using this tool to spam innocent people. Would you mind adding a bit more to your message so we know you're not?",
            maxlength: "Are you writing an essay, or forwarding an article? C'mon!"

        },
        subscription: {
            required: "Please select one of the subscription options."
        }
    },
    highlight: function(element) {
        jQuery(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    },
    success: function(element) {
        element
        .text('Looking good.').addClass('valid')
        .closest('.form-group').removeClass('has-error').addClass('has-success');
    }
});                  
var email_to;
var email_from;
var message;
var wc_sub_pref;
jQuery("form#share").submit(function(event) {
    event.preventDefault();
    jQuery('#messages').html('');
    jQuery('#errors').html('');
    var valid = validator.form(); 
    if ( valid === true ) {
        jQuery("form#share").attr('disabled');
        getCurrentValues();
        var title = jQuery('meta[property="og:title"]').attr("content");
        var summary = jQuery('meta[property="og:description"]').attr("content");
        var image = jQuery('meta[property="og:image"]').attr("content");
        var url = jQuery('meta[property="og:url"]').attr("content");
        var shareAPI;

        if ( location.host === 'thetyee.ca' || location.host === 'www.thetyee.ca') {
            shareAPI = 'https://share.thetyee.ca/send.json?cb=?"';
        } else if ( location.host === 'preview.thetyee.ca' ) {
            shareAPI = 'https://preview.share.thetyee.ca/send.json?cb=?';
        } else {
            shareAPI = 'http://127.0.0.1:5000/send.json?cb=?';
        }

        $.getJSON( shareAPI, {
            format: "jsonp",
            url: url,
            title: title,
            summary: summary,
            img:   image,
            message: message,
            email_to: email_to,
            email_from: email_from,
            wc_sub_pref: wc_sub_pref
        }, function( data ) { 
		console.log(data);
            window.result = data.result;
            $.each(result, function( index, value ) {
                jQuery('#messages').append('<p class="alert alert-info">' + value + '</p>');
            });
            var errors = data.errors;
            $.each(errors, function( index, value ) {
                jQuery('#errors').append('<p class="alert alert-danger">' + value + '</p>');
            });
            if ( data.result || data.errors ) {
                jQuery("form#share").toggle();
                jQuery("#showForm").toggle();
            }
        });
    }
});
function getCurrentValues () {
    email_to = jQuery('textarea[name="email_to"]').prop("value");
    email_from = jQuery('input[name="email_from"]').prop("value");
    message = jQuery('textarea[name="message"]').prop("value");
    wc_sub_pref = jQuery('input:checked[name="subscription"]').prop("value");
}
jQuery('#showForm').click(
    function(event) {
        event.preventDefault();
        jQuery("form#share").toggle();
        jQuery('#showForm').toggle();
    }
);

