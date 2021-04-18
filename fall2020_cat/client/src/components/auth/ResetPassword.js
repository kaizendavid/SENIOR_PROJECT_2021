import './auth.css';
import {useState, useEffect} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';





/**This component is used to reset the user password. This page/component is accessed through a link sent by an email.
 * The email link has a JWT that is generated when the user resets his password via the ForgotPassword component.
 * The JWT is generated on the server and is then authenticated and sent back in URL parameter.
 * The user enters a new password and confirms it. It must be 8 characters or more and match. The password is 
 * send to the server backend. A button appears that the user can click to redirect to "/login" 
 */
const ResetPasswordScreen = ( { history, match } ) => {

    //state functions to set state variables
    const [password, setPassword] = useState("");
    const [confirmpassword, setComfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [success, setSuccess] = useState(false);
    const [disableEnableInput, setDisableEnableInput] = useState(false);


    //remove any token set and redirect to "/login"
    const logoutHandler = () => {
        localStorage.removeItem("authToken");
        history.push("/login");
    }

    //form submit handler to set and send email, password to node server for authentication
    const resetPasswordHandler = async (Event) => {
        Event.preventDefault();

        //configuration file for Axios to set a header line content type to application/json
        const config = {
            header: {"Content-Type": "application/json" }
        }

        //make sure the passwords match or set error message and reset in 5 sec
        if(password != confirmpassword) {
            setPassword("");
            setComfirmPassword("");
            setTimeout(() => {
                setErrorMessage("");
            }, 5000);

            return setErrorMessage("Enter a password that matches");
        }

        //try to send register data to node server via Axios
        try {
            const serverData = await axios.put(
                `/api/auth/resetpassword/${match.params.resetToken}`, {password}, config);

            //test-console.log(serverData);
            
            //set input text boxes to blank
            setPassword("");
            setComfirmPassword("");

            //set response lines in the page
            setSuccess(serverData.data.success);
            setDisableEnableInput(serverData.data.success);


        } catch (error) {
            //show the error i the page
            setErrorMessage(error.response.data.error);

            //Set the error message to empty in 5 sec
            setTimeout(() => {
                setErrorMessage("");
            },
            5000);
        }

    }//resetPasswordHandler






    return(
        <div className="grid-layout backColorOrange">

            <div className="centerFormContainer">
        
                

                <form onSubmit={resetPasswordHandler}>

                    <label><h1>Reset Password Screen</h1></label>

                    <div className='form-group'>  
                        <label htmlFor="password"><h2>New Password:</h2></label>
                        <input type="password" required id="password" placeholder="Enter Password" 
                        disabled={disableEnableInput} value={password} onChange={(Event) => setPassword(Event.target.value)} />  
                    </div>

                    <div className='form-group'>  
                        <label htmlFor="comfirmpassword"><h2>Confirm Password:</h2></label>
                        <input type="password" required id="comfirmpassword" placeholder="Comfirm Password" 
                        disabled={disableEnableInput} value={confirmpassword} onChange={(Event) => setComfirmPassword(Event.target.value)} />  
                    </div>

                    <br/>
                        
                    <div className="button-holder">
                        <button  type="submit">Reset Password</button>
                    </div>

                    <br/>
                    <span style={{color: 'red'}}>{errorMessage}</span> 

                    {success && (<><span>Return to </span><button onClick={logoutHandler}>Login</button></>)}

                    <br/>

                    <span>Don't have an account? <Link to="/register">Register</Link></span>
                    
                </form>

            </div>
          
        </div>
    );

}

export default ResetPasswordScreen

