import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
//import PropTypes from 'prop-types';
import './../../App.css';
import './Assessment.css';



/**This component is used to display 3 quizzes at the end of each course module. The quiz questions, choices, 
 * answers, and explanations are fetched from the server via the Presentor parent component passed in through props. 
 * This Assessment component is part of the parent Presentor component that presents all the 
 * the course modules to the user. The user takes 3 quizes and has unlimited chances to get the right anwser
 * before moving onto the next quiz. At the end the user is then redirected to the finished component via
 * Presentor component.
 */
const Assessment = (props) => {

    const [userAnswered, setUserAnswered] = useState("blank");
    const [showExplanation, setShowExplanation] = useState(false);
    const [correct, setCorrect] = useState("");
    const [incorrect, setIncorrect] = useState("");
    const [finishedQuizzes, setFinishedQuizzes] = useState(false);
    const [disableButton, setDisabledButton] = useState(false);

    const [quizCount, setQuizCount] = useState(0);

    const history = useHistory();
    //use to keep track of the quizes the user has taken to display 'finished module' button at the end of all 3 quizzes
    const quizCountRef = useRef(0);



    //checks the answer of the user. The user has unlimited tries
    const checkAnswer = (Event) => {
        Event.preventDefault();

        //test-console.log("userAnswered: " + userAnswered);
        //test-console.log("correct answer: " + props.courseContent.quizs[quizCount].answer.values);


        //if the user has chosen the correct answer show explanation else have them try again
        if(userAnswered == props.courseContent.quizs[quizCount].answer.values){
            setShowExplanation(true);
            setCorrect("You are correct");

            //user has taken all the quizes and current in the last one
            if(quizCountRef.current == 2){
                setDisabledButton(true);
                setFinishedQuizzes(true);
            }
            
        }else{

            setShowExplanation(false);
            setIncorrect("Sorry, wrong answer. Please try again");
        }

        setInterval(() => {
            setCorrect("");
            setIncorrect("");
        }, 3000);
    }




    //moves the user to the next quiz and loads the new questions and answers data
    const nextQuiz = () => {
        let quizNum = quizCountRef.current + 1;
        quizCountRef.current = quizNum;
        setQuizCount(quizNum);

        //hide last explanation
        setShowExplanation(false);

    }





    //if the props has the fetched data ready load the assessment component UI ELSE show a loading text tag
    if(props.courseContent !=null) 
    {
        return(


            <>
            {//test-console.log("quizCount: " + quizCount)
            }

                <div className='assessment-grid-layout'>

                    <div className="centerContainer">

                        <h1 style={{textTransform: 'uppercase'}}>{props.courseContent.lessonType}</h1>

                        <p className='questionNumber'>
                            Question {props.courseContent.quizs[quizCount].number}
                        </p>

                        <div className='question'>
                            <h3>{props.courseContent.quizs[quizCount].question}</h3>
                        </div>




                        <div className='answers'>
                            <ul>
                                <li>
                                <input type="radio" className="inputQuiz"
                                id= {`${props.courseContent.quizs[quizCount].choices[0].cid}`} 
                                name="choiceGroup" 
                                onChange={(Event) => setUserAnswered(Event.target.value)}
                                value={props.courseContent.quizs[quizCount].choices[0].values}/>{props.courseContent.quizs[quizCount].choices[0].choice}
                                </li>

                                <li>
                                <input type="radio" className="inputQuiz"
                                id= {`${props.courseContent.quizs[quizCount].choices[1].cid}`}
                                name="choiceGroup" 
                                onChange={(Event) => setUserAnswered(Event.target.value)}
                                value={props.courseContent.quizs[quizCount].choices[1].values}/>{props.courseContent.quizs[quizCount].choices[1].choice}
                                </li>

                                <li>
                                <input type="radio" className="inputQuiz"
                                id= {`${props.courseContent.quizs[quizCount].choices[2].cid}`}
                                name="choiceGroup" 
                                onChange={(Event) => setUserAnswered(Event.target.value)}
                                value={props.courseContent.quizs[quizCount].choices[2].values}/>{props.courseContent.quizs[quizCount].choices[2].choice}
                                </li>

                                <li>
                                <input type="radio" className="inputQuiz"
                                id= {`${props.courseContent.quizs[quizCount].choices[3].cid}`}
                                name="choiceGroup"
                                onChange={(Event) => setUserAnswered(Event.target.value)}
                                value={props.courseContent.quizs[quizCount].choices[3].values}/>{props.courseContent.quizs[quizCount].choices[3].choice}
                                </li>

                                </ul>

                        </div>




                        {//if explanation is showing hide this button until they move onto the next quiz
                        }
                        <div className="checkanswer" style={{display: !showExplanation ? "block" : "none"}}>
                            <p>
                                <span style={{ fontSize: "35px",color: "red"}}>{incorrect}</span>
                                <span style={{ fontSize: "35px", color: 'green'}}>{correct}</span>
                            </p>
                            <button disabled={disableButton} onClick={checkAnswer} type="submit">Check</button>

                        </div>


                        <br/>

                        {//hide this explanation div unless the user answered correctly and now can move onto the next quiz
                        //finished the module with all 3 quizzes correct and move onto the Finished component
                        }
                        <div style={{display: showExplanation ? "block" : "none"}}>
                            <hr/>

                            <span ><h1 style={{color: "green"}}>{props.courseContent.quizs[quizCount].explanation}</h1></span>

                            <hr/>
                        
                            <button style={{display: !finishedQuizzes ? "block" : "none"}}onClick={nextQuiz}>Next Quiz</button>

                            <br/>

                        </div>



                        {//this is only displayed if the user has taken all 3 quizzes
                        }
                        <div className="finshedContainer" style={{display: finishedQuizzes ? "flex" : "none"}}>
                            
                            <button style={{backgroundColor: "green"}} onClick={props.nextLesson}>Finished Module Lessons</button>
                    
                        </div> 


                        <button onClick={props.previousLesson}>Previous Lesson</button>

                        <br/>
                        
                    </div>
                   

                </div>
            </>
        );
    }


    return (
            <>
                <h3>Loading.......assessment</h3>
            </>
    );

}

export default Assessment;