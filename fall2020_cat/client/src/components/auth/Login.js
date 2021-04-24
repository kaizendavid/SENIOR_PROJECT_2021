import './auth.css';
import { useState, useEffect, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import axios from 'axios';
import { loginUser } from '../../services/authService';

//Any comment code with $* in front is JWT code that is now removed or replaced with express-sessions
//$*import axios from 'axios'; now using AuthProvider that uses authService to do axios calls
//$*import { GlobalContext } from '../../context/GlobalState';





/*This component is used to login users and create a express session on the server. It was
* us to store a JWT "authToken" in the local storage that is encrypted but now uses express-sessions.
* The user enters their email and password that is then authenticated on the server and database.
* The login uses the context/AuthProvider logIn then onto loginUser /services/authService to
* send user credentials to the server. If it is verified and correct in the AuthProvider it sets the Global
* context in the AuthProvider to 'true' so that it is accessible to all the components via app.js
*/
const LoginScreen = () => {

    //state functions to set state variables
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);



    //import the Global Context state variables and methods
    const{ loginStatus, logIn, userState, setUserData, setLastLesson, setModulesCompleted} = useAuth();//useContext(GlobalContext);

    const history = useHistory();

    //When first rendering the component it checks to see if the user has already been authenticated by checking
    // if a JWT "authToken" is set. If so then the user is redirected to the root "/" home page  
    useEffect(() => {
        //redirect user to landing home page if they are logged in
        if ( userState.loggedIn )
        {
            history.push("/");
        }
        //$*if ( localStorage.getItem("authToken") ){
        //$*   history.push("/userdashboard");
        //$*}

    }, []);



    //form submit handler to set email and password register data to node server for authentication
    const loginHandler = async (Event) => {
        Event.preventDefault();

        setIsProcessing(true);

        //configuration file for Axios to set a header line content type to application/json
        //$*const config = {
        //$*    header: {"Content-Type": "application/json" }
        //$*}

        //try to send register data to node server via Axios
        try {      

            const authProviderResponse = await axios.post("/api/auth/login", {email, password});
            
            //used for tests
            //console.log("Login response: " + authProviderResponse);
            //$*const serverData = await axios.post("/api/auth/login", {email, password}, config);/*test-.then((response)=>{
            //$*    console.log(response); using the AuthProvider that uses the authService
            //$*    return response;
            //$*})*/

            //test-console.log("serverData is: " + serverData.data.token);
            
            //extract token from server response and save to local storage for authorization permission proving logged in
            //$*localStorage.setItem("authToken", serverData.data.token); using express-sessions

            //if there is a legit Authorization JWT set in axios response serverData then do the following
            //$*if( localStorage.getItem("authToken") ) {
                //test-console.log("serverData.data" + JSON.stringify(serverData.data));
            //$*    console.log("Login: if======");
                //setting 'role', 'courseworkCompleted', 'name' and of the user that logged in into the Global Context state
                //$*setIsAuth(true);
                //$*loginStatus(true);

            //if the user has successfully logged in then set global state variables in AuthProvider context
            if(authProviderResponse.data.success){

                logIn(authProviderResponse.data.email, authProviderResponse.data.role);

                setUserData({
                    firstname: authProviderResponse.data.firstName, 
                    lastname: authProviderResponse.data.lastName, 
                    role: authProviderResponse.data.role
                    }, true);

                //setting last Lesson into AuthProvider Global Context State 
                setLastLesson({ module: authProviderResponse.data.lastLesson.module,
                                lessonId: authProviderResponse.data.lastLesson.lessonId }, true);

                //setting modules completed AuthProvider into Global Context State
                setModulesCompleted(authProviderResponse.data.modulesCompleted, true);
                
            } else{
                console.log("Login: else======");
                //reset Global Context state and storage variables because user isn't logged in
                setUserData({firstname: "", 
                    lastname: "", 
                    role: ""}, false);

                loginStatus(false);

                setLastLesson({module: 0, lessonId: 0}, false)
                setModulesCompleted([{ module: 0, lessonIds: [0], moduleFinish: false }], false);
            }



            //redirect user to user dashboard if login is successful
            history.push("/userdashboard");

        }catch (error){

            //show error message on the form page below
            //setErrorMessage(error.response.data.error);
            console.log(error);
            setErrorMessage("Server 500 Error: " + error);
            //Set the error message to empty in 5 sec
            setTimeout(() => {
                setErrorMessage("");
                setIsProcessing(false);
            },
            20000);
        }

    }//registerHandler






    return(
        <div className='login-grid-layout backColorOrange' >

            <div className="centerLoginContainer">

            {errorMessage && 
                <div>
                    <p style={{textAlign: "center", }}><span style={{fontWeight: "bold", fontSize: "17px", color: "red"}}>{errorMessage} </span></p>
                <   br/>
                </div>
            }

                    
                <div className="centerBox">

                    <form onSubmit={loginHandler}>

                        
                            <label htmlFor="email"><h2>Email:</h2></label>
                            
                            <input type="text" required id="email" placeholder="Enter Email" 
                            value={email} onChange={(Event) => setEmail(Event.target.value)} />  
                        
                                
                          
                            <label htmlFor="password"><h2>Password:</h2></label>
                            <input 
                                type="password" 
                                required id="password" 
                                placeholder="Password" 
                                value={password} 
                                minLength='8' 
                                onChange={(Event) => setPassword(Event.target.value)} 
                            />  
                       

                        <div className='form-group'>
                            <div className='button-holder'> 
                                <button disabled={isProcessing} type="submit" className="buttonLogin">{isProcessing? <h2>Processing</h2> : <h2>Login</h2> }</button>
                            </div>
                        </div>
                
  
                        <center>
                        <p><Link style={{textDecoration: "none", color: "black", fontSize: "17px"}} to="/register">Don't have an account? Register</Link></p>

                        <p><Link style={{textDecoration: "none", color: "black", fontSize: "17px"}} to="/forgotpassword">Forgot Password?</Link></p>
                        </center>

                    </form>

                </div>

             </div>

        </div>
    );

}






export default LoginScreen

