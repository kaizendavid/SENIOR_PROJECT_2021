
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
//nnnnnimport { useTitle } from '../../context/TitleProvider'
import React, { useState, useEffect } from 'react';





/**This component is used to display the navigation links. It is the blue horizantal menu bar that is second
 * from the top below the ProfileBar. It show links depending on what Route the user is currently in.
 * Regular user get one set of links, users get another set, and the Admin get another set. These links
 * correspond to the level of access they will have to the the apps functions and UI
 */
const Navbar = () => {
    const [ links, setLinks ] = useState([{name: 'Home', to: '/'}]);
    const [ title, setTitle ] = useState('TITLE');

    // on initial Navbar component load, determine what location we're at and set links accordingly
    const location = useLocation();

    // get user logged in state from auth context to aid in link building
    const { userState } = useAuth();



    useEffect(() => {
        setLinks([{name: 'Home', to: '/'}]);

        // on link or user change, reset links and title, then determine them again
        // must be set in this specific order as React batches state changes, but keeps order
        // so we also must use previous state in setState functions
        determineLinks()
    }, [location.pathname, userState.loggedIn]);





    const determineLinks = () => {
        if ( location.pathname === '/progress' || location.pathname === '/userdashboard' || location.pathname === '/presentor' )
        {
            if ( userState.role === 'admin' || userState.role === 'instructor' )
            {
                setTitle("Admin Dashboard");

                setLinks(prev => [...prev, 
                    {name: 'Users Statistics', to:'/adminusers'},
                    {name: 'My Profile', to:'/myprofile'},
                    {name: 'My Dashboard', to:'/userdashboard'}
                ]);
            }
            else
            {
                setTitle("Userdashboard");

                setLinks(prev => [...prev, 
                    {name: 'My Profile', to:'/myprofile'},
                    {name: 'My Dashboard', to:'/userdashboard'}
                ]);
            }
        }
        else if ( location.pathname === '/myprofile' )
        {
            setTitle("My Profile");

            setLinks(prev => [...prev, 
                {name: 'My Dashboard', to:'/userdashboard'}
            ]);
        }
        else if ( location.pathname === '/adminusers' )
        {
            setTitle("Users Statistics");

            setLinks(prev => [...prev, 
                {name: 'My Profile', to:'/myprofile'},
                {name: 'My Dashboard', to:'/userdashboard'}
            ]);
        }
        else
        {
            if ( userState.loggedIn )
            {
                setTitle("Welcome");

                setLinks(prev => [...prev,         
                    {name: 'About Us', to: '/aboutus'},
                    {name: 'My Profile', to:'/myprofile'},
                    {name: 'My Dashboard', to:'/userdashboard'},
                    {name: 'Contact', to: '/contactus'}
                ]);
            }
            else
            {
                setTitle("Safety Always ");
                
                setLinks(prev => [...prev,         
                    {name: 'About Us', to: '/aboutus'},
                    {name: 'Training Videos', to: '/traininginfo'},
                    {name: 'Contact', to: '/contactus'}
                ]);
            }
        }

        //console.log(`location.pathname === '/'`, location.pathname === '/')
        //console.log('location.pathname:', location.pathname)
    }




    // go through our link state and create a button for each one
    const showNavButtons = () => {
        return links.map(btn => <li key={btn.to}><Link to={btn.to}>{btn.name}</Link></li>);
    }








    return (
        <nav className="navbar">
            <div className='nav-title'>
                
                <span style={{float: "left!important", fontWeight: "bold", fontSize: "larger", opacity: "90%", color: "orange", marginRight: "20px"}} >
                    {title}
                </span>
                
            </div>

            <ul>
                {showNavButtons()}
            </ul>
        </nav>
    )
}





export default Navbar;
