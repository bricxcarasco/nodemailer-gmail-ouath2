const PORT = process.env.PORT || 5000;
const express = require("express");
const bodyParser = require("body-parser");

const mailer = require("./mailer");

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const validateEmail = (email) => {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

app.get("/", (req, res) => {
  return res.status(200).send(mailer.test());
});

app.post("/api/email", (req, res) => {
  let { email, subject, message } = req.body;
  let errors = {};
  if (!email || !subject || !message) {
    errors["success"] = "false";
    errors["message"] = "Make sure fields are not empty!";
  }

  if (!validateEmail(email)) {
    errors["success"] = "false";
    errors["message"] = "Invalid email address!";
  }

  if (errors.success) return res.status(400).send(errors);

  let send_email = mailer.sendEmail(email, subject, message);

  return res.status(200).send({
    success: true,
    message: "Message successfully sent!",
  });
});

app.listen(PORT);
