import './Card.css';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';





/**This component is used to display the modules of the course and user progress in a card format. 
 * It is used in the Userdashboard's child component UserDashMain. It gets its data via the props from
 * the UserDashMain. Each course module is represented with one card.
 */
const Card = ({ module, title, description, lessonIds, lastLesson, modulesCompleted }) => {

    const [startModule, setStartModule] = useState(false);
    const [completedModule, setCompletedModule] = useState(false);
    const [inprogressModule, setInprogressModule] = useState(false);
    const [nextModule, setNextModule] = useState(true);
    const [progressPercent, setProgressPercent] = useState(0)


    //when module first mounts check for modules status of user by running the function
    useEffect(() => {
        
        checkModuleUserStatus();


    }, []);




    //to see the status of each module for the user whether they have completed, inprogress, or yet to take next
    const checkModuleUserStatus = () => {

        modulesCompleted.forEach( userModCompleted => {
            /*test-to get the progress bar to work by finding variables and setting percentages
            console.log(userModCompleted);
            console.log("modulesCompleted userModCompleted: " + userModCompleted.lessonIds + " length: " + userModCompleted.lessonIds.length);
            console.log("mod.module:" + module + " lessonIds: " + lessonIds + " lenght: " + lessonIds.length);
            console.log(Math.round(((userModCompleted.lessonIds.length)/lessonIds.length) * 100));
            */
            
            if(userModCompleted.module == module){

                let progressPercent = Math.round(((userModCompleted.lessonIds.length - 1)/lessonIds.length) * 100);

                setProgressPercent(progressPercent);

                console.log("MATCH " + userModCompleted.moduleFinish);
                if(userModCompleted.moduleFinish){

                    setCompletedModule(true);
                    setNextModule(false);
                    setStartModule(false);

                }else if(userModCompleted.lessonIds[0] == 0){
                    
                    setCompletedModule(false);
                    setNextModule(false);
                    setStartModule(true);
                    
                }else{

                    setInprogressModule(true);
                    setNextModule(false);
                    setStartModule(false);
                }

            }

        });

    }




return(
    <div className="cardContainer">
        

        <div className="cardTitle">
            <h2>Module {module}</h2>
            
            <h4>{title}</h4>
        </div>



        <div className="cardDescription">
            <p>{description}</p>
            
        </div>



        <div className="progressBox">
            <p>Progress Bar</p>
            <progress value={progressPercent} max="100"/>    

        </div>


            
        <div className="completedBox" className={nextModule ? 'bgRed': startModule ? 'bgGreen' : completedModule ? 'bgLightskyblue' : 'bgYellow'} >

            {startModule && <span style={{color: "green"}}><h3>status: Start</h3></span>}
            {completedModule && <span style={{color: "lightskyblue"}}><h3>status: Completed</h3></span>}
            {inprogressModule && <span style={{color: "yellow"}}><h3>status: In Progress</h3></span>}
            {nextModule && <span style={{color: "red"}}><h3>status: Next</h3></span>}

        </div>




        <div className="card-btn">

            {completedModule && <button><Link to={ 
                {
                    pathname : "/presentor", 
                    state: {
                        module: module
                    }
            } 
                }>Click to Restart</Link></button>}



           
            {inprogressModule && <button><Link to={ 
                {
                    pathname : "/presentor", 
                    state: {
                        lastLesson: lastLesson
                    }
            } 
                }>Click HERE to Continue</Link></button>}


            {startModule && <button><Link to={ 
                {
                    pathname : "/presentor", 
                    state: {
                        module: module
                    }
            } 
                }><h2>Click HERE to Start</h2></Link></button>}



            
            {nextModule && <button><a >Not Available</a></button>}
                
        </div>

    </div>

);


}


export default Card;
