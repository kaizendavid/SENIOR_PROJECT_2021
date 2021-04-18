const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const OrganizationPaid = require('../models/OrganizationsPaid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
//const { find } = require('../models/Users');






/**This module is used to route incoming requests from a client to the API endpoints. The requests here
 * are requests for AUTHORIZATION. These endpoints are for REGISTER, LOGIN, FORGET PASSWORD, and RESET PASSWORD.
 * All or any "http://www.hostingsite.com/api/auth/*" will be routed here and handled by the appropriate
 * type of request. The requests are POST and PUT.
 * 
 */


//used to create a random  COMPANY CODE LICENSE NUMBER for users of a company to be able to register without credit card
 const randomLicenseIdNumber = (length = 8) => {
    return Math.random().toString(36).substr(2, length);
};


/* POST - The following block of code is used to REGISTER a new user into=========================================
the mongo database and also hashes the password entered
*/ 
router.post('/register', async (req, res, next) => {
    //test-res.send('This is the register page route');
    let validCreditCard;
    let validLicenseIdNumber;
    let customerStripeId;

    let savedUser;
    let savedOrg;

    //destructure request body into variables username, email, password
    const { username, 
            email,
            password,

            firstName,
            middleName,
            lastName,
            address,
            city,
            states,
            zipcode,
            month,
            day,
            year,
            gender,
            phone,

            accountType,
            licensetotal,
            billingAmount,
            role,
            isSinglePerson,
            
            orgName,
            orgAddress,
            orgCity,
            orgStates,
            orgZipcode,
            orgPhone,
            
            registeredOrgName,
            licenseIdNumber,
            usingCreditCard,
        
        } = req.body;

        //test-console.log(req.body);




    try{
        //check if group company license number is valid for registration or process credit card payment

        if(!usingCreditCard){  
            //company code number - check if it exists and increment total used 
        
            //CHECK TO SEE IF THE ORGANIZATION AND LICENSE ID NUMBER EXISTS
            findOrgAndLicense = await OrganizationPaid.findOne({'organizationName': registeredOrgName});//.select("licenseIdNumber");
        
        
            //make sure the license Id matches the one the organization was given AND also make sure the total licenses are not used up
            if((findOrgAndLicense.licenseIdNumber == licenseIdNumber) && (findOrgAndLicense.licenseTotal != findOrgAndLicense.licenseUsed)){
                
                //increment the number of licenses used up by the organization purchased
                const incrementLicenseIdNumber = findOrgAndLicense.licenseUsed + 1;
                
                //test-console.log("increment lic num: " + incrementLicenseIdNumber + "_id num: " + findOrgAndLicense._id);

                //update the document to reflect the newly used id number by incrementing the licenseUsed key field
                let doc = OrganizationPaid.findByIdAndUpdate({"_id": findOrgAndLicense._id}, {"licenseUsed": incrementLicenseIdNumber}, {new: true}, (error, data) => {
                    //Callback used for testing purpses
                    if(error){
                        console.log(error);
                    }
                    if(data){
                        console.log("mongodb data that has been modified: ");
                        //console.log(data);
                    }
                });

                //test-console.log("updated doc: " + doc);

                validLicenseIdNumber = true;

            }
                
                //NOT a VALID LICENSE NUMBER so return a 404 status with message
            if(!validLicenseIdNumber){
    
                return res.status(404).json({
                    success: false,
                    error: "The license Id number is not valid"
                })
            }   


             
        }else if(usingCreditCard){
            //if credit card use stripe API to process the credit card payment or
            const { stripeId } = req.body;
            const idempotencyKey = uuidv4();

            //create the credit card paying customer on stripe
            const customer = await stripe.customers.create({
                email: email,
                name: firstName + " " + middleName + " " + lastName,
                phone: phone,
                description: "Workplace Violence Safety Course purchased for myself or the organization: " + orgName,
            });

            if(customer.id){
                console.log("created a customer with customer.id: " + customer.id);
                customerStripeId = customer.id;
            }
            if(customer.error){
                console.log("stripe customer create error: " + customer.error.message);
                //const deleted = await stripe.customers.del(customerStripeId);
            }
        
            //PROCESS THE CREDIT CARD USING STRIPE
            const paymentIntent = await stripe.paymentIntents.create({
                amount: billingAmount * 100, //stripe deals in pennies
                currency: "usd",
                customer: customerStripeId,
                description: "Workplace Violence Safety Course web app for your business or organizaition",
                payment_method: stripeId,
                receipt_email: email,
                confirm: true
            },{
                idempotencyKey: idempotencyKey
            });


            if(paymentIntent.id){
                console.log("payment SUCCESS and paymentIntent.id: " + paymentIntent.id);
                validCreditCard = true;
            }else{
                const deleted = await stripe.customers.del(customerStripeId);
                console.log("stripe payementIntents error so deleted created customer on stripe");
            }
            
            //the credit card process did not succeed and failed
            if(!validCreditCard){

                return res.status(404).json({
                    success: false,
                    error: "The credit card number payment did not go succeed"
                })
            } 
        
        }else{
                //the license id number or credit card was invalid
                return res.status(404).json({
                    success: false,
                    error: "You must have a valid Id number or credit card number to register and purchase the course"
                })
        }






        //CREATE an SAVE ORGANIZATION Document - user=self OR organization=business/nonprofit/governement
        //for first time credit card purchase of license Id
        if(validCreditCard) {
            
            //a SINGLE PERSON is purchasing a course license
            if(isSinglePerson){

                //create a random license Id number for the self organization to use 
                const licenseNumber = randomLicenseIdNumber(8);

                const organization = new OrganizationPaid({
                    customerStripeId: customerStripeId,
                    organizationName: 'single',
                    payer: firstName + " " + middleName + " " + lastName,
                    accountType: accountType,
                    billingAmount: billingAmount,
                    licenseIdNumber: licenseNumber,
                    licenseTotal: licensetotal,
                    licenseUsed: 1,
                    orgAddress: orgAddress,
                    orgCity: orgCity,
                    orgStates: orgStates,
                    orgZipcode: orgZipcode,
                    orgPhone: orgPhone
                })


                //Hash the password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const user = new User({
                    username: username,
                    email: email,
                    password: hashedPassword,
                    accountType: accountType,
                    licensetotal: licensetotal,
                    firstName: firstName,
                    middleName: middleName,
                    lastName: lastName,
                    address: address,
                    city: city,
                    states: states,
                    zipcode: zipcode,
                    month: month,
                    day: day,
                    year: year,
                    gender: gender,
                    phone: phone,
                    usingCreditCard: usingCreditCard,
                    licenseIdNumber: licenseNumber,
                    role: role,
                    lastLesson: {"module": 1, "lessonId": 0},
                    modulesCompleted: [{ "module": 1, "lessonIds": [0], "moduleFinish": false }]

                })

                //create and save self organization to mongodb
                savedOrg = await organization.save();

                //create and save user document to mongodb
                savedUser = await user.save();




            //An ORGANIZATION is purchasing course licenses
            }else{

                //create a random license Id number for the organization to use for their employees
                const licenseNumber = randomLicenseIdNumber(8);

                const organization = new OrganizationPaid({
                    customerStripeId: customerStripeId,
                    organizationName: orgName,
                    payer: firstName + " " + middleName + " " + lastName,
                    accountType: accountType,
                    billingAmount: billingAmount,
                    licenseIdNumber: licenseNumber,
                    licenseTotal: licensetotal,
                    licenseUsed: 1,
                    orgAddress: orgAddress,
                    orgCity: orgCity,
                    orgStates: orgStates,
                    orgZipcode: orgZipcode,
                    orgPhone: orgPhone
                })


                //Hash the password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const user = new User({
                    username: username,
                    email: email,
                    password: hashedPassword,
                    accountType: accountType,
                    licensetotal: licensetotal,
                    firstName: firstName,
                    middleName: middleName,
                    lastName: lastName,
                    address: address,
                    city: city,
                    states: states,
                    zipcode: zipcode,
                    month: month,
                    day: day,
                    year: year,
                    gender: gender,
                    phone: phone,
                    usingCreditCard: usingCreditCard,
                    licenseIdNumber: licenseNumber,
                    role: role,
                    lastLesson: {"module": 1, "lessonId": 0},
                    modulesCompleted: [{ "module": 1, "lessonIds": [0], "moduleFinish": false }]
                })

                //create and save self organization to mongodb
                savedOrg = await organization.save();

                //create and save user document to mongodb
                savedUser = await user.save();

            }


        }//if(validCreditCard)




        //CREATE an SAVE USER Document - the license id number is correct and valid so add the user to the 
        //mongodb so they can access the course
        if(validLicenseIdNumber){

            //Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = new User({
                username: username,
                email: email,
                password: hashedPassword,
                accountType: accountType,
                licensetotal: licensetotal,
                firstName: firstName,
                middleName: middleName,
                lastName: lastName,
                address: address,
                city: city,
                states: states,
                zipcode: zipcode,
                month: month,
                day: day,
                year: year,
                gender: gender,
                phone: phone,
                usingCreditCard: usingCreditCard,
                licenseIdNumber: licenseIdNumber,
                role: role,
                lastLesson: {"module": 1, "lessonId": 0},
                modulesCompleted: [{ "module": 1, "lessonIds": [0], "moduleFinish": false }]
            })

            //create and save user document to mongodb
            savedUser = await user.save();

            //test-console.log("valid license and savedUser into mongodb: " + savedUser);

        }



       //create and save user document to mongodb
            //        const savedUser = await user.save();

        //create and assign jwt (json web token)
        //$*const token = jwt.sign({_id: savedUser._id, email: savedUser.email}, process.env.TOKEN_SECRET, {expiresIn: process.env.JWT_EXPIRE})

        res.status(201).send({
            success: true,
            user: savedUser,
            message: "user registration was successful"
            //$*token: token
        })



    }catch(error){
        
        //internal error happened with mongodb
        res.status(500).send({
            success: false,
            error: "This is the registration 500 Error: " + error.message
        })
    }




});










