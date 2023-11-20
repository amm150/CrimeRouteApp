import React from 'react';
import PropTypes from 'prop-types';

import Svg, { Path } from 'react-native-svg';

/**
 * @description Renders a filled or unfilled x icon.
 * 
 * @param {*} props 
 * @returns {React.ReactNode}
 */
function XIcon(props) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
        >
            <Path
                fill="#fff"
                stroke={props.color}
                strokeMiterlimit="10"
                strokeWidth="32"
                d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
            ></Path>
            <Path
                fill="none"
                stroke={props.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M320 320L192 192m0 128l128-128"
            ></Path>
        </Svg>
    );
}

XIcon.propTypes = {
    color: PropTypes.string
}; 


export default XIcon;