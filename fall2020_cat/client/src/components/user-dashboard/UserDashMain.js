import './Userdashboard.css';
import Card from './../card/Card'
import { useEffect, useState } from 'react';
import axios from 'axios';






/**This component is used to show the coursework modules in a card format. The data is sent via props from
 * the parent Userdashboard component.
 */
const UserDashMain = ({ loginStatus, lastLesson, modulesCompleted }) => {

    const [errorMessage, setErrorMessage] = useState("");
    const [courseModules, setCourseModules] = useState([]);
    const [isAuth, setIsAuth] = useState(false);



    //As soon as the component loads get the Course from the backend
    useEffect(() => {
        getCourse();
        //test-console.log("UserDashMain loaded");

    }, [] );



    //Get the Course from mongodb. The general modules to be displayed on the userdashboard main section
    const getCourse = async () => {

        //configuration file for Axios to set a header line content type to application/json
        const config = {
            header: { "Content-Type": "application/json" }
        }

        try {

            //Get all the general coursework module description from mongodb via the server
            const serverData = await axios.get("/api/auth/coursework/course", config);

            setCourseModules(serverData.data.course);
             console.log("The serverData: " + JSON.stringify(serverData.data.course));
            
            setIsAuth(loginStatus);



        } catch (error) {
            console.log("This is the ERROR: " + error);
            console.log("This is the error message: " + error.response.data.message)
            setErrorMessage(error.response.data.error);
        }

    }




    //render the UI component if the props has the course module fetched from the server via the Userdashboard parent
    //component. If not show a loading text tag
    if(modulesCompleted !=null)
    { 
        return(
            <div className="userDashMainContainer">
                
                {isAuth && courseModules.map((mod) => {

                    return (
                        <div>

                            <Card 
                            key={mod.moduleId}
                            module={mod.module}
                            title={mod.title} 
                            description={mod.description}
                            lessonIds={mod.lessonIds}
                            lastLesson={lastLesson}
                            
                            modulesCompleted={modulesCompleted}
                            />

                        </div>

                    );})}
                {!loginStatus && <span>You are not logged in. Please log in.</span>}

                <br/> 

                <span style={{color: "red"}}>{errorMessage}</span>
                {errorMessage && <span>you have an error: {errorMessage}</span>}
            </div>

        );
    
    }

    return (
        <>
            <h3>Loading.......</h3>
        </>
    );
}


export default UserDashMain;
