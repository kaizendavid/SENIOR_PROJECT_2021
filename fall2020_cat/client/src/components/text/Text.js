import './text.css';
import { useRef } from 'react';





/**This component is used to show coursework module type: text. The data is fetched via props from the parent
 * Presentor component. 
 */
const Text = (props) => {

 
    const loadImages = useRef(false);
    const loadBackgroundImage = useRef(false);



    //test-<h1>Text Component </h1>
    //test=<h2>{props.courseContent.lessonType}</h2>


    //render the UI component if the props has the course module fetched from the server via the Presentor parent
    //component. If not show a loading text tag
if(props.courseContent !=null) 
    {
        return(

            <>
                {/*console.log("TEXT 1 loadImages: " + loadImages.current);
                console.log("type of courseContent.images: " + typeof(props.courseContent.images);

                props.courseContent.images == "" ? console.log("empty") : console.log("try again");
                */}
                
                {//test-console.log("TEXT !loadImages: " + !(props.courseContent.images));
                }

                {(props.courseContent.images != "") ? (loadImages.current = true) : (loadImages.current = false)}
                {(props.courseContent.backgroundImage) ? (loadBackgroundImage.current = true) : (loadBackgroundImage.current = false)}
                


                <div className="grid-layout" 
                style={{ backgroundSize: loadBackgroundImage.current ? "cover" : "none" }}
                style={{ backgroundImage: loadBackgroundImage.current ? `url(${props.courseContent.backgroundImage})` : "none" }}
                    >

                    <div className="centerContainer">
                        
                        <div style={{display: props.courseContent ? "block" : "none"}}>

                            <br/>
                            <br/>

                            <h1>{props.courseContent.lessontitle}</h1>

                            <br/>
                            <br/>

                            {loadImages.current && <p><img className="textImage" src={props.courseContent.images[0].image}/></p>}

                            <h2>{props.courseContent.subtext1}</h2>

                            <h2>{props.courseContent.subtext2}</h2>

                            <h2>{props.courseContent.subtext3}</h2>

                            <h2>{props.courseContent.subtext4}</h2>

                            <br/>
                            <br/>

                            <h3>{props.courseContent.lessonText}</h3>

                            <div className="buttonDiv">

                                <button onClick={props.previousLesson}>Previous Lesson</button>

                                <button className="nextButton" onClick={props.nextLesson} >Next Lesson</button>
                                {//console.log("rendered Text component=======")
                                }

                            </div>

                        </div>

                    </div>

                </div>
            </>

        );
    }

    return(
        <>
            <h3>Loading......text</h3>
        </>
    );
}



export default Text;