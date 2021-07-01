import './Userdashboard.css'




/**This component is used to render a side bar menu if the user view port is a mobile screen.
 * It is not used in the web application
 */
const Sidebar = ({sideBarOpen, closeSidebar}) => {



return(

        <div className={sideBarOpen ? "sidebar_responsive" : "" } id="sidebar">

            <div className="navbar_icon" id="sidebarIcon" onClick={() => closeSidebar()}>
                <img src="./closetimes.svg" alt="image" width='40px'/>
            </div>


            <div className="sidebar__menu">
                <div className="sidebar__link active_menu_link">
                    <a href='#'>Profile</a>
                </div>
            </div>

            <div className="sidebar__menu">
                <div className="sidebar__link">
                    <a href='#'>Statistics</a>
                </div>
            </div>

            <div className="sidebar__menu">
                <div className="sidebar__link">
                    <a href='#'>Certificate</a>
                </div>
            </div>

        </div>

    );

}



export default Sidebar;
