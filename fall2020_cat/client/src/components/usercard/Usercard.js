
import './Usercard.css';
import { useState, useRef } from 'react';




/**This component is used to display the users information and course module progress in a card format.
 * It is used in the AdminUsers module to display all the organization's users. It will only be used
 * if the login user has the role of admin or instructor
 */
const Card = ({ role, firstName, middleName, lastName, email, courseModules, userModulesCompleted }) => {

    const [isAuth, setIsAuth] = useState(true);

    //the modules the user has taken so far
    const userModsCompletedTotalRef = useRef(userModulesCompleted.length);

    //total lesson taken in module progress bar
    let userLessonsTakenRef = useRef(0);
    //total lessons in the module
    let totalModuleLessonsRef = useRef(0);
    //percent value to display in the progress bar
    let valueRef = useRef(0);




    //to calculate percent value in the progress bar of each module for the user and display it on the card 
    //for the admin to view. It is based on the number of modules the user has taken
    const valueModulePercent = ( userModule, module, index) => {

        //zero based index and add one to count modules user has taken to compare with total course modules
        let moduleNumber = index + 1;

        //test-console.log("VMP func - index: " + index + " moduleNumber: " + moduleNumber);

        let value = 0;

        let dividend = 0;

        //length of the total lessons in the current module progress bar to be displayed
        const divisor = module.lessonIds.length;
        totalModuleLessonsRef.current = divisor;
        //test-console.log("VMP func - totalModuleLessonsRef: " + totalModuleLessonsRef.current);

        //calculate the user value percentage else the user ran out of modules taken and set value to 0
        if(moduleNumber <= userModsCompletedTotalRef.current){

            dividend = (userModule[index].lessonIds.length) - 1;
            //test-console.log("dividend: " + dividend);

            userLessonsTakenRef.current = dividend;

            value = ((dividend/divisor) * 100);
            //test-console.log("value: " + value);
            
        }else{
            //user hasn't completed this high of modules so this one is zero
            value = 0;
            userLessonsTakenRef.current = value;
        }

        return value;
        
    }




return(

    <div className="usercardContainer">
        

        <div className="usercardTitle">
            <h2>Role: <span style={{color: "orange"}}>{role}</span></h2>
            
            <h3><span style={{color: "#20374e"}}>Name: </span>{firstName} {middleName} {lastName}</h3>

            <h3><span style={{color: "#20374e"}}>Email: </span>{email}</h3>
        </div>


        <div className="usercardDescription">
            <span>User Module Progress Statistics</span>
        </div> 



        <div className="usercardProgressBox">

            {//Map out the course modules and display the user progress bar based on the modules taken
            }
            {isAuth && courseModules.map((module, index) => {

                {/*test-console.log("userModsCompletedTotalRef: " + userModsCompletedTotalRef.current + " ====") }
                console.log("firstName: "+ firstName + " module: " + (index + 1))
                console.log(JSON.stringify(userModulesCompleted))
                */}
  

                {   //set the value of the percentage without rerendering the component because no state change
                    valueRef.current = valueModulePercent(userModulesCompleted, module, index)
                    //test-console.log("valueRef.current: " + valueRef.current);
                }

                return (
                    <div>

                        <p><span style={{color: "orange"}}>module {(index + 1)}: </span> {userLessonsTakenRef.current}/{totalModuleLessonsRef.current}</p>

                        <progress value={ valueRef.current } max="100" />   

                    </div>

                );})}




        </div>  


    </div>

);


}





export default Card;

