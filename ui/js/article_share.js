// Validation and submission of email to a friend form
var validator = $('form#share').validate({
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
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
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
$("form#share").submit(function(event) {
    event.preventDefault();
    $('#messages').html('');
    $('#errors').html('');
    var valid = validator.form(); 
    if ( valid === true ) {
        $("form#share").attr('disabled');
        getCurrentValues();
        var title = $('meta[property="og:title"]').attr("content");
        var summary = $('meta[property="og:description"]').attr("content");
        var image = $('meta[property="og:image"]').attr("content");
        var url = $('meta[property="og:url"]').attr("content");
        var shareAPI;
        var current_url = document.URL;
        if ( current_url.indexOf("preview.thetyee.ca") !== -1 ) {
            shareAPI = "http://preview.share.thetyee.ca/send.json?cb=?";
        } else {
            shareAPI = "http://share.thetyee.ca/send.json?cb=?";
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
            var result = data.result;
            $.each(result, function( index, value ) {
                $('#messages').append('<p class="alert alert-info">' + value + '</p>');
            });
            var errors = data.errors;
            $.each(errors, function( index, value ) {
                $('#errors').append('<p class="alert alert-danger">' + value + '</p>');
            });
            if ( data.result || data.errors ) {
                $("form#share").toggle();
                $("#showForm").toggle();
            }
        });
    }
});
function getCurrentValues () {
    email_to = $('textarea[name="email_to"]').prop("value");
    email_from = $('input[name="email_from"]').prop("value");
    message = $('textarea[name="message"]').prop("value");
    wc_sub_pref = $('input:checked[name="subscription"]').prop("value");
}
$('#showForm').click(
    function(event) {
        event.preventDefault();
        $("form#share").toggle();
        $('#showForm').toggle();
    }
);

