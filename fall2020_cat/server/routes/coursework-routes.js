const router = require('express').Router();
const { compare } = require('bcryptjs');
const ProtectRoute = require('../middleware/protectVerifyToken');
const Module = require('../models/Modules');
const Coursework = require('../models/Coursework');
const User = require('../models/Users');





/**This module is used for users that are logged in. The endpoints are used for CRUD operations on coursework
 * or User related progress. It is mainly used for getting module lessons
 * 
 * 
 * The ProtectRoute is used to verify that the JWT is legit and encrypted. Any API endpoints in here
 *  are part of the COURSE LESSONS and are  With ProtectRoute middleware the user will not be allowed to 
 * continue forward to the page if they have ProtectRoute with JWT. All others use Express-Sessions
 */
router.get('/', ProtectRoute, (req, res) => {

    //dummy data to confirm that this works
    console.log(req.body);
    res.json({data: "your private dashboard data accessed"});


});





/**GET - The following block of code is used to get the course work from the server=========================================
 *for displaying on the userdashboard
 */
router.get('/course', async (req, res) => {

    try {
        //query the mongodb to get all the course work to return to the user
        const course = await Coursework.find({ }, (error, data) => {

                if(error){
                    console.log(error);
                }else{
                    console.log("GET: /course");
                    //test-console.log(`This is the data: ${data}`);
                }
            });

        return res.status(201).json({
            success: true,
            course: course
        });


    } catch (error) {

        console.log(error);
        //internal error happened with mongodb
        res.status(500).send({
            success: false,
            error: "This is the registration 500 Error: " + error.message
        })
    }

});






/**GET - The following block of code is used to get individual course modules from mongodb=====================================
 * The parameters needed are module number and lessonId number. This is first used in the Presentor module when
 * the user clicks a Module Card in the userdashboard.
 */
router.get("/modules/:module/:lessonId", async (req, res) => {
    console.log("GET /modules");
    
    const modules = req.params.module;
    const lessonId = req.params.lessonId;

    console.log(req.params);
    console.log("module: " + modules + ", lessonId: " + lessonId);

    try {
        const courseModule = await Module.findOne({module: modules, lessonId: lessonId}, (error, data) => {
            if(error){
                console.log(error);
            }
            if(data){
                console.log(data);
            }
        });

        console.log(courseModule);

        if(!modules){
            return res.status(404).json({
                success: false,
                error: `Module ${modules} and lessonId ${lessonId} is not found.`
            });
        }


        res.status(201).json({
            success: true,
            courseModule: courseModule
        });
        
    } catch (error) {
        console.log(error);
        
    }

});




/**GET - The following block of code is used to get individual course modules from mongodb=====================================
 * The lessons are used in the Presentor when the user clicks Next or Previous button
 */
router.get("/nextmodule/:module/:stepPosition", async (req, res) => {
    console.log("GET /nextmodule");
    
    const modules = req.params.module;
    const stepPosition = req.params.stepPosition;

    console.log(req.params);
    console.log("module: " + modules + ", stepPosition: " + stepPosition);

    try {
        const courseModule = await Module.findOne({module: modules, stepPosition: stepPosition}, (error, data) => {
            if(error){
                console.log("Mongodb ERROR: " + error);
            }
            if(data){
                console.log("data: " + data);
            }
        });

        console.log("mongodb courseModule: " + courseModule);

        if(!modules){
            return res.status(404).json({
                success: false,
                error: `Module ${modules} and lessonId ${stepPosition} is not found.`
            });
        }


        res.status(201).json({
            success: true,
            courseModule: courseModule
        });
        
    } catch (error) {
        console.log(error);
        //internal error happened with mongodb
        res.status(500).send({
            success: false,
            error: error.message
        })
        
    }

});


/**PATCH - The following block of code is used update user progress on mongodb===================================
 * It add a lessonid onto the users lessonid array on modules completed. It also update the last lesson taken
 */
router.patch("/updateprogress", async (req, res) => {

    console.log("PATCH /updateprogress");

    const { email, currentModule, currentStepPosition } = req.body;

    let savedUser;

    try {

        const sessionEmail = req.session.userSession.email;

        console.log("email: " + email + " sessionEmail: " + sessionEmail);

        if(email == sessionEmail){

            console.log("try to find user");

            const user = await User.findOne({email: email}).exec();

            user.lastLesson = { module: currentModule, lessonId: currentStepPosition };

            const indexOfModule = currentModule - 1;

            user.modulesCompleted[indexOfModule].lessonIds.push(currentStepPosition);

            savedUser = await user.save();

            console.log(savedUser);

        }

        res.status(201).send({
            success: true,
            user: savedUser,
            message: "Server: user progress has been updated"
        })



    } catch (error) {

        console.log("Could not update the user progress");

        console.log(error);
        
        //internal error happened with mongodb
        res.status(500).send({
            success: false,
            error: "Server updateprogress Error: " + error.message
        });
    
    }
    
});





/**PATCH - The following block of code is used update user progress on mongodb===================================
 * It add true to the moduleFinished key in the module completed and adds another module JSON object
 * to the users array so they can continue to the next module and lessons
 */
router.patch("/modulefinished", async (req, res) => {

    console.log("PATCH /modulefinished");

    const { email, currentModule, currentStepPosition } = req.body;

    let savedUser;

    try {

        const sessionEmail = req.session.userSession.email;

        console.log("email: " + email + " sessionEmail: " + sessionEmail + " currentModule: " + currentModule);

        if(email == sessionEmail){

            console.log("try to find user set module finished");

            const user = await User.findOne({email: email}).exec();

            const indexOfModule = currentModule - 1;
            console.log("indexOfModule: " +  indexOfModule);
            
            user.modulesCompleted[indexOfModule].moduleFinish = true;

            user.lastLesson = { module: currentModule + 1, lessonId: 0 };

            user.modulesCompleted.push({ module: currentModule + 1, lessonIds: [0], moduleFinish: false});

            savedUser = await user.save();

            console.log(savedUser);

        }

    
        res.status(201).send({
            success: true,
            user: savedUser,
            message: "Server: user module finished and progress updated"
            //$*token: token
        })



    } catch (error) {

        console.log("Could not update the user module finished");

        console.log(error);
        
        //internal error happened with mongodb
        res.status(500).send({
            success: false,
            error: "Server modulefinished Error: " + error.message
        });
    
    }
    
});









module.exports = router;
