import React, {createContext, useReducer, useState} from 'react';
import AppReducer from './AppReducer';


/**This global context component is no longer used. It has been replaced by the AuthProvider that now holds all
 * the global context, functions, and reducer functions. It was originally used with JWT. Noew that
 * the web application is using express-sessions, JSON Web Tokens is no longer needed for authentication and
 * authorization.
 */


//Initial State
const initialState = {

    firstName: "None",
    lastName: "None",
    role: "None",

    loggedIn: false,

    lastLesson: {module: 0, lessonId: 0},
    modulesCompleted: [{ module: 0, lessonIds: [0], moduleFinish: false }]

}





//Create Context
export const GlobalContext = createContext(initialState);




//Provider Component
export const GlobalProvider = ({children}) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    const [isAuth, setIsAuth] = useState(false);




    //Actions
    const loginStatus = (status) => {
        dispatch({
            type: 'LOGIN_STATUS',
            payload: status
        });
    }

    //Dispatch to save user data and store in local storage to prevent loss on browser reload
    const setUserData = ({firstname, lastname, role}, loginStatus) => {
        dispatch({
            type: 'USER_DATA',
            payload: {firstname, lastname, role}

        });
        //store state variables into localstorage to prevent loss on browser reload
        if(loginStatus){
            localStorage.setItem('firstName', firstname);
            localStorage.setItem('lastName', lastname);
            localStorage.setItem('role', role);

        }else{
            localStorage.removeItem('firstName');
            localStorage.removeItem('lastName');
            localStorage.removeItem('role');
        }

    }


    //Dispatch to save last lesson data and store in local storage to prevent loss on browser reload
    const setLastLesson = ({module, lessonId}, loginStatus) => {

        dispatch({
            type: 'LAST_LESSON',
            payload: { module, lessonId }
        });

        //save state variables into localstorage to prevent loss on browser reload
        if(loginStatus){
            //convert to JSON object to get ready for storage
            const jsonObj = {module, lessonId};
            //convert to string because only strings can be used in localStorage
            const stringObj = JSON.stringify(jsonObj);

            localStorage.setItem('lastLesson', stringObj);

        }else{

            localStorage.removeItem('lastLesson');

        }

    }








    //Dispatch to save modules completed data and store in local storage to prevent loss on browser reload
    const setModulesCompleted = (modulesarray, loginStatus) => {
        console.log("GlobalState modulesarray: +++++ " + modulesarray);

        dispatch({
            type: 'MODULES_COMPLETED',
            payload: modulesarray

        });
         //store state variables into localstorage to prevent loss on browser reload
         if(loginStatus){
            //convert to JSON object to get ready for storage
            const jsonObj = modulesarray;
            console.log("jsonObj: " + jsonObj);
            //convert to string because only strings can be used in localStorage
            const stringObj = JSON.stringify(jsonObj);
            console.log("stringObj: " + stringObj)

            localStorage.setItem('modulesCompleted', stringObj);
        }else{
            localStorage.removeItem('modulesCompleted');
        }


    }





    return(
        <GlobalContext.Provider value={{
            firstName: state.firstName,
            lastName: state.lastName,
            role: state.role,
            loggedIn: state.loggedIn,
            lastLesson: state.lastLesson,
            modulesCompleted: state.modulesCompleted,

            isAuth,
            setIsAuth,

            loginStatus,
            setUserData,
            setLastLesson,
            setModulesCompleted
        }}>

            {children}

        </GlobalContext.Provider>
    );
}







