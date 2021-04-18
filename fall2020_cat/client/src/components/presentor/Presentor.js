import '../../App.css';
import './Presentor.css';
import { useLocation, useHistory } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

import VoiceOver from '../voiceover/VoiceOver';
import Text from  '../text/Text';
import Video from '../video/Video';
import Slides from '../slides/Slides';
import Assessment from '../assessment/Assessment';

import { useAuth } from '../../context/AuthProvider';





/**This component is used to show the module lessons to the user. It has other components that are rendered
 * based what lesson that is fetched from the backend mongo database of modules lesson. The module lessons
 * are retrieved based on the module number, lessonid number, and stepPosition number. If components consists
 * of voice over, text, video, slides, and assessment and is rendered by the 'type' of json lesson recieved.
 */
const Presentor = () => {

    const { email, userState, lastLesson, modulesCompleted, setLastLesson, addLessonIdToModuleCompleted, setModuleFinished, addNextModule } = useAuth();

    const [start, setStart] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [courseContent, setCourseContent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [isCompletedModule, setIsCompletedModule] = useState(false);
    const [inProgressModule, setInProgressModule] = useState(false);

    const [voiceOverComponent, setVoiceOverComponent] = useState(false);
    const [textComponent, setTextComponent] = useState(false);
    const [videoComponent, setVideoComponent] = useState(false);
    const [slidesComponent, setSlidesComponent] = useState(false);
    const [assessmentComponent, setAssessmentComponent] = useState(false);


    const [presentor, setPresentor] = useState("Presentor");
    const [stepPosition, setStepPosition] = useState(0);
    const [currentModule, setCurrentModule] = useState(0);
    const [contentType, setContentType] = useState("none");
    //const [nextStepPosition, setNextStepPosition] = useState(0);



    const location = useLocation();//used to get card paramters passed in
    const history = useHistory();//used to push user to other Routes if needed
    const lessonStepRef = useRef(0);//used to keep track of where the user is in the lessons order of the module
    const lastModuleLessonTypeRef =  useRef("text");
    

    useEffect(() => {

        //Get modules when the component first loads based on the location parameters
        if(location.state){
            getModules();
        }
        
    }, [])







    
    
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //This method gets the module from the server. It gets the last lesson the user did or the lesson from the 
    //module that starts. 
    const getModules = async () => {

        //these are the parameters sent from the cards in the userdashboard. The parameters in 'location'
        let cardModule;
        let cardLessionId;


        //This checks if its from completed modules and finds the module and lessonId
        if(location.state.module){
            
            setIsCompletedModule(true);
            
            cardModule = location.state.module;

            setCurrentModule(cardModule);

            cardLessionId = 1;

            //test-console.log(location);
            //test-console.log("isComplete: " + isCompletedModule);
            //test-console.log("cardModule: " + cardModule + ", cardLessionId: " + cardLessionId);

        }
        
        //this checks if its from Inprogress modules where the user last left off. Module and lessonId
        if(location.state.lastLesson){
            
            setInProgressModule(true);
            
            cardModule = location.state.lastLesson.module;

            setCurrentModule(cardModule);

            cardLessionId = location.state.lastLesson.lessonId;

            //test-console.log(location);
            //test-console.log("inProgress: " + inProgressModule);
            //test-console.log("cardModue: " + cardModule + ", cardLessionId: " + cardLessionId);

        }




        const config = {
            header: {"Content-Type": "application/json"}
        }

        let serverDataModules;

        try{
            //Fetch module lesson from the server based on the module number and lesson id
            serverDataModules = await axios.get(`api/auth/coursework/modules/${cardModule}/${cardLessionId}`, config);

            //test-console.log("serverDataModules : " + serverDataModules);
            //test-console.log(serverDataModules.data.courseModule.lessonType);

            setContentType(serverDataModules.data.courseModule.lessonType);

            lastModuleLessonTypeRef.current = serverDataModules.data.courseModule.lessonType;


            //Set the lesson course content to be displayed in the Presentor component for the user
            setCourseContent(serverDataModules.data.courseModule)
            setStepPosition(serverDataModules.data.courseModule.stepPosition);
            lessonStepRef.current = lessonStepRef.current + serverDataModules.data.courseModule.stepPosition;
            

        }catch(error){
            console.log(JSON.stringify(error));
            //show error in the form
            setErrorMessage(error.response.data.error);

        }

    }//getModules






    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //This function is sent by props to the children lesson components and is trigger when the user wants to 
    //move forward to the next lesson step.
    const nextLesson = async () => {

        setPresentor("next Lesson button clicked");
        
        //This sets the course content to null so that it will not cause conflicts with any component that is
        //currently rendered. Since each component is slighlty different the data coming may cause rendereng errors
        setCourseContent(null);

        let currentStepPosition = lessonStepRef.current;
        let nextStepPosition = lessonStepRef.current + 1;
        console.log("NEXT lessonStepRef.current: " + lessonStepRef.current);
        //lessonStepRef.current = nextStepPosition;
        //setNextStepPosition(stepPosition + 1);

        
        //test-console.log("NEXT stepPosition: " + stepPosition + " currentStepPosition " + currentStepPosition + " NEXT nextStepPosition: " + nextStepPosition);
        
        const config = {
            header: {"Content-Type": "application/json"}
        }


        let serverDataModules;//content from server
        let contentType;//used to check lesson content type to send to component

        try{

            if(lastModuleLessonTypeRef.current != 'assessment'){
                //get the next module lesson to render in the Presentor components
                serverDataModules = await axios.get(`api/auth/coursework/nextmodule/${currentModule}/${nextStepPosition}`, config);


                //test-console.log("PRESENTOR - currentModule: " + currentModule + ", lastLesson.module: " + lastLesson.module);
                //test-console.log("PRESENTOR - currentStepPosition: " + currentStepPosition + ", lastLesson.lessonId: " + lastLesson.lessonId);
                
                
                
                //this code is used to update the user progress. The last lessson and add the lesson id to the user
                if(currentModule >= lastLesson.module && currentStepPosition > lastLesson.lessonId){

                    setLastLesson({module: currentModule, lessonId: currentStepPosition}, true);

                    //test-console.log("PRESENTOR* - Set last lesson to currentStepPosition: " + currentStepPosition);
                    //test-console.log("PRESENTOR* - changed lastLesson.module: " + lastLesson.module + " lastLesson.lessonId: " + lastLesson.lessonId);

                    //the went onto a new lessonId we need to update the authProvider global userState context
                    //user's modulesCompleted.module.lessonIds array nextStepPosition (assessment)
                    addLessonIdToModuleCompleted(currentModule, currentStepPosition);
                    console.log("4 modulesCompleted: " + JSON.stringify(userState.modulesCompleted));

                    //save user progress info 'currentStepPosition/stepPosition/lessonId' and last lesson  
                    //AXIOS PATCH to update user progress json object. Axios will set the content-type header to application/json
                    const userUpdateProgressResponse = await axios.patch("/api/auth/coursework/updateprogress", { email, currentModule, currentStepPosition });
                    
                    console.log(userUpdateProgressResponse.data.message);
                } 
               
            }else{
                //test-console.log("Assessment is Finished --- currentStepPosition: " + currentStepPosition);

                //they passed the last lesson which is the Assessment quizzes so add this lessonid to the 
                //user's modulesCompleted.module.lessonIds array nextStepPosition (assessment) and update the
                //server with an Axios call to the associated endpoint
                addLessonIdToModuleCompleted(currentModule, currentStepPosition);
                setLastLesson({module: currentModule + 1, lessonId: 0}, true);
                
                const userUpdateProgressResponse = await axios.patch("/api/auth/coursework/updateprogress", { email, currentModule, currentStepPosition });

                //test-console.log(userUpdateProgressResponse.data.message);

                //and set modulesCompleted.module.moduleFinished true boolean so it updates the cards on the userdashboard
                const finished = true;
                setModuleFinished(currentModule, finished);
                
                //add to array modulesCompleted: {module: currentModule + 1, lessonIds: [0], moduleFinished: false}
                //so the authProvider global userState context has been updated
                addNextModule({ module: currentModule + 1, lessonIds: [0], moduleFinish: false });

                //test-console.log("7)Assessment is Finished --- added newModule modulesCompleted: " + JSON.stringify(userState.modulesCompleted));

                
                //AXIOS make the axios calls to update user progress that they finished the module
                const userFinishedModule = await axios.patch("/api/auth/coursework/modulefinished", { email, currentModule, currentStepPosition });

                //test-console.log(userFinishedModule.data.message);
                //test-console.log("Finished Module and added => modulesCompleted: " + JSON.stringify(userState.modulesCompleted));
                
                //redirect user to user dashboard
                return history.push("/finishedmodule");

            }
            //test-console.log("NEXT serverDataModules : " + JSON.stringify(serverDataModules));

            lastModuleLessonTypeRef.current = serverDataModules.data.courseModule.lessonType;

            setStepPosition(serverDataModules.data.courseModule.stepPosition);

            lessonStepRef.current = serverDataModules.data.courseModule.stepPosition;

            //test-console.log("NEXT serverDataModules.courseModule.contentType: " + serverDataModules.data.courseModule.lessonType);
            //test-console.log("NEXT contentType: " + contentType);
           

            contentType = serverDataModules.data.courseModule.lessonType;

            //Render the appropriate component to show the lesson data based on the type, turn off all else
            if(contentType == "voice over"){
                setVoiceOverComponent(true);
                setTextComponent(false);
                setVideoComponent(false);
                setSlidesComponent(false);
                setAssessmentComponent(false);

            }else if(contentType == "text"){
                setVoiceOverComponent(false);
                setTextComponent(true);
                setVideoComponent(false);
                setSlidesComponent(false);
                setAssessmentComponent(false);

            }else if(contentType == "video"){
                setVoiceOverComponent(false);
                setTextComponent(false);
                setVideoComponent(true);
                setSlidesComponent(false);
                setAssessmentComponent(false);

            }else if(contentType == "slides"){
                setVoiceOverComponent(false);
                setTextComponent(false);
                setVideoComponent(false);
                setSlidesComponent(true);
                setAssessmentComponent(false);

            }else if(contentType == "assessment"){
                setVoiceOverComponent(false);
                setTextComponent(false);
                setVideoComponent(false);
                setSlidesComponent(false);
                setAssessmentComponent(true);

            }else{
                
                setErrorMessage("No component type set for Presentor to render");
            }

            console.log("Boolean voice component: " + voiceOverComponent);
            console.log("Boolean text component: " + textComponent);

            
            //set module lesson content for the component to display
            setCourseContent(serverDataModules.data.courseModule);


        }catch(error){
            console.log(error);
            //show error in the form
            setErrorMessage(error.response.data.error);

        }


    }//nextLesson






    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //This function is sent by props to the children lesson components and is trigger when the user wants to 
    //move backwards to a previous lesson step.
    const previousLesson = async () => {

        setPresentor("previous Lesson button clicked");

        let previousStepPosition = lessonStepRef.current - 1;//stepPosition - 1;

 //let nextStepPosition = 
        //lessonStepRef.current = previousStepPosition;//nextStepPosition;

        console.log("PREVIOUS previousStepPosition: " + previousStepPosition + ", stepPosition: " + stepPosition);
        console.log("PREVIOUS lessonStepRef.current: " + lessonStepRef.current);
        

       
        //setNextStepPosition(stepPosition);
        
        const config = {
            header: {"Content-Type": "application/json"}
        }

        let serverDataModules;
        let contentType;

        try{

            //fetch previous lesson data unless its the first lesson. The send them to the user dashboard
            if(stepPosition != 1){
                
                serverDataModules = await axios.get(`api/auth/coursework/nextmodule/${currentModule}/${previousStepPosition}`, config);
                
            }else{
            //redirect user to user dashboard
            history.push("/userdashboard");

            }
            //test-console.log("PREVIOUS serverDataModules : " + JSON.stringify(serverDataModules));

            lastModuleLessonTypeRef.current = serverDataModules.data.courseModule.lessonType;

            setStepPosition(serverDataModules.data.courseModule.stepPosition);

            lessonStepRef.current = serverDataModules.data.courseModule.stepPosition;
            //test-console.log("PREVIOUS lessonStepRef.current: " + lessonStepRef.current);
            //test-console.log("stepPosition: " + stepPosition);


            contentType = serverDataModules.data.courseModule.lessonType;

            //Render the appropriate component to show the lesson data based on the type, turn off all else
            if(contentType == "voice over"){
                setVoiceOverComponent(true);
                setTextComponent(false);
                setVideoComponent(false);
                setSlidesComponent(false);
                setAssessmentComponent(false);

            }else if(contentType == "text"){
                setVoiceOverComponent(false);
                setTextComponent(true);
                setVideoComponent(false);
                setSlidesComponent(false);
                setAssessmentComponent(false);

            }else if(contentType == "video"){
                setVoiceOverComponent(false);
                setTextComponent(false);
                setVideoComponent(true);
                setSlidesComponent(false);
                setAssessmentComponent(false);

            }else if(contentType == "slides"){
                setVoiceOverComponent(false);
                setTextComponent(false);
                setVideoComponent(false);
                setSlidesComponent(true);
                setAssessmentComponent(false);

            }else if(contentType == "assessment"){
                setVoiceOverComponent(false);
                setTextComponent(false);
                setVideoComponent(false);
                setSlidesComponent(false);
                setAssessmentComponent(true);

            }else {

                setErrorMessage("No component type set for Presentor to render");
            }


            

            setCourseContent(serverDataModules.data.courseModule);


        }catch(error){
            console.log(JSON.stringify(error));
            //show error in the form
            //setErrorMessage(error.response.data.error);

        }


    }//previousLesson






    ////////////////////////////////////////////////////////////////////////////////////////////
    //This is used to start the lesson. It re-renders the first component becasue the component is rendered
    //before the lesson data is recieved and the state variable are set. 
    const startLesson = () => {

        setShowButton(false);//hide the start button
        setStart(true);//show and render the first lesson component
        
        //Render the appropriate component to show the lesson data based on the type, turn off all else
        if(contentType == "voice over"){
            setVoiceOverComponent(true);
            setTextComponent(false);
            setVideoComponent(false);
            setSlidesComponent(false);
            setAssessmentComponent(false);

        }else if(contentType == "text"){
            setVoiceOverComponent(false);
            setTextComponent(true);
            setVideoComponent(false);
            setSlidesComponent(false);
            setAssessmentComponent(false);

        }else if(contentType == "video"){
            setVoiceOverComponent(false);
            setTextComponent(false);
            setVideoComponent(true);
            setSlidesComponent(false);
            setAssessmentComponent(false);

        }else if(contentType == "slides"){
            setVoiceOverComponent(false);
            setTextComponent(false);
            setVideoComponent(false);
            setSlidesComponent(true);
            setAssessmentComponent(false);

        }else if(contentType == "assessment"){
            setVoiceOverComponent(false);
            setTextComponent(false);
            setVideoComponent(false);
            setSlidesComponent(false);
            setAssessmentComponent(true);

        }else {

            setErrorMessage("No component type set for Presentor to render");
        }
    }//startLesson




    //test-<p>{JSON.stringify(courseContent)}</p>
    //test-<h1>{presentor}</h1>




    //The following JSX is used to render the different coursework module lesson types
    return(
        <div className="grid-layout">
            

            <h1><span style={{color: "red"}}>{errorMessage}</span></h1>



            <div style={{display: start ? "block" : "none"}}>

                {voiceOverComponent ? <VoiceOver courseContent={courseContent} previousLesson={previousLesson} nextLesson={nextLesson}/> : <span></span>}

                {textComponent ? <Text courseContent={courseContent} previousLesson={previousLesson} nextLesson={nextLesson}/> : <span></span>}

                {videoComponent ? <Video courseContent={courseContent} previousLesson={previousLesson} nextLesson={nextLesson}/> : <span></span>}

                {slidesComponent ? <Slides courseContent={courseContent} previousLesson={previousLesson} nextLesson={nextLesson}/> : <span></span>}

                {assessmentComponent ? <Assessment courseContent={courseContent} previousLesson={previousLesson} nextLesson={nextLesson}/> : <span></span>}
            
            </div>


            <div className="centerButtonContainer">
                <button className="centerStartButton" style={{fontSize: "25px", display: showButton ? "block" : "none"}} onClick={startLesson}>Click to Start</button>
            </div>

        </div>
    );
}



export default Presentor;