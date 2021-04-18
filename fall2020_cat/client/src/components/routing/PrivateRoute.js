import {Redirect, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';



/**This component is used to replace the <Route...> component in the App.js or anywhere you need authentication.
* Originally it used JWT but now uses sessions. If the authentication is not set then it redirects 
* the user to Login.js page.
*/
const PrivateRoute = ({ component: Component, path}) => {

    const { userState } = useAuth();
   
    //console.log("PrivateRoute userState.loggedIn: " + userState.loggedIn);



    return(        
    <Route 
        path={path}
        render = {props => (
            userState.loggedIn 
            ?
                <Component {...props} />
            :
                (userState.loggedIn === null 
                ? 
                    <div className='loading-grid-layout'>
                        <h1>LOADING</h1>
                    </div> 
                : 
                    <Redirect to='/login' />)
        )}
    />
    );
};




export default PrivateRoute;


    /**
     * login authorization using JSON web tokens but replaced with express sessions
     * 
     * const PrivateRoute = ({ component: Component, ...rest }) => {
        <Route {...rest} 
            render = {
                (props) => 
                //check for Json Web Token ("authToken") is set. If set then renders the component route otherwise redirct to Login.js
                //$*localStorage.getItem("authToken") ? 
                userState.loggedIn ?
                (<Component {...props}/> ) :
                    (<Redirect to={rest.redirLink} /> )//$*{ history.goBack()}} />)
            }
        />
     */