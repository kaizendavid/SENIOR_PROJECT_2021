import './voiceover.css';
import ReactPlayer from 'react-player';
import { useState, useEffect, useRef } from 'react';







/**This component is used to show coursework module type: voice over. The data is fetched via props from the parent
 * Presentor component. It uses the ReactPlayer component to display the audio stored on the server.
 */
const VoiceOver = (props) => {

    const loadImages = useRef(false);
    const loadBackgroundImage = useRef(false);
    const loadAudios = useRef(false);



    useEffect(() =>{
        /*test-console.log("image Props: " + JSON.stringify(props.courseContent.images) );
        //console.log("Voice stepPositionProp: " + props.courseContent.stepPosition);
        // {loadAudios.current && <p>{props.courseContent.audios[0].audio}</p>}
        //<h2>{props.courseContent.lessonType}</h2>
        
        console.log("Voice loadImages: " + loadImages);
        */
    }, [])







    //render the UI component if the props has the course module fetched from the server via the Presentor parent
    //component. If not show a loading text tag
    if(props.courseContent !=null) 
    {
        return(

            <>
            
                {(props.courseContent.images != "") ? (loadImages.current = true) : (loadImages.current = false)}
                {(props.courseContent.backgroundImage) ? (loadBackgroundImage.current = true) : (loadBackgroundImage.current = false)}
                {(props.courseContent.audios != "") ? (loadAudios.current = true) : (loadAudios.current = false)}

                <div className="grid-layout" 
                style={{ backgroundSize: loadBackgroundImage.current ? "cover" : "none" }}
                style={{ backgroundImage: loadBackgroundImage.current ? `url(${props.courseContent.backgroundImage})` : "none" }}
                    >
                   
                   <div className="centerContainer">
                        <br/>

                        <h1>{props.courseContent.lessontitle}</h1>

                        <br/>

                        {loadImages.current && <p><img className="voiceImage" src={props.courseContent.images[0].image}/></p>}

                        <br/>

                        {loadAudios.current &&       <ReactPlayer
                                                        url={props.courseContent.audios[0].audio}
                                                        width="400px"
                                                        height="50px"
                                                        playing={false}
                                                        controls={true}
                                                        onEnded={() => console.log("Audio Ended")}
                                                        />
                        }


                        <br/>
                        <br/>

                        <h3>{props.courseContent.lessonText}</h3>

                        <br/>

                        <h2>{props.courseContent.subtext1}</h2>

                        <h2>{props.courseContent.subtext2}</h2>

                        <h2>{props.courseContent.subtext3}</h2>

                        <h2>{props.courseContent.subtext4}</h2>


                        <div className="buttonDiv">

                            <button onClick={props.previousLesson}>Previous Lesson</button>

                            <button className="nextButton" onClick={props.nextLesson} >Next Lesson</button>
                            {//test-console.log("rendered voice component=======")
                            }

                        </div>

                    </div>

                </div>
            </>
        );
    }

    return (
        <>
            <h3>Loading.......voiceover</h3>
        </>
    );

}



export default VoiceOver;