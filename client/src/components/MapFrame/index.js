import React from 'react';

const MapFrame = ({ src }) => {
    return (
        <iframe
            title="Map"
            src={src}
            width="100%"
            height="100%"
            allowFullScreen
            style={{
                borderRadius: '10px', 
                border: 'none',
                boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.3)' 
            }}
        />
    );
};

export default MapFrame;
