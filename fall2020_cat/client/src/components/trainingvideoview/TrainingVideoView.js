import React, { useState, useEffect } from 'react';
import { videoData } from '../trainingvideos/trainingData';

import './TrainingVideoView.css';

const TrainingVideoView = (props) => {
    const [trainingVideo, setTrainingVideo] = useState(null);
    let trainingVideoId = props.match.params.trainingVideoId;
    let default_thumbnail = 'https://thumbs.dreamstime.com/b/no-thumbnail-image-placeholder-forums-blogs-websites-148010362.jpg';
    let default_instructor_avatar = 'https://www.w3schools.com/howto/img_avatar.png';

    useEffect(() => {
        let tv = videoData.find(v => v.id == trainingVideoId);
        if (tv != null) {
            setTrainingVideo(tv);
            console.log(trainingVideo);
        }
    });



	return (
        <div className='training-video-grid-layout'>
            <div className='outer-container'>
                {
                    trainingVideo == null ? <p style={{'textAlign': 'center', 'marginTop': '50px'}}>Invalid Training Video</p> :
                        (<div className="inner-container">

                            <div className="innerHalf left videoPreview">
                                <img style={{'borderRadius': '10px'}} width='350' height='350' src={trainingVideo.thumbnail_src ? trainingVideo.thumbnail_src : default_thumbnail} />

                            </div>
                            <div className="innerHalf right secondary-info">
                                <h2>{trainingVideo.title}</h2>
                                <div className="instructor-group">
                                    <span className="video-text-gap"><img style={{'borderRadius': '20px'}} width="30" height="30"  src={trainingVideo.instructor_avatar ? trainingVideo.instructor_avatar : default_instructor_avatar} /></span>
                                    <span className="video-text-gap instructor-text">Instructor {trainingVideo.instructor}</span>
                                </div>
                                <div className="price-group">
                                    <span className="video-text-gap">Group Limit: {trainingVideo.group_limit}</span>
                                </div>
                                <div className="description">
                                    <p>
                                        {trainingVideo.overview}
                                    </p>
                                </div>
                                <div className="buy-container">
                                    <span>${trainingVideo.price}</span><button>Buy</button>
                                </div>

                            </div>

                        </div>)
                }
            </div>
        </div>
	);
}

export default TrainingVideoView;
