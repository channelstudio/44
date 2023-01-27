import React from 'react';
import Youtube from './Youtube';
import './Overlay.css';

function Overlay({ details, setOverlay}) {
  const { name, speech_text, audio, video_link, date } = details.speech_data;

  return (
    <div className="Overlay">
      <button
        onClick={() => {
          setOverlay(null);
        }}
      >Close</button>
      <h1>{`${name} on ${date}`}</h1>
      {audio && <audio controls src={`https://www.americanrhetoric.com/${audio}`}/>}
      {video_link && video_link.indexOf('youtube') >= 0 && <Youtube url={video_link}/>}
      {/* {video_link && video_link.indexOf('youtube') <=0 && <video source={`https://www.americanrhetoric.com/${video_link}`}/>} */}
      {details.top_words && <p className="Overlay__sigwords">{details.top_words.join(', ')}</p>}
      <div>{speech_text.split('\n').map((para) => {
        return(<p>{para}</p>);
      })}</div>
    </div>
  );
}

export default Overlay;
