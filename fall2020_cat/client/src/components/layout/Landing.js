import React, {useState} from 'react';
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'




/**This is the landing home page component. It is the root '/' route. It displays the company information
 * for people to see.
 */
const Landing = () => {
    const [visible, setVisible] = useState(0);

    const register = {
        backgroundColor: '#fc6633',
		font: 'inherit',
        color: 'white',
    	fontWeight: 'bold',
		fontSize: 'xx-large',
  		borderRadius: '5px',
		padding: '20px 50px 20px 50px',
		textDecoration: 'none',
    }

    const textStyle = {
        fontWeight: 'bold',
		fontSize: '200%',
		marginBottom: '25px'
    }

    const leftArrow = {
		display: 'grid',
		gridColumn: '1/2',
		gridRow: '1/2',
		overflow: 'visible',

		justifySelf: 'center',
		alignSelf: 'center'
    }
    const slideStyle = {
		display: 'grid',
		gridColumn: '2/3',
		gridRow: '1/2', 
		height: '500px',
		width: '900px',
		justifySelf: 'center',
    }
    const rightArrow = {
		display: 'grid',
		gridColumn: '3/4',
		gridRow: '1/2',
		overflow: 'visible',

		justifySelf: 'center',
		alignSelf: 'center'
    }

	const background = '/resources/images/Landing_Image.png'
	const img0 = '/resources/images/careTeam.png';
	const img1 = '/resources/images/background_introduction.png';
	const img2 = '/resources/images/module2_3.png';

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
	const { userState } = useAuth()
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

			<div className='landing' style={{
				backgroundImage: `url(${background})`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				height: '700px',
				
			}}>

			</div>

			<div className='sample-pane'>
				<div style={{
						height: '100%',
						width: '100%',
						textAlign: 'center',
						marginBottom: '30px'
					}}>
					<div style={textStyle}>
						<h2>Critical Training Waiting For You!</h2>
					</div>
					{showRegisterNowBtn()}
				</div>
				<div style={{
					display: 'grid',
					width: '100%',
					gridTemplateColumns: 'max-content max-content max-content',
					justifyContent: 'center',
					userSelect: 'none'
				}}>
					<svg style={leftArrow} viewBox='0 0 100 100' width='25%' height='25%'>
						<path d='M 50 0 L 100 100 L 0 100 z' style={{fill: '#fc6633', stroke: '#fc6633', strokeWidth:'20px'}} transform='rotate(-90 50 50)' strokeLinejoin='round' onClick={moveBackward}/>
					</svg>
					<img src={state.imgList[visible]} style={slideStyle}/>
					<svg style={rightArrow} viewBox='0 0 100 100' width='25%' height='25%'>
						<path d='M 50 0 L 100 100 L 0 100 z' style={{fill: '#fc6633', stroke: '#fc6633', strokeWidth:'20px'}} transform='rotate(90 50 50)' strokeLinejoin='round' onClick={moveForeward}/>
					</svg>
				</div>
			</div>
			<footer>
				<h1>Contact Us</h1>
				<h3>(888) 888-888</h3>
				<h3>info@k12assessment.com</h3>
			</footer>
        </div>
    )
}

export default Landing;