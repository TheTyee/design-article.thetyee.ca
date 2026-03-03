// Updated Share Form JS (No JSONP)

$(document).ready(function () {

    var validator = $('form#share').validate({
        rules: {
            subscription: { required: true },
            email_to: { required: true, minlength: 5 },
            email_from: { required: true, email: true },
            message: { required: true, minlength: 25, maxlength: 1024 }
        }
    });

    $("form#share").submit(function (event) {
        event.preventDefault();

        $('#messages').html('');
        $('#errors').html('');

        if (!validator.form()) return;

        var title = $('meta[property="og:title"]').attr("content");
        var summary = $('meta[property="og:description"]').attr("content");
        var image = $('meta[property="og:image"]').attr("content");
        var url = $('meta[property="og:url"]').attr("content");

        var shareAPI;

        if (location.host.includes('preview')) {
            shareAPI = 'https://preview.share.thetyee.ca/send';
        } else if (location.host.includes('thetyee.ca')) {
            shareAPI = 'https://share.thetyee.ca/send';
        } else {
            shareAPI = 'http://127.0.0.1:5000/send';
        }

        $.ajax({
            url: shareAPI,
            method: "GET",
            dataType: "json",
            data: {
                url: url,
                title: title,
                summary: summary,
                img: image,
                message: $('#message').val(),
                email_to: $('#email_to').val(),
                email_from: $('#email_from').val(),
                wc_sub_pref: $('input[name="subscription"]:checked').val()
            },
            success: function (data) {
                console.log(data);

                $.each(data.result, function (i, value) {
                    $('#messages').append('<p class="alert alert-info">' + value + '</p>');
                });

                $.each(data.errors, function (i, value) {
                    $('#errors').append('<p class="alert alert-danger">' + value + '</p>');
                });

                if (data.result || data.errors) {
                    $("form#share").hide();
                    $("#showForm").show();
                }
            },
            error: function () {
                $('#errors').append('<p class="alert alert-danger">Request failed.</p>');
            }
        });
    });

    $('#showForm').click(function (event) {
        event.preventDefault();
        $("form#share").show();
        $('#showForm').hide();
    });

});