/* POST - This block of code is used to LOGIN the user. It take an email and=======================================
password and verifies it. If the user exists it then create and json
web token and sent to the client user for authentication.
*/
router.post('/login', async (req, res, next) => {
    //test-res.send('This is the login page route');

    //destructure request body into variables email and password
    const {email, password} = req.body;

    console.log("server auth-routes /login email" + email);
    //check to make sure the user entered an email or password
    if(!email || !password) {
        return res.status(401).json({
            success: false,
            error: "please enter an email and password"
        })
    }





    try{

        //check if email exists
        const user = await User.findOne({email}).select("+password");
        if(!user){
           return res.status(404).json({
                success: false,
                error: "email not found"
            })
        }
        //test-console.log(user);

        //check if password matches
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(404).send({
                success: false,
                error: "password did not match"
            })
        }

        //create and assign jwt (json web token)
       //$*const token = jwt.sign({_id: user._id, email: user.email}, process.env.TOKEN_SECRET, {expiresIn: process.env.JWT_EXPIRE});

        console.log(user);

        //Create a user session. This data is only set in the session cookie
        req.session.userSession = { databaseId: user._id, email: user.email, role: user.role };

        //send a response with the user data that is required for the coursework
        res.status(201).json({
            success: true,
            message: "you are logged in!",
            
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            lastLesson: user.lastLesson,
            modulesCompleted: user.modulesCompleted,
            //$*token: token
        });

        //test-console.log("The auth.routes router.post('/login...: token is: " + token);


    }catch(error){

        //internal error happened with mongodb
        res.status(500).send({
            success: false,
            error: error
        })
    }
});











