
import './AdminUsers.css';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import Usercard from '../usercard/Usercard';
import axios from 'axios';




/**This component is used for displaying the organizations users and their progress. It displays them in a
 * user card with their role, name, email and progress bars for each module in the course. It is only
 * accessible and displayed if the login user has the admin or instructor role
 */

const AdminUsers = () => {

    const [isAuth, setIsAuth] = useState(false);
    const [courseModules, setCourseModules] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const [organizationUsers, setOrganizationUsers] = useState([]);
    const [organizationPaid, setOrganizationPaid] = useState("");
    const [licenseTotal, setLicenseTotal] = useState(0);
    const [licenseUsers, setLicenseUsers] = useState(0);


    const { userState } = useAuth();

    //get the course modules and then the organizataion's users to display in the admin user's page for showing
    //the statistics. A bar of each module completed will be shown along with the users information
    useEffect(() => {

        console.log("AdminUsers loaded");

        //get the course modules
        getCourse();
        //get the users in the organzation based on license Id code of the logined in user
        getOrganizationUsers();

    }, []);




    
    //Get the Courses from mongodb. The general modules to be displayed on the userdashboard main section
    const getCourse = async () => {

        //configuration file for Axios to set a header line content type to application/json
        const config = {
            header: { "Content-Type": "application/json" }
        }

        try {

            //Get all the general coursework module description from mongodb via the server
            const serverData = await axios.get("/api/auth/coursework/course", config);

            setCourseModules(serverData.data.course);
            
            //test-console.log("The serverData: " + JSON.stringify(serverData.data.course));
            
            //check to see if the user is logged in and set it. This is needed to map out the users in the JSX UI
            setIsAuth(userState.loggedIn);



        } catch (error) {
            console.log("This is the ERROR: " + error);
            console.log("This is the error message: " + error.response.data.message)
            setErrorMessage(error.response.data.error);
        }

    }



    //Get the users of the organization based on the admin users email to look up the license Id number and retrieve users
    const getOrganizationUsers = async () => {

        const email = userState.email;

        const config = {
            header: {"Content-Type": "application/json"}
        }

        try {
            //axios fetch call to get the users of the organization from the server
            const organization = await axios.get(`/api/auth/userinfo/organizationusers/${email}`, config);

            //test-console.log("AdminUsers - ORGANIZATION USERS: " + JSON.stringify(organization.data.organizationUsers))
            //test-console.log("AdminUsers - ORGANIZATION PAID: " + JSON.stringify(organization.data.organization));

            //set the users of the organization
            setOrganizationUsers(organization.data.organizationUsers);

            //set the organization's name 
            setOrganizationPaid(organization.data.organization[0].organizationName);
            //set the total organization's licenses
            setLicenseTotal(organization.data.organization[0].licenseTotal);
            //set the total licenses used
            setLicenseUsers(organization.data.organization[0].licenseUsed);
            
        } catch (error) {

            console.log(error);

            setErrorMessage("Error: " + error);
        }



    }




    
    //The JSX is displayed IF the uses are axios fetched ELSE it will show a loading text tag
    if(organizationUsers !=null)
    { 
        return(

            <div className="grid-layout" >

                <div className="topTitleContainer">


                    {//Organization Name and Licenses are displayed in a borderless table for Neatness and style
                    }

                    <table style={{textAlign: "center", }}>

                        <tr >
                            <td style={{padding: "10px"}}>
                                <h1>Organization:</h1>
                            </td>
                            <td style={{padding: "10px"}}>
                                <h1><span style={{color: "black"}}>{organizationPaid}</span></h1>
                            </td>
                        </tr>
                        <tr style={{height: "10px"}}>
                            <td >
                                <h2><span style={{color: "#20374e"}}>Total Licenses: </span></h2>
                            </td>
                            <td >
                                <h2>{licenseTotal}</h2>
                            </td>
                        </tr>
                        <tr style={{height: "10px"}}>
                            <td >
                                <h2><span style={{color: "#20374e"}}>Total Used: </span></h2>
                            </td>
                            <td >
                                <h2>{licenseUsers}</h2>
                            </td>
                        </tr>

                    </table>
                    <br/>
                    
                    
                </div>
                    



                <div className="centerAdminContainer">

                    <br/>

                    {//render the users of the organization by Usercard's that display their progress and information
                    isAuth && organizationUsers.map((user) => {

                        return (
                            <div>

                                <Usercard 
                                key={user._id}
                                role={user.role}
                                firstName={user.firstName} 
                                middleName={user.middleName}
                                lastName={user.lastName}
                                email={user.email}
                                
                                userModulesCompleted={user.modulesCompleted}

                                courseModules={courseModules}
                                />

                            </div>

                        );})}

                    {!isAuth && <span>You are not logged in. Please log in.</span>}

                    <br/> 

                    <span style={{color: "red"}}>{errorMessage}</span>
                    
                    {errorMessage && <span>you have an error: {errorMessage}</span>}



                </div>





            </div>

        );
    
    }

    return (
        <>
            <h3>Loading.......Admin Users</h3>
        </>
    );
}





export default AdminUsers;