const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const {
  google
} = require("googleapis");

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_KEY,
  process.env.GOOGLE_SECRET_KEY,
  process.env.GOOGLE_DEVELOPERS_PLAYGROUND
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});
const accessToken2 = oauth2Client.getAccessToken();

const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER_EMAIL,
    clientId: process.env.GOOGLE_CLIENT_KEY,
    clientSecret: process.env.GOOGLE_SECRET_KEY,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    accessToken: accessToken2,
  },
});

module.exports = {
  sendEmail: (email, subject, message) => {
    const mailOptions = {
      from: process.env.GOOGLE_USER_EMAIL,
      to: process.env.MY_EMAIL_ADDRESS,
      subject: `${email} - ${subject}`,
      generateTextFromHTML: true,
      html: `${email} 
        ${message}`,
    };

    let data = [];
    smtpTransport.sendMail(mailOptions, (error, response) => {
      data.push(error ? error : response);
      console.log(error ? error : response);
      return data;
      smtpTransport.close();
    });
  },
  test: () => {
    return {
      success: "true",
      message: "Server is working!",
    };
  },
};