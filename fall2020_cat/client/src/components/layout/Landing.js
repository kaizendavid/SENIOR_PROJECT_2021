import './Layout.css';
import React, {useState} from 'react';
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'




/**This is the landing home page component. It is the root '/' route. It displays the company information
 * for people to see.
 */
const Landing = () => {

    const [visible, setVisible] = useState(0);
	const { userState } = useAuth()


    const register = {
        backgroundColor: '#fc6633',
		font: 'inherit',
        color: 'white',
    	fontWeight: 'bold',
		fontSize: 'xx-large',
  		borderRadius: '5px',
		padding: '20px 50px 20px 50px',
		textDecoration: 'none'
    }

    


	const background = '/images/Landing_Image.png';
	const img0 = '/images/careTeam.png';
	const img1 = '/images/background_introduction.png';
	const img2 = '/images/module2_3.png';

    const state = {
    	imgList: [img0, img1, img2]
    }

    const moveForeward = () => {
		if (visible < 2) 
		{
			return setVisible(visible+1);
		}
		else 
		{
			setVisible(0);
			return 0;
		}
    }

    const moveBackward = () => {
		//console.log(visible);
		if (visible > 0) {
			return setVisible(visible-1);
		}
		else 
		{
			setVisible(2);
			return 0;
		}
    }


	const showRegisterNowBtn = () => {
		if ( userState.loggedIn )
		{
			return null
		}
		else
		{
			return <Link to='/register' style={register}> REGISTER NOW </Link>
		}
	}

	





    return (

		<div className='landing-grid-layout'>

			<div style={{width: '100%'}}>

				<img className="coverPhoto" src={`${background}`}/>

			</div>



			<div className='sample-pane'>
				
				<div style={{
						display: 'block',					
						width: '100%',
						textAlign: 'center',
						marginBottom: '30px'
					}}>

					<div className="landingH2">
						<h2>Critical Training Waiting For You!</h2>
					</div>

					{showRegisterNowBtn()}

				</div>

				
				
				<div >

					<img src={state.imgList[visible]} className="slideStyle"/>

				</div>



				<div className="arrowsDiv">

					<svg className="arrow" viewBox='-10 -10 150 150' width='25%' height='25%'>
						<path d='M 50 0 L 100 100 L 0 100 z' className="arrowStroke" transform='rotate(-90 50 50)' strokeLinejoin='round' onClick={moveBackward}/>
					</svg>

					<svg className="arrow" viewBox='-10 -10 150 150' width='25%' height='25%'>
						<path d='M 50 0 L 100 100 L 0 100 z' className="arrowStroke" transform='rotate(90 50 50)' strokeLinejoin='round' onClick={moveForeward}/>
					</svg>

				</div>



			</div>




			<footer>
				<div className="footerContent">
					<h1>Contact Us</h1>
					<h3>(888) 888-888</h3>
					<h3>info@k12assessment.com</h3>
				</div>
				
			</footer>



        </div>

    )
}

export default Landing;