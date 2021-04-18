const { response } = require('express')

const sessionRouter = require('express').Router()

/* 
WHY: Used to authenticate user on page reloads, so user doesn't have to login again.

HOW: On frontend site load, check if a valid user session exists in the backend. 
    Once in the backend, this function will check if there was any user data stored for their session.
    If there is user data in their session, they were already authenticated before, so send it back.
    Else, if there is not user data stored for their session, it means its expired or invalid, so clear their invalid cookie.
*/
sessionRouter.get('/', (req, res) => {
    if( req.session.userSession ){  

        console.log('sessionRouter found an existing valid user session!');
        res.status(200).json({
            success: true,
            messages: "user session exists",
            email: req.session.userSession.email, 
            role: req.session.userSession.role});

    }else{

        console.log('sessionRouter did not find an existing user session, for private routes')
        res.clearCookie(req.session.name).send({
            success: false,
            message: "you need to re-authenticate because session doesn't exits if you want access to private routes",
            error: "you need to re-authenticate!"
        });
        //$*res.json({error: 'You need to re-authenticate!'})
    }
});

/*
WHY: Used for logging out user
HOW: First, it destroys the user's session.
    Then, in the callback, it tells the user's browser to clear the cookie that contains the destroyed session id.
*/
sessionRouter.post('/logout', async (req, res) => {
    const sessName = req.session.name

    req.session.destroy((error) => {
        if ( error ){
            console.log('sessionRouter /logout error:', error);
            res.send({
                success: false,
                 message: "An error occurred, you are still logged in!"
            });

        }else{
            console.log('sessionRouter /logout successful')
        }    
    });

        res.clearCookie(sessName).send({
            success: true,
            message: "you have ended the session and been successfully logged out"
        });

});

module.exports = sessionRouter