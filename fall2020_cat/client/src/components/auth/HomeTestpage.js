import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import './../../App.css';



/**This component was used for testing of localStorage, JSON web tokens, Protected Routes
 * and checking login authorization
 */
const HomeTestpage = ({ history }) => {

    const [showPrivateDashboard, setShowPrivateDashboardLink] = useState(false);
    const [loggedIn, setLogin] = useState(
        //return True is "authToken" is set and set string "Logged In" else show "Logged Out"
        localStorage.getItem("authToken") ? "Logged In" : "Logged Out"
    );

    //test-console.log("The Homepage localStorage authToken is: " + localStorage.getItem("authToken"));
    
    //On first render of this component check to see if the "authToken" is set and show Dashboard link.
    useEffect(() => {

        if(localStorage.getItem("authToken")){
            setShowPrivateDashboardLink(true);    
        }

    } , [showPrivateDashboard]);

    

    return(
        <div>
           
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            <h1>Home page</h1>
            <p><span>{loggedIn}</span></p>

            {showPrivateDashboard && <Link to="/privatescreen">Private Screen Dashboard</Link>}
            <br/>

            <section className='sample-pane'>
                Sample Panes
                <div id="bigBlock">
                    <p>Content can go in here. For example all of the pictures description an other advertising or
                        information material 
                    </p>
                </div>
            </section>
            <footer>
                <h1>Contact Us</h1>
                <h3>(888) 888-888</h3>
                <h3>info@k12assessment.com</h3>
            </footer>

        </div>
    );


}

export default HomeTestpage;