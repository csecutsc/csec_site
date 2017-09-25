$(document).ready(function() {
    // smooth scrolling
    $("a[href^='#']").on('click', function(e) {
        var hash = this.hash;
        $('html, body').animate({
            scrollTop: $(hash).offset().top - 50
        }, 1000, function() {
            window.location.hash = hash;
        });
        e.preventDefault();
    });
    // makeshift anti-spam function
    $('.email-link').hover(function() {
        var newHref = $(this).attr('href').replace('unhackable', 'mail.utoronto.ca');
        $(this).attr('href', newHref);
    });
    $('.email-link').hover(function() {
        var newHref = $(this).attr('href').replace('hidemelink', 'me');
        $(this).attr('href', newHref);
    });
    var contactForm = $("#contact-form");
    contactForm.submit(function() {
        event.preventDefault();
        var formDict = {};
        contactForm.serializeArray().map(function(curr) {
            formDict[curr.name] = curr.value;
        });
        console.log(formDict);
        if (formDict["g-recaptcha-response"].toString().trim() !== "") {
            $('#captcha-label').hide();
            $.ajax({
                type: "POST",
                url: "https://csec.club/mailer",
                data: JSON.stringify(formDict),
                success: function(data) {
                    console.log(data);
                    if (data) {
                        alertify.notify('Sent', 'success', 2);
                        contactForm.trigger("reset");
                    } else {
                        alertify.notify('Sent', 'failed', 2);
                    }
                },
                dataType: "json",
                contentType: "application/json"
            });

        } else {
            $('#captcha-label').show();
        }
    })

});