/*POST - This block is used to help RESET PASSWORD for the user. The user enters a valid===========================
email that is looked up in mongodb. Then a token with expiration date is sent
via a link to the user's email. The link takes them to the /resetpassword/: route
for the user to enter a new password
*/
router.post('/forgotpassword', async (req, res, next) => {
    //test-res.send('This is the forgot password page route');

    //destructure the email from the request body
    const {email} = req.body;
   



    try {

        //test-console.log(email);

        //look up user by email in the mongodb
        const user = await User.findOne({email});

        //if no exist, user=null, then return 404 error
        if(!user){
            return res.status(404).send({
                success: false,
                error: "you have entered a wrong email or it doesn't exist"
            })
        }

        //creating new token to sent with email for verification
        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        
        //creating a formatted date for setting the expiration
        const expireDate = new Date();
        expireDate.setMinutes( expireDate.getMinutes() + 30 );

        //test-console.log(expireDate);

        //setting the expiration of token to be sent with email for verification
        user.resetPasswordExpire = expireDate;

        //saving changes to mongodb 
        await user.save();

        //link to be sent for password reset inside the email
        const resetUrl = `http://localhost:3000/resetpassword/${resetToken}`;
        const message = `
        <h1>Password reset message</h1>
        <p>Click on the link to reset your password</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `



        try {

            //send the email with the html instructions above with sendEmail module
            await sendEmail({
                to: user.email,
                subject: "Reset account password requested",
                text: message
            });

            //email was sent correct with 200 response
            res.status(200).send({
                success: true,
                message: "email with reset instructions sent"
            })




        } catch (error) {

            //reset these fields in 'user' and save to mongodb
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return next (res.status(500).send({
                sucess: false,
                error: "email for reset was not sent error - " + error
                })
            );
            
        }





    } catch (error) {

        //if an error was generated show it and then continue with server processes
        console.log("error: 500 internal error was generated. ERROR: " + error);

        //internal error happened with mongodb
        res.status(500).send({
            success: false,
            error: error.message
        })


        next(error);

    }

});






/* PUT - This route is for RESET TOKEN. It is taken once the user receives the email and then enters================
a new password. The token "resetToken" is taken from the params at the end of the 
URL and hashed to make sure it is valid. The expiration is also checked to make 
sure it is not longer than 10 mins or a new email and token link will have to be
issued. Once validated the new password is saved with the user and they can login
*/
router.put('/resetpassword/:resetToken', async (req, res, next) => {
    //test-res.send('This is the reset password page route');

    //Get hashed token from the url parameters
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    //test-console.log(resetPasswordToken);




    try {

        //find user in mongodb based onn the reset token and expiration dat
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now()}//$greater than: Date.now
        })


        //if the user wasn't found in the mongodb send an error 404 not found
        if(!user){
            return next (res.status(404).send({
                success: false,
                error: "Reset token is invalid or has expired"
            }))
        }


        //Hash the password
        password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //set the password that was created by the user
        user.password = hashedPassword;

        //resetPassword*** keys can now be reset because they are no longer needed
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        //update and saved to mongodb
        await user.save();

        res.status(200).json({
            success: true,
            data: "password was successfully reset"
        })




    } catch (error) {

        //Internal error so send back a 500 response
        res.status(500).send({
            success: false,
            error: "Internal error: " + error
        })


        //continue with serving pages
        next();
    }

});






module.exports = router;



