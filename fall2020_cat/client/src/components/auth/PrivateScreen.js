import {useState, useEffect} from 'react';
import axios from 'axios';
import './../../App.css';




/**This component was used for testing of localStorage, JSON web tokens, Protected Routes
 * and checking login authorization. It was also used for formating CSS and other tests
 */
const PrivateScreen = ({history}) => {

    const [errorMessage2, setErrorMessage2] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [serverError, setServerError] = useState(false);
    const [privateData, setPrivateData] = useState("");


    useEffect(() => {

        if(!localStorage.getItem("authToken")){
            history.push('/login');
        }

        //test-console.log("0.Before serverData = async () => {");

        const serverData = async () => {

            //configuration headers for Axios. Authoriztion Bearer line is used to show that a "authToken" is present
            //so the user has access to the data that it is requesting from the server. The JWT is sent along
            //in the header so it can be verified.
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                },
                
            };
            //test-console.log(localStorage.getItem("authToken"));

            //try to send page and JWT authToken to server for private data access
            try {

                const {data} = await axios.get("/api/auth/coursework", config);
                
                //private data returned from server
                setPrivateData(data.data);
                
            } catch (error) {
                //test-console.log(error);

                setErrorMessage2(error);

                //remove any token from localStorage because an error occured. Causes: token expired, bad token,
                //no token, token don't match one originially sent on file
                localStorage.removeItem("authToken");

                setServerError(true);
                setErrorMessage("No authorization to view, please Login");
                
            }


        }//serverData
    
        serverData();
    }, [history]);

    //used to logout user and remove JWT "authToken". Then redirects to root homepage
    const logoutHandler = () => {
        localStorage.removeItem("authToken");
        history.push("/");
    }


    return(
            <div>
                <h1>Private Screen</h1>

                {   
                    serverError ? <><span>{errorMessage}</span><p>{errorMessage2}</p> </> : <>
                    
                    <h1>Private Screen Dashboard</h1>
                    <span>{privateData}</span>
                    <br/>
                    <br/>
                    <br/>
                    <button onClick={logoutHandler}>Logout</button>
                    </>
                }
            </div>  
        );

};


export default PrivateScreen;
