import './Userdashboard.css'
import { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UserDashMain from './UserDashMain';
import { useAuth } from '../../context/AuthProvider';

//$*import { GlobalContext } from '../../context/GlobalState';
import UserDashNavbar from './UserDashNavbar';//not used in this parent component
import Sidebar from './Sidebar';//not used in this parent component
//comment code with $* was used with JWT but now the app uses express-sessions so no longer needed





/**This component is used to as the user's dashboard. They are redirect to this component by the login. 
 * The shows all the coursework modules that the user can take. It fetches them from the server and is displayed
 * in a card format inside the child component UserDashMain. It implemented a sidebar and userdashboard menu
 * but is taken out and no longer used.
 */
const Userdashboard = () => {

    const [loginStatus, setLoginStatus] = useState(false);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { loggedIn, lastLesson, modulesCompleted, userState } = useAuth();//useContext(GlobalContext);

    const history = useHistory();



    useEffect(() => {

        //test-console.log("Userdashboard loaded");

        if(!userState.loggedIn){
            history.push('/login');
        }

        //test-console.log("Userdashboard modulesCompleted: " + JSON.stringify(modulesCompleted));

        //$*if(localStorage.getItem("authToken")){
        //$*    setLoginStatus(true);
        //$*}



    }, []);



    const openSidebar = () => {
        setSidebarOpen(true);
        console.log(true);
    }
    const closeSidebar = () => {
        setSidebarOpen(false);
        console.log(false);
    }

    //$*<UserDashNavbar sideBarOpen={sidebarOpen} openSidebar={openSidebar}/>
            
    //$*<Sidebar sideBarOpen={sidebarOpen} closeSidebar={closeSidebar}/>

    return(  

        <div className="dashContainer">
       
            <UserDashMain loginStatus={loggedIn} lastLesson={lastLesson} modulesCompleted={modulesCompleted}/>

        </div>


    );
}



export default Userdashboard;