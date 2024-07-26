// TrafficLightIcon.js
import React from 'react';
import PropTypes from 'prop-types';

const TrafficLightIcon = ({ signed }) => {
    const color = signed ? 'green' : 'yellow';
    
    return (
        <div style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: color,
            display: 'inline-block',
            marginLeft: 8,
        }} />
    );
};

TrafficLightIcon.propTypes = {
    signed: PropTypes.bool.isRequired
};

export default TrafficLightIcon;
