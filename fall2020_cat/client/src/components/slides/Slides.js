import './slides.css';
import { useRef } from 'react';







/**This component is used to show coursework module type: slides. The data is fetched via props from the parent
 * Presentor component. 
 */
const Slides = (props) => {

    const loadImages = useRef(false);
    const loadBackgroundImage = useRef(false);
    const loadSlides = useRef(false);




    //test-<h1>Slides Component </h1>
    //test-<h2>{props.courseContent.lessonType}</h2>
    

    //render the UI component if the props has the course module fetched from the server via the Presentor parent
    //component. If not show a loading text tag
    if(props.courseContent !=null) 
    {
        return(

            <>
            
                {(props.courseContent.images != "") ? (loadImages.current = true) : (loadImages.current = false)}
                {(props.courseContent.backgroundImage) ? (loadBackgroundImage.current = true) : (loadBackgroundImage.current = false)}
                {(props.courseContent.slides != "") ? (loadSlides.current = true) : (loadSlides.current = false)}

                <div className="grid-layout" 
                style={{ backgroundSize: loadBackgroundImage.current ? "cover" : "none" }}
                style={{ backgroundImage: loadBackgroundImage.current ? `url(${props.courseContent.backgroundImage})` : "none" }}
                    >

                   <div className="centerContainer">

                        <br/>

                        <h1>{props.courseContent.lessontitle}</h1>

                        <br/>

                        {loadSlides.current && <p><img className="slidesImage" src={props.courseContent.slides[0].image}/></p>}

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
                            {//test-console.log("rendered Slides component=======")
                            }

                        </div>

                    </div>

                </div>

             </>
        );
    }

    return (
        <>
            <h3>Loading.......slide</h3>
        </>
    );

}



export default Slides;


