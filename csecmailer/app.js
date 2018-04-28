/**
 * @author Samiul Haque < github: ViperXYZ >
 */
var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var request = require('request');
var validator = require('validator');

var app = express();

var transporter = nodemailer.createTransport({
    service: process.env.email_service,
    auth: {
        user: process.env.server_email,
        pass: process.env.server_pass
    }
});
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/mailer', function (req, res) {
    res.send("Message Received");
});

app.post('/mailer', function (req, res) {
    var formData = req.body;
    console.log(formData);
    for (var curr in ["g-recaptcha-response", "Name", "Email", "Phone", "Message"]) {
        if (!(curr in formData) && ((typeof curr !== 'string'))) {
            res.json({"success": false});
        }
    }

    request.post({
        url: process.env.api_url, form: {
            secret: process.env.api_secret,
            response: formData["g-recaptcha-response"]
        }
    }, function (err, httpResponse, body) {
        if (JSON.parse(body)["success"] === true) {

            console.log(JSON.parse(body)["success"]);
            var name = formData["Name"], email = formData["Email"], phone = formData["Phone"],
                msg = formData["Message"];
            if (name && email && phone && msg && validator.isEmail(email)) {
                var mailOptions = {
                    from: email,
                    to: process.env.destination_email,
                    subject: name,
                    text: "Name: " + name + "\nEmail: " + email + "\nPhone: " + phone + "\nMessage:\n" + msg + "\n",
                    replyTo: email
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                res.json({"success": true});
            } else {
                res.json({"success": false});
            }
        }
    });
});


var server = app.listen(8081, function () {
    var port = server.address().port;
    console.log("CSEC Mailer at http://localhost:%s", port);
});
