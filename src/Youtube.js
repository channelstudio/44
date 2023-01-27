// import React from 'react';

function Youtube({url}) {
  return(
    <iframe
      width="300px"
      height="180px"
      src={url}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  );
}

export default Youtube;
