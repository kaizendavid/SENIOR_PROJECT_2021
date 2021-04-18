import { useHistory } from 'react-router-dom';



/**This component is used to show the user they are finished with the course modules. It is used at the end of 
 * the assessment component. It's only function is to redirect the user to the dashboard. It is used in the
 * Presentor component.
 */
const FinishedModule = () => {

    const history = useHistory();


    

    const redirectToDashboard = () => {

        history.push("/userdashboard");
    }



    return(
        <div className='assessment-grid-layout'>
 
            <div className="centerContainer">
                <br/>
                <h1>Congradulations!</h1>
                <br/>
                <h2>You have finished this module</h2>

                <br/>
                <br/>

                <button onClick={redirectToDashboard}>Please Click to Continue</button>

            </div>

        </div>


    );
}



export default FinishedModule;


