import "./Userdashboard.css";



/**This component is used to show a horizontal menu with associated links in the parent 
 * component Userdashboard but is not used in the web application.
 */
const UserDashNavbar = ({sideBarOpen, openSidebar}) => {

    return(

        <nav className="navbar usernavbar">

            <div className="navbar_icon" >
               <a href="#" onClick={() => openSidebar()}><img src="./threelines.svg" alt="image" width='40px'/></a> 
            </div>

            <div className="navbar__left">
                <a href="#">logout</a>
            </div>

            <div className="navbar__right active_link">
                <a href="#">Continue Lesson</a>
            </div>


        </nav>

    );


}





export default UserDashNavbar;