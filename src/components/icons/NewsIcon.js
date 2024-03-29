import React from 'react';
import PropTypes from 'prop-types';

import Svg, { Path } from 'react-native-svg';

/**
 * @description Renders a filled or unfilled newspaper icon.
 * 
 * @param {*} props 
 * @returns {React.ReactNode}
 */
function NewsIcon(props) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            className="ionicon"
            viewBox="0 0 512 512"
        >
            <Path
                fill="none"
                stroke={props.color}
                strokeLinejoin="round"
                strokeWidth="32"
                d="M368 415.86V72a24.07 24.07 0 00-24-24H72a24.07 24.07 0 00-24 24v352a40.12 40.12 0 0040 40h328"
            ></Path>
            <Path
                fill="none"
                stroke={props.color}
                strokeLinejoin="round"
                strokeWidth="32"
                d="M416 464h0a48 48 0 01-48-48V128h72a24 24 0 0124 24v264a48 48 0 01-48 48z"
            ></Path>
            <Path
                fill="none"
                stroke={props.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M240 128h64m-64 64h64m-192 64h192m-192 64h192m-192 64h192"
            ></Path>
            <Path 
                fill={props.color}
                d="M176 208h-64a16 16 0 01-16-16v-64a16 16 0 0116-16h64a16 16 0 0116 16v64a16 16 0 01-16 16z"
            ></Path>
        </Svg>
    );
}

NewsIcon.propTypes = {
    color: PropTypes.string
}; 


export default NewsIcon;