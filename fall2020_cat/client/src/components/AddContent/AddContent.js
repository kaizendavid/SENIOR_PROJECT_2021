import React, {useState } from 'react';
import { useHistory} from 'react-router-dom';
import './AddContent.css';

const AddContent = () => {
    const history = useHistory();

    const navigateTo = () =>
    {
        history.push('/Admin')
    };

    const [formData, setFormData]=useState({ EnterATitle: ''})

    const {EnterATitle} = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});

	return (
        <div className='add-content-grid-layout'>

            <form className='form'>

                <h1 className="large">Enter A Title:</h1>
                <div className = 'form-group'>
                    <input 
                        type = 'text'
                        class="form-control"
                        placeholder = 'Enter A Title'
                        name = 'Title'
                        defaultValue= {EnterATitle}
                        onChange = {e=> onChange(e)}
                        maxLength = '40'
                        required
                    />
                </div>

                <h1 className="large">Enter description:</h1>
                <div className = 'form-group'>
                    <textarea 
                        type = 'textbox' cols="10" rows="3"
                        class="form-control"
                        placeholder = 'Enter A Description'
                        name = 'description'
                        maxLength="25"
                        defaultValue= {EnterATitle}
                        onChange = {e=> onChange(e)}
                        required
                    />
                </div>
            
                <h1 className="large">Lesson Id:</h1>
                <div className = 'form-group'>
                    <input 
                        type = 'text'
                        class="form-control"
                        placeholder = 'Id number'
                        name = 'lessonId'
                        defaultValue= {EnterATitle}
                        onChange = {e=> onChange(e)}
                        maxLength = '10'
                        required
                    />
                </div>

                <h1 className="large">Enter Step Position:</h1>
                <div className = 'form-group'>
                    <input 
                        type = 'text'
                        class="form-control"
                        placeholder = 'Enter A Title'
                        name = 'stepPosition'
                        defaultValue= {EnterATitle}
                        onChange = {e=> onChange(e)}
                        maxLength = '10'
                        required
                    />
                </div>

                


                <div style = {{position: 'absolute', top: '145px', right: '30px'}}> 
                    <button onClick={navigateTo}>Save/Exit</button>
                </div>



                <div className='outsideborder'>  

                    <div className="addcontentbox">
                        <p>Add Video</p>
                    </div>

                    <div className="addcontentbox">
                        <p>Add VoiceOver</p>
                    </div>
                    
                    <div className="addcontentbox">
                        <p>Add Quiz</p>
                    </div>


                </div>	
            </form>
        </div>
	);
}

export default AddContent; 