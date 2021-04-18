const nodemailer = require('nodemailer');




/**This module is for sending an email to users. It is used in the "api/auth/resetpassword" API route in the 
 * auth.routes.js file. It can be used sending any email message but is used primarily for password reset.
 * 
 */
const sendEmail = (options) => {

    //get the email service provider and user and password used in the service from the "config.env" file
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    //the information to be emailed to a user
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.text,
    };

    //send the email 
    transporter.sendMail(mailOptions, function (error, info){
        if(error){
            console.log(error);
        } else {
            console.log(info);
        }
    });

};





module.exports = sendEmail;


