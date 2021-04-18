import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { loginUser, logoutUser, authenticateUser } from '../services/authService';
import AppReducer from '../context/AppReducer';
//import axios from 'axios'; server request are done through authService




/**This component is used to hold the Global Context State variables. It wraps all the web application
 * components inside the App.js and routes. It authenticates the user using the authService component.
 * From here it sets the state variables using the AppReducer
 * 
 */






//initial State
const initialState = {
    email: "",
    role: "",
    loggedIn: false,

    firstName: "None",
    lastName: "None",
    role: "None",
    lastLesson: {module: 0, lessonId: 0},
    modulesCompleted: [{ module: 0, lessonIds: [0], moduleFinish: false }]
}





//create context and export function
const AuthContext = createContext(initialState);


//function that gives access to context
export const useAuth = () => {
    return useContext(AuthContext);
}







//AuthProvider to provide Global Provider Context for the application to check is the user is logged in a session
export const AuthProvider = ({ children }) =>{

    const [isAuth, setIsAuth] = useState(false);

    const [userState, dispatch] = useReducer(AppReducer, initialState);




    useEffect(() =>{
        //check if an existing session exist. Used when user refreshes that page because React loses all state
        getExistingSession();

    }, []);






    //Check if there is an existing session on the server. If so then set all the users information from 
    //local storage
    const getExistingSession = async () => {

        try {
            const authServiceResponse = await authenticateUser();
            console.log("AuthProvider UseEffect authServiceResponse:", authServiceResponse);

            if(authServiceResponse.data.email){

                setExistingUser(authServiceResponse.data.email, authServiceResponse.data.role);

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


            }else{
                console.log("AuthProvider getExistingSession: none exists");
                setNoExistingUser();
                setUserData({firstname: "", lastname: "", role: ""}, false);
                setLastLesson({}, false);
                setModulesCompleted([], false);
            }
            

        } catch (error) {
            console.log("AuthProvider getExistingSession Error: " + error);
            setNoExistingUser();
        }
    }









    //ACTIONS for the useReducer to change auth context global state===============
    const setExistingUser = (email, role) => {
        dispatch({
            type: 'LOGIN_USER',
            payload: {
                email: email,
                role: role
            }
        })
    }

    const setNoExistingUser = () => {
        dispatch({
            type: 'LOGOFF_USER'
        });
    }


    
    
    //FUNCTIONs used in the application to change Global state variables==========================
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
        console.log("AuthProvider setting module: " + module + ", lastLessonId: " + lessonId);
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
        console.log("AuthProvider GlobalState modulesarray: +++++ " + modulesarray);

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






    
    //Dispatch to add a lessonId to the modulesCompleted array to add to the user progress
    const addLessonIdToModuleCompleted = (currentModule, currentStepPosition) => {
        console.log("1 AuthProvider GlobalState addLessonIdToModuleCompleted - currentModule: " + currentModule + " currentStepPosition: " + currentStepPosition);

        dispatch({
            type: 'ADD_LESSON_ID',
            payload: {currentModule, currentStepPosition}
        });

        console.log("3 modulesCompleted: " + JSON.stringify(userState.modulesCompleted));

        //store state variables into localstorage to prevent loss on browser reload
        if(userState.loggedIn){
            //convert to JSON object to get ready for storage
            const jsonObj = userState.loggedIn;
            console.log("jsonObj: " + jsonObj);
            //convert to string because only strings can be used in localStorage
            const stringObj = JSON.stringify(jsonObj);
            console.log("stringObj: " + stringObj)

            localStorage.setItem('modulesCompleted', stringObj);
        }else{
            localStorage.removeItem('modulesCompleted');
        }

    }

    //Dispatch to set that the module has be finished by setting moduleFinish: true
    const setModuleFinished = (currentModule, finished) => {
        console.log("1)AuthProvider GlobalState setModuleFinished - currentModule: " + currentModule + " finished: " + finished);

        dispatch({
            type: 'MODULE_FINISHED',
            payload: {currentModule, finished}
        });

        console.log("3)moduleFinish modulesCompleted: " + JSON.stringify(userState.modulesCompleted));

        //store state variables into localstorage to prevent loss on browser reload
        if(userState.loggedIn){
            //convert to JSON object to get ready for storage
            const jsonObj = userState.modulesCompleted;
            console.log("jsonObj: " + jsonObj);
            //convert to string because only strings can be used in localStorage
            const stringObj = JSON.stringify(jsonObj);
            console.log("stringObj: " + stringObj)

            localStorage.setItem('modulesCompleted', stringObj);
        }else{
            localStorage.removeItem('modulesCompleted');
        }

    }

    //Dispatch to add the next new module once one is completed to update user progress and let the next module be accessible
    const addNextModule = ( { module, lessonIds, moduleFinish}) => {
        console.log("4)AuthProvider GlobalState newModule: module: " + module + " lessondIds: " + " moduleFinish: " + moduleFinish);

        dispatch({
            type: 'ADD_NEW_MODULE',
            payload: { module, lessonIds, moduleFinish }
        });

        console.log("6)moduleFinish modulesCompleted: " + JSON.stringify(userState.modulesCompleted));

        //store state variabless new updated 'modulesCompleted into localstorage to prevent loss on browser reload
        if(userState.loggedIn){
            //convert to JSON object to get ready for storage
            const jsonObj = userState.modulesCompleted;
            console.log("jsonObj: " + jsonObj);
            //convert to string because only strings can be used in localStorage
            const stringObj = JSON.stringify(jsonObj);
            console.log("stringObj: " + stringObj)

            localStorage.setItem('modulesCompleted', stringObj);
        }else{
            localStorage.removeItem('modulesCompleted');
        }

    }










    //functions to pass to children and manage authorization global state
    const logIn = async ({email, password}) => {
        console.log("AuthProvider logIn");
        let loginAuthServiceResponse;

        try {

            loginAuthServiceResponse = await loginUser({email, password});

            console.log("loginIn loginAuthServiceResponse: " + loginAuthServiceResponse);


            if(loginAuthServiceResponse.data.email){

                //set auth context user to logged in
                dispatch({
                    type: 'LOGIN_USER',
                    payload: {
                        email: loginAuthServiceResponse.data.email,
                        role: loginAuthServiceResponse.data.role
                    }
                });

                return loginAuthServiceResponse;
            }

        } catch (error) {

            console.log(error);

            console.log("AuthProvider credential loginIn problem - loginResponse Error: " + error);
            return error;
            
        }
        

      
    }





    const logOff = async () => {

        let logoffAuthServiceResponse;
        
        //set auth context user logged off
        if(userState.loggedIn){

            logoffAuthServiceResponse = await logoutUser();
            console.log("AuthProvider logoffAuthServiceResponse: " + logoffAuthServiceResponse);

            dispatch({
                type: 'LOGOFF_USER'
            });

            //remove persistent storage of user lesson information data
            localStorage.removeItem('firstName');
            localStorage.removeItem('lastName');
            localStorage.removeItem('role');
            localStorage.removeItem('lastLesson')
            localStorage.removeItem('moduleCompletion')
            localStorage.removeItem('moduleContent')

            console.log("AuthProvider logoff logoffAuthServiceResponse.data.success: " + logoffAuthServiceResponse.data.success);

        }else{
            
            console.log("AuthProvider couldn't logout user due to error");
            return logoffAuthServiceResponse;
        }
    }







    return(

        <AuthContext.Provider value={{
            userState,
            logIn,
            logOff,
            loginStatus,

            email: userState.email,
            firstName: userState.firstName,
            lastName: userState.lastName,
            role: userState.role,
            loggedIn: userState.loggedIn,
            lastLesson: userState.lastLesson,
            modulesCompleted: userState.modulesCompleted,

            isAuth,
            setIsAuth,

            setUserData,
            setLastLesson,
            setModulesCompleted,
            addLessonIdToModuleCompleted,
            setModuleFinished,
            addNextModule
        }}>

        {children}
        
        </AuthContext.Provider>

    );

}











