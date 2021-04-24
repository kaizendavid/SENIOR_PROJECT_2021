import axios from 'axios';




/**This component has functions that are used for authentication and authorization. It is used in the 
 * AuthProvider.js and Register.js 
 */


//Check it the user has an existing express-session on the server. If so sow they are logged in and pass it 
//to the AuthProvider ELSE they are not logged in.
export const authenticateUser = async () => {
    try{

        const authServerResponse = await axios.get('/api/auth/session');
        console.log('authService authRes:', authServerResponse);

        if ( !authServerResponse.data.error ){
            console.log("No authServerResponse.data.error, found a session");
            return authServerResponse;
            

        }else{
            console.log('No existing user session in database!');
            return authServerResponse;
            
        }

    }catch(error){

        console.log('authService authenticate error:', error)
        return error;
    }
}




//used in the AuthProvider to logout users
export const logoutUser = async () => {

    let logoutServerResponse;

    try {
         logoutServerResponse = await axios.post('/api/auth/session/logout');
        console.log('authService logoutServerResponse:', logoutServerResponse);
        return logoutServerResponse;

    } catch (error) {
        console.log("authService Error: " + logoutServerResponse.data.error);
        console.log('Could not logout because of error');
        return logoutServerResponse;
    }
    
    
}









