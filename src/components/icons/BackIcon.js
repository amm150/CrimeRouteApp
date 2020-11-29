import React from 'react';
import PropTypes from 'prop-types';

import Svg, { Path } from 'react-native-svg';

/**
 * @description Renders a filled or unfilled newspaper icon.
 * 
 * @param {*} props 
 * @returns {React.ReactNode}
 */
function BackIcon(props) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            className="ionicon"
            viewBox="0 0 512 512"
        >
            <Path
                fill="none"
                stroke={props.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="48"
                d="M328 112L184 256l144 144"
            ></Path>
        </Svg>
    );
}

BackIcon.propTypes = {
    color: PropTypes.string
}; 


export default BackIcon;