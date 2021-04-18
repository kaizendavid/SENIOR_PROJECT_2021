import React, { Fragment, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Admin.css';

const Button = () => {
	const [bgColour, setBgColour] = useState("#FD6A02");

	const buttonStyle = {
		backgroundColor: bgColour,
		color: 'black',
		padding: '5px 15px',
		borderRadius: '5px',
		outline: 0,
		textTransform: 'uppercase',
		margin: '10px 0px',
		cursor: 'pointer',
		boxShadow: '0px 2px 2px lightgray',
		transition: 'ease backgroundColor 250ms',
		textAlign: 'center'
	};

	return (
		<button 
			style={buttonStyle}
			onMouseEnter={() => setBgColour('#C83F49')}
			onMouseLeave={() => setBgColour('#FD6A02')}>
			User Progress
		</button>
	);
}

const ProgressBar = (props) => {
	const {bgcolor, completed} = props;
	const fillerStyles = {
		height: 'inherit',
		width: completed,
		backgroundColor: bgcolor,
		borderRadius: 'inherit',
		textAlign: 'right'
	}

	return (
		<div className="containerStyles">
			<div style={fillerStyles}>
				<span className="labelStyles">{completed}</span>
			</div>
		</div>
	);
}

const NewTraining = () => {
	return (
		<div className="addbox">
			<Link to="/AddContent">
				<h1> + </h1>
			</Link>
		</div>
	);
}

const Training = (props) => {
	return (
		<div className="box">
			<h2> {props.number} </h2>
			<h3> {props.title} </h3>
			<Button />
		</div>
	);
}



const Admin = () => {
	return (
		<div className='admin-dashboard-grid-layout'>
			<section className="training">
				<Training number='Module 1' title='Introduction'/>
				<Training number='Module 2' title='Developing and Implementing an Assessment and Care Team Inquiry Process'/>
				<Training number='Module 3' title='Train Community Members' />
				<Training number='Module 4' title='Establish an Assessment and Care Team Inquiry Procedure'/>
				<Training number='Module 5' title='Establish an Assessment and Care Team Response Procedure'/>
				<Training number='Module 6' title='School Climate and Preventative Measures'/>
				<Training number='Module 7' title='Conclusion'/>
				
			</section>
		</div>
				
	);
}


export default Admin;
