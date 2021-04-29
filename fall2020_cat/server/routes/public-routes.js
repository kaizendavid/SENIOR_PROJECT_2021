const express = require('express');
const router = express.Router();
const contactUsEmail = require('../utils/contactUsEmail');





/*This module is for enabling the user to be able to send an email to contact us.
* 
*/
router.post('/contactus', async (req, res, next) => {
    //test-res.send('This is the forgot password page route');

    //destructure the email from the request body
    const {email, subject, message} = req.body;
    
    //Webapp email
    const websiteEmail = "kaizendavid@gmx.com";

    try {


        //link to be sent for password reset inside the email
        const emailMessage = `
        <h3>Webapp Contact Us email</h3>
        <h3>Email: ${email}</h3>
        <h3>Subject: ${subject}</h3>
        <h3>Mesage:</h3>
        <p>${message}</>
        `


        //send the email with the html instructions above with sendEmail module
        const sendGridResponse = await contactUsEmail({
            from: email,
            to: websiteEmail,
            subject: subject,
            text: emailMessage
        });

        console.log("SendGrid response: " + sendGridResponse);

        //email was sent correct with 200 response
        res.status(200).send({
            success: true,
            message: "Your email message was sent. Thank you."
        })




    } catch (error) {

        //if an error was generated show it and then continue with server processes
        console.log("error: 500 internal error was generated. ERROR: " + error);

        //internal error happened with mongodb
        res.status(500).send({
            success: false,
            error: "contact us email was not sent. ERROR - " + error
        })


        next(error);
    }

});







module.exports = router;




