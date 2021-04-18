import './auth.css'
import {useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';



/**This component is used to send an email to the users email account with a link that takes them to 
* the Resetpassword component/page to reset their password.
*/
const ForgotPasswordScreen = ( { history } ) => {

    //state functions to set state variables
    const [email, setEmail] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    //form submit handler used in to send email to node server for password retrieval
    const forgotPasswordHandler = async (Event) => {
        Event.preventDefault();

        //configuration file for Axios to set a header line content type to application/json
        const config = {
            header: {"Content-Type": "application/json" }
        }

        //try to send email to node server via Axios
        try {
            const {data} = await axios.post("/api/auth/forgotpassword", {email}, config);

            setSuccessMessage(data.message + " ");


        } catch (error) {
            //show error in the form
            setErrorMessage(error.response.data.error);
            //clear the email text box
            setEmail("");
            //Set the error message to empty in 5 sec
            setTimeout(() => {
                setErrorMessage("");
            },
            5000);
        }

    }//registerHandler



    

    return(
        <div className='forgot-password-grid-layout backColorOrange'>

            <div className="centerFormContainer">

                <form className ='form' onSubmit={forgotPasswordHandler}>

                    <label htmlFor="email"><h1>Forgot your Password?</h1></label>

                    <span className="marginTen">Please enter the email you registered with</span>

                        <center> 
                        <input className="formInput"
                            type="text" 
                            required id="email" 
                            placeholder="Enter Password" 
                            value={email} 
                            onChange={(Event) => setEmail(Event.target.value)} />  
                        </center>   

                        
                    <div className='form-group'>     
                        <button className="buttonLogin" type="submit"><h2>Reset</h2></button>
                    </div>

                    <br/>
                    <span style={{color: 'red'}}>{errorMessage}</span> 
                    <br/>
                    {errorMessage && <span>you have an error</span>}
                    <br/>
                    {successMessage && <span>{successMessage}</span>}
                    <br/>
                    <span>{successMessage ? "Email has been sent ": ""}</span>
                    <br/>
                    <span >Don't have an account? <Link to="/register">Register</Link></span>   

                </form>

            </div>

        </div>
    );

}

export default ForgotPasswordScreen

