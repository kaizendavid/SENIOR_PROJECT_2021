
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const OrganizationPaid = require('../models/OrganizationsPaid');





/**This module is used to get and update user account data on the mongodb database.
 * It is also used to get the users of the organization
 */


/**GET - The following block of code is used personal information from the server=========================================
 *for displaying on the profile page
 */
router.get('/userdata/:email', async (req, res) => {
    console.log("GET /userdata/email");

    const userEmail = req.params.email;


    if(req.session.userSession.email == userEmail){

        try {
            const user = await User.findOne({ email: userEmail}).exec();

            console.log(user);

            res.status(200).send({
                success: true,
                user: user
            });
            
        } catch (error) {
            
            res.status(500).send({
                success: false,
                error: error
            })
        }
    }
});





/**PATCH - The following block of code is used update Personal user information on mongodb===================================
 * It changes any data that the user modified on the profile page. This is one of two 
 * profile page types of modifications
 */
router.patch('/changeuserdata', async (req, res) => {

    console.log("PATCH /changeuserdata");

    //test-console.log(req.body);

    let savedUser;

    const { firstName, 
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
            phone } = req.body;

    const sessionEmail = req.session.userSession.email;

    try {

        if(req.body.email != sessionEmail){
          
            return res.status(404).send({
                success: false,
                error: "Your email and the session email don't match"
            });
        
        }

        const user = await User.findOne({ email: req.body.email}).exec();

        if(firstName){
            //test-console.log("changeuserdata firstName");
            user.firstName = firstName;
        }
        if(middleName){
            user.middleName = middleName;
        }
        if(lastName){
            //test-console.log("changeuserdata lastName");
            user.lastName = lastName;
        }
        if(address){
            user.address = address;
        }
        if(city){
            user.city = city;
        }
        if(states){
            user.states = states;
        }
        if(zipcode){
            user.zipcode = zipcode;
        }
        if(month){
            user.month = month;
        }
        if(day){
            user.day = day;
        }
        if(year){
            user.year = year;
        }
        if(gender){
            user.gender = gender;
        }
        if(phone){
            user.phone = phone;    
        }

        savedUser = await user.save();

        //test-console.log(savedUser);

        res.status(200).send({
            success: true,
            message: "Server: user personal information was saved and updated"
        })
    

    } catch (error) {

        console.log(error);

        res.status(500).send({
            success: false,
            message: "Server Error: could not update user personal information",
            error: error

        });
    }

});


/**PATCH - The following block of code is used update Account user information on mongodb===================================
 * It changes any data that the user modified on the profile page. This is one of two 
 * profile page types of modifications
 */
router.patch("/changeaccountdata", async (req, res) => {

    console.log("PATCH /changeaccountdata");

    let savedUser;

    const { email, username, password, newPassword } = req.body;

    const sessionEmail = req.session.userSession.email;

    try {

        if(email != sessionEmail){
            return res.status(404).send({
                success: false,
                error: "Your email and the session email don't match"
            });
        }

        const user = await User.findOne({ email: email}).select("+password").exec();

        if(username){

            user.username = username;
        }


        if(newPassword){

            //check if password matches
            const passwordMatch = await bcrypt.compare(password, user.password);

            if(!passwordMatch){
                console.log("passwords didn't match");

                return res.status(404).send({
                    success: false,
                    error: "password did not match"
                })
            }

            //Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            //set the password that was created by the user
            user.password = hashedPassword;
            console.log("changing the password");
        }
        
        savedUser = await user.save();

        res.status(200).send({
            success: true,
            message: "Server: user account information was saved and updated"
        })
        
    } catch (error) {
        console.log(error)

        res.status(500).send({
            success: false,
            message: "Server Error: could not update user account information",
            error: error
        });
        
    }

});



/**GET - The following block of code is used to get all users for a given organization ===================================
 * It uses the Admin user email to retrieve the license Id number from the user and then 
 * gets all the users registered under the licesnse number. This is used in the AdminUsers
 * page to show all the organizations user and their progress
 */
router.get("/organizationusers/:email", async (req, res) => {

    console.log("GET /organizationusers");

    const userEmail = req.params.email;

    try {
        
        const adminUser = await User.findOne({ email: userEmail }).exec();

        const organizationLicenseIdNumber = adminUser.licenseIdNumber;

        const organizationUsers = await User.find({ licenseIdNumber: organizationLicenseIdNumber }).exec();

        const organization = await OrganizationPaid.find({ licenseIdNumber: organizationLicenseIdNumber}).exec();

        console.log(organization);

        res.status(200).send({
            success: true,
            message: "Organization users have been retrieved",
            organization: organization,
            organizationUsers: organizationUsers
        });
        

    } catch (error) {
        
        console.log(error);

        res.status(500).send({
            success: false,
            message: "Server Error: could not retrieve organization users",
            error: error
        });

    }

});






module.exports = router;