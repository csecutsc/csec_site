/**
 * @author K-M Samiul Haque <sammy.haque@mail.utoronto.ca>
 */
var express = require('express');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var request = require('request');
var validator = require('validator');
var jsonfile = require('jsonfile');
var app = express();
var file = '../../params.json';
var params = jsonfile.readFileSync(file);
var exec = require('child_process').exec;
var RateLimit = require('express-rate-limit');
var transporter = nodemailer.createTransport({
    service: params["email-service"],
    auth: {
        user: params["serverEmail"],
        pass: params["serverPass"]
    }
});
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
//rate limiter for api
var apiLimiter = new RateLimit({
    windowMs: 30 * 60 * 1000, // 30 min
    max: 10,
    delayMs: 0
});
app.get('/mailer', function (req, res) {
    res.send("Message Received");
});

app.post('/automate', apiLimiter, function (req, res) {
    reqJSON = req.body;
    if ("event" in reqJSON && "secret" in reqJSON) {
        if (reqJSON.secret === params["secret"] && reqJSON.event === params["events"]) {
            var child;
            var command = params["auto-path"];
            var msg = "";

            child = exec(command,
                function (error, stdout, stderr) {
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        msg += error;
                    }
                    msg += stdout;
                });

            res.json({"status": "success", "msg": msg});

        } else {
            res.json({"status": "failed", "msg": "credentials or event incorrect"});
        }
    } else {
        res.json({"status": "failed", "msg": "json format incorrect"});
    }
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
        url: params["apiURL"], form: {
            secret: params["apiSecret"],
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
                    to: params["destinationEmail"],
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
