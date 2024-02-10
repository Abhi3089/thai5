const mailController = require("express").Router();
const nodemailer = require("nodemailer");

mailController.post("/sendmail",async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'juindiaservices@gmail.com',
              pass: 'Juindia@2022'
            }
          });
          
          const mailOptions = {
            from: 'juindiaservices@gmail.com',
            to: 'juindiaservices@gmail.com',
            subject: 'Sending Email using Node.js',
            text: 'That was easy!'
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        return res.status(200).json("File uploded successfully");
    } catch (error) {
        console.error(error);
    }
});

module.exports = mailController

