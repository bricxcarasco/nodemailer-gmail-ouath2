const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

app.get("/", (req, res) => {
    return res.status(200).send({
        success: "true",
        message: "Server is working!",
    });
});

app.post("/api/email/send", (req, res) => {
    let errors = {};
    if (!req.body.email || !req.body.subject || !req.body.message) {
        errors["success"] = "false";
        errors["message"] = "Make sure fields are not empty!";
    }

    if (!validateEmail(req.body.email)) {
        errors["success"] = "false";
        errors["message"] = "Invalid email address!";
    }

    if (errors.success) return res.status(400).send(errors);

    return res.status(200).send({
        success: "true",
        message: "Email successfully sent!",
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});