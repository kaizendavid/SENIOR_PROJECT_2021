import "./ContactUs.css";
import { useState, useEffect } from "react";
import { sendContactUsEmail } from '../../services/publicService';
import { useAuth } from '../../context/AuthProvider'





/**This component is used to have people or users email the customer service or contact us via email.
 * It is a public component and users don't have to be registered to use it. For email to take 
 * place it uses the /services/publicService component. This uses sendGrid.com API
 */
const ContactUs = () => {

    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    //check if the user is logged in upon component mount/render
    const { userState } = useAuth()
    useEffect(() => {
        if ( userState.loggedIn )
        {
            setEmail(userState.email)
        } 
    },[])


    //send the mail to the user via the sendContactUsEmail PublicService component
    const contactUsHandler = async (Event) => {
        Event.preventDefault();

        //test-console.log(email);

        //configuration file for Axios to set a header line content type to application/json
        const config = {
            header: {"Content-Type": "application/json" }
        }

        //try to send emailt, subject, and message to node server via Axios
        try {
            const {data} = await sendContactUsEmail({email, subject, message})

            setSuccessMessage(data.message);


        } catch (error) {
            //show error in the form
            setErrorMessage(error.response.data.error);
            //clear the email text box
            //setEmail("");

        }

    }



    return(
        
        <div className="contactContainer" stye={{background: "yellow"}}>

            <div className="leftSide"></div>
            <div className="rightSide"></div>

            <div className="contactForm">

                <br/>
                
                <center>
                <h1>Contact Us</h1>
                </center>

                <form className="form" onSubmit={contactUsHandler}>

                    <div className='form-group'>
                        
                        <label htmlFor="email"><h2>Your Email:</h2></label>

                        <center>
                        <input className="contactFormInput" type="text" required id="email" placeholder="Enter Your Email" 
                            value={email} onChange={(Event) => setEmail(Event.target.value)} />
                        </center>

                    </div>


                    <div className='form-group'>
                        
                        <label htmlFor="subject"><h2>Subject</h2></label>

                        <center>
                        <input className="contactFormInput" type="text" required id="subject" placeholder="Enter Subject" 
                            value={subject} onChange={(Event) => setSubject(Event.target.value)} />
                        </center>

                    </div>


                    <div className='form-group'>
                        
                        <label htmlFor="message"><h2>Message</h2></label>
                        <textarea className="contactFormInput contactusTextarea" cols='80' rows='10' type="text" required id="message" placeholder="Enter Your Message" 
                            value={message} onChange={(Event) => setMessage(Event.target.value)} />

                    </div>

                    <br/>

                    <button type="submit">Send Email</button>


                    <br/>
                    {errorMessage && <p>Error: {errorMessage}</p>}
                    {successMessage && <p>{successMessage}</p>}

                </form>

                
            </div>

        </div>


    );

}



export default ContactUs;


