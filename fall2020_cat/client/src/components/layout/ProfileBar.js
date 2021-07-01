import './Layout.css';
import { useContext, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
//$*import {GlobalContext} from '../../context/GlobalState'; //ignore - was used with JWT but using sessions now



/**This component is used to show if the user is logged in. It will show the user login status and logout button.
 * It is the top most horizontal menu bar and is black in color. If the user is not logined in it will show only
 * two links 'Register' and 'login'.
 */
const ProfileBar = () => {

    const { userState, logOff } = useAuth();

    const [ showMenu, setShowMenu ] = useState(false);

    const history = useHistory();


    //check if user is logged in and add an event listener to the the profile svg icon
    useEffect(() => {
        //test-console.log("ProfileBar loaded");
        //test-console.log("ProfileBar userState.loggedIn: " + userState.loggedIn);
        if ( userState.loggedIn )
        {
            //test-console.log("ProfileBar addEventListener");
            document.addEventListener('click', avatarClick);

        }

    }, [userState.loggedIn])





    const avatarClick = (event) => {
        //console.log('event.target.id:', event.target.id)

        if ( event.target.id === 'profile-icon' )
        {
            setShowMenu(!showMenu);
        }else{
            setShowMenu(false);
        }
  
    }




    //used in logout buttonn to logout, remove token, and redirect to user to "/"
    const logoutHandler = () => {
        logOff();
        setShowMenu(false)
        history.push("/");
    }




    const showProfileMenu = () => {
        return showMenu
        ?
        <div className='profile-menu'>
            <ul style={{
                display: 'flex',
                flexDirection: 'row',
                textAlign: 'center'
            }}>
                <li style={{
                    color: 'black',
                    borderBottom: '1px solid black'
                }}><Link to='/user/profile'>My Profile</Link></li>
                <li><button style={{margin: "0px 0px 5px 0px"}} onClick={logoutHandler}>Logout</button></li>
            </ul>
        </div>
        :
        null
    }




    const showRegisterAndLogin = () => {
        if (userState.loggedIn)
        {//user IS logged in
            return (
                <>
                    <li>
                    <div style={{color: 'white'}}>Logged in as <span style={{color: "orange", textTransform: "uppercase", fontSize: "20px"}}> {userState.role}:</span> <span style={{padding: "20px", fontSize: "25px", fontWeight: "bold"}}>{userState.firstName} {userState.lastName}</span></div>
                    </li>
                    <li>
                        <img style={{marginRight: "50px", marginLeft: "50px"}}
                            id='profile-icon'
                            style={{background: "white", width: "80px"}}
                            src="/profile_icon.svg" alt="profileIcon"

                            height='50px' 
                        />
                    </li>
                </>
            )
        }
        else
        {//user is NOT logged in
            return (
                <>
                    <li><Link to='/register'>Register</Link></li>
                    <li><Link to='/login'>Login</Link></li>
                </>
            )
        }
    }

    return (
        <div className='profile-bar'>
            
            <ul>
                {showRegisterAndLogin()}
            </ul>
            {userState.loggedIn && showProfileMenu()}
            {userState.loggedIn && <button className="squareLogout" onClick={logoutHandler}> logoout</button>}
        </div>
    )
}

export default ProfileBar


/*The code below was used with JWT but now has been replaced with sessions for authorization access.


const ProfileBar = (props) => {



    const { firstName, lastName, role, setUserData, lastLesson, setLastLesson, modulesCompleted, setModulesCompleted, isAuth, setIsAuth, loggedIn, loginStatus } = useContext(GlobalContext);
    const history = useHistory();
    console.log("ProfileBar1: loggedin: " + loggedIn + ", firstName: " + firstName + ", lastName: " + ", isAuth: " + isAuth + ", role: " + role);
    console.log(`ProfileBar2: lastLesson: ${lastLesson}, lastLesson.lessonId: ${lastLesson.lessonId}, modulesCompleted: ${modulesCompleted[0].moduleFinish}`);

    //When first rendering the component it checks to see if the user has already been authenticated by checking
    // if a JWT "authToken" is set. If so then the user is redirected to the root "/" home page  
    useEffect(() => {

        if(localStorage.getItem("authToken")){
            console.log("profile localStorage====");
            setIsAuth(true);
            loginStatus(true);
            
            if(firstName == 'None'){
                
                //retrieve stored variables to set Global Context
                const first = localStorage.getItem('firstName');
                const last = localStorage.getItem('lastName');
                const r = localStorage.getItem('role');

                setUserData({firstname: first, lastname: last, role: r}, true);


                const locStorLastLesson = localStorage.getItem('lastLesson');
                //convert localStorage 'lastLesson' string to JSON object
                const parsedJSONobj = JSON.parse(locStorLastLesson);
                
                setLastLesson(parsedJSONobj, true);


                const locStorModCompleted = localStorage.getItem('modulesCompleted');
                console.log("locStorModCompleted: " + locStorModCompleted);
                //convert localStorage 'modulesCompleted' string to JSON object
                const parsedLocStorModCompleted = JSON.parse(locStorModCompleted);
                console.log("parsedLocStorModCompled: " + parsedLocStorModCompleted);

                setModulesCompleted(parsedLocStorModCompleted, true);

            }
            

        }else{
            console.log("profilebar: --------");
            //no JWT so not logged in and set Global Context to nothing 
            setIsAuth(false);
            loginStatus(false);
            setUserData({
                firstname: "", 
                lastname: "", 
                role: ""}, false); 

            setLastLesson({module: 0, lessonId: 0}, false);

            setModulesCompleted([{ module: 0, lessonIds: [0], moduleFinish: false }], false);


        }
    }, []);



    //used in logout buttonn to logout, remove token, and redirect to user to "/login"
    const logoutHandler = () => {

        localStorage.removeItem("authToken");
        setIsAuth(false);
        loginStatus(false);

        setUserData({firstname: "", 
                    lastname: "", 
                    role: ""}, false);

        
        setLastLesson({module: 0, lessonId: 0});
        
        setModulesCompleted([{ module: 0, lessonIds: [0], moduleFinish: false }]);
        

        history.push("/login");
    }



    return (
        <div className='profile-bar'>


            <ul>
                {loggedIn? <li><span style={{color: "yellow", padding: "0px", fontSize: "1.5rem"}}>{role} : </span></li>: <span></span>}
                {isAuth ? <li><span style={{color: "white", padding: "0px", fontSize: "2rem"}}>{firstName} {lastName}</span></li> : <li><Link to='/register'>Register</Link></li> }
                {loggedIn ? <img style={{marginLeft: "30px", background: "white", padding: "0px"}}src="/profile_icon.svg" alt="profileIcon" height='55px'/> : <li><Link to='/login'>Login</Link></li>}
            </ul>

            {isAuth && <button style={{background: "white", fontWeight: "bold", marginLeft: "30px", marginBottom: "10px", border: "none", padding: "5px"}} 
            onClick={logoutHandler}><span style={{color: "black"}}>Logout</span></button>}

        </div>
    )
}

export default ProfileBar


*/