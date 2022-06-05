require("dotenv").config();
const express = require("express");
const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.route("/")
    .get((req, res) => {
        res.sendFile(__dirname + "/signup.html");
    })

    .post((req, res) => {
        const firstName = req.body.fName;
        const lastName = req.body.lName;
        const email = req.body.email;

        var data = {
            members: [
                {
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName,
                    },
                },
            ],
        };
        const jsonData = JSON.stringify(data);
        const url =
            "https://us13.api.mailchimp.com/3.0/lists/" + process.env.LIST_ID;
        const options = {
            method: "POST",
            auth: "woonmapao:" + process.env.API_KEY,
        };

        const request = https.request(url, options, (response) => {
            if (response.statusCode === 200) {
                //subscribed
                res.sendFile(__dirname + "/success.html");
            } else {
                //some error
            }
            response.on("data", function (data) {
                console.log(JSON.parse(data));
            });
        });

        request.write(jsonData);
        request.end();
    });

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.");
});
