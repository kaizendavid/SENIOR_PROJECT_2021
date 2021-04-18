import { useHistory } from 'react-router-dom';
import {videoData} from './trainingData';

import './TrainingVideos.css';

const TrainingVideos = () => {
    const history = useHistory();
    console.log(history);
	return (
        <div className='training-videos-grid-layout'>
            <div className='flex-col'>
                {videoData.map((value) => {
                    let default_thumbnail = 'https://thumbs.dreamstime.com/b/no-thumbnail-image-placeholder-forums-blogs-websites-148010362.jpg';
                    let default_instructor_avatar = 'https://www.w3schools.com/howto/img_avatar.png';

                    return <div key={value.id} className='flex-row' style={{cursor: 'pointer'}} onClick={() => history.push('/traininginfo/' + value.id)}>
                        <div className="inner-row-white">
                            <div className="inner-row-container left">
                                <div className='thumbnail'>
                                    <img style={{'borderRadius': '10px'}} width='300' height='260' src={value.thumbnail_src ? value.thumbnail_src : default_thumbnail} />
                                </div>
                            </div>

                            <div className='inner-row-container right'>
                                <div className='inner-details'>
                                    <h2>{value.title}</h2>
                                    <div className="instructor">
                                        <img style={{'borderRadius': '20px'}} width="30" height="30"  src={value.instructor_avatar ? value.instructor_avatar : default_instructor_avatar} />
                                        &nbsp;&nbsp;<span>Instructor {value.instructor}</span>
                                    </div>
                                    <h3>Short Overview</h3>
                                    <p className='overview'>{value.overview}</p>
                                </div>


                                <div className='details-footer'>
                                    <span>Group Limit: {value.group_limit}</span>
                                    <span>Price: ${value.price}</span>


                                </div>

                            </div>
                        </div>

                    </div>;
                })}
            </div>
        </div>
	);
}

export default TrainingVideos;
