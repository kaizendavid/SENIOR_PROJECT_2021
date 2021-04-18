import './video.css';
import ReactPlayer from 'react-player';
import { useState, useEffect, useRef } from 'react';






/**This component is used to show coursework module type: video. The data is fetched via props from the parent
 * Presentor component. It uses the ReactPlayer component to display the video stored on the server.
 */
const Video = (props) => {

    const[videos, setVideos] = useState(false);

    const loadImages = useRef(false);
    const loadBackgroundImage = useRef(false);
    const loadVideos = useRef(false);


    useEffect(() =>{

        //test-console.log(props);
    }, [])

    const checkState = () =>{
        console.log("checkState--");

        //console.log("video: " + JSON.stringify(props.courseContent.video[0].video));

        setTimeout(() => {

            if(props.courseContent.video){
                setVideos(true);
                console.log("TRUE")
            }else{
                setVideos(false);
            }

        }, 2000);


    }


 //<h1>Video Component </h1>
 //{loadVideos.current && <p>{props.courseContent.videos[0].video}</p>}
 //<h2>{props.courseContent.lessonType}</h2>



    //render the UI component if the props has the course module fetched from the server via the Presentor parent
    //component. If not show a loading text tag
    if(props.courseContent !=null) 
    {
        return(
            <>

                {(props.courseContent.images != "") ? (loadImages.current = true) : (loadImages.current = false)}
                {(props.courseContent.backgroundImage) ? (loadBackgroundImage.current = true) : (loadBackgroundImage.current = false)}
                {(props.courseContent.videos != "") ? (loadVideos.current = true) : (loadVideos.current = false)}

                <div className="grid-layout" 
                
                
                style={{ backgroundImage: loadBackgroundImage.current ? `url(${props.courseContent.backgroundImage})` : "none" }}
                style={{ backgroundRepeat: loadBackgroundImage.current ? "no-repeat" : "none" }}
                
                        >

                    <div className="centerContainer">

                        

                        <h1>{props.courseContent.lessontitle}</h1>

                        <br/>
                        <br/>

                        
                        <center>
                        {loadVideos.current &&  <ReactPlayer style={{border: "1px solid black"}}
                                                        url={props.courseContent.videos[0].video}
                                                        width="800px"
                                                        height="700px"
                                                        playing={false}
                                                        controls={true}
                                                        onEnded={() => console.log("Video Ended")}
                                                        />
                        }
                        </center>
                       
                        <br/>
                        <br/>

                        <h3>{props.courseContent.lessonText}</h3>

                        <h2>{props.courseContent.subtext1}</h2>

                        <h2>{props.courseContent.subtext2}</h2>

                        <h2>{props.courseContent.subtext3}</h2>

                        <h2>{props.courseContent.subtext4}</h2>

                        <div className="buttonDiv">

                            <button onClick={props.previousLesson}>Previous Lesson</button>

                            <button className="nextButton" onClick={props.nextLesson} >Next Lesson</button>
                            {//test-console.log("rendered Video component=======")
                            }

                        </div>

                    </div>

                </div>
            </>

        );
    }

        return(
            <>
                <h3>Loading......video</h3>
            </>
        );
}



export default Video;