const jwt = require('jsonwebtoken');
const User =  require('../models/Users')




/**This module is used for protected routes.  It checks the headers of the client request to see if it has
 * the JWT encrypted token. The Authorization line is then checked for Bearer for the token and 
 * splits it. It is no longer used because express-sessions are used to see if the user is authenticated
 */
module.exports = async (req, res, next) => {
    
    let token;
    let user;
    
    //get authorization header line and get token from Bearer
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    }

    //test-console.log("The protectVerifyToken header authorization line : " + req.headers.authorization);
    //test-console.log("The Bearer line: " + token);



    //Check to see if the Bearer is empty and throw an error if no token is found
    if(!token){
        console.log("No token found");
        return res.status(401).send({
            sucess: false,
            error: "you are not logged in to enter this route"
        })
    }
    //test-console.log("I am here before try/catch");
    


    try {

        //test-console.log("I am here INSIDE try/catch and The token is: " + token);

        //Decode token with enviroment variable TOKEN_SECRET found in the "/config/config.env" file
        const verifyDecoded = jwt.verify(token, process.env.TOKEN_SECRET);

        //test-console.log(verifyDecoded);

        //check to see if the user exists in the database by taking the mongodb _id variable inside the decoded token
        const user = await User.findById(verifyDecoded._id);

        if(!user){
            return res.status(401).send({
                sucess: false,
                error: "Not authorization to enter this route"
            })
        }
    
        //set the request user = to database user to move on to the next callback function
        req.user = user;

        //test-console.log("Token verified for protected route, token is: " + token);

        next()
    } catch (error) {


        //token is invalid
        console.log("protectVerifyToken error");
        console.log(error);

        return res.status(400).send({
            success: false,
            error: "invalid token - error: " + error
        })
        
    }

};