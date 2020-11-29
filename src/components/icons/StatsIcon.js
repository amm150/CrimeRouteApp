import React from 'react';
import PropTypes from 'prop-types';

import Svg, { Rect } from 'react-native-svg';

/**
 * @description Renders a filled or unfilled statistics icon.
 * 
 * @param {*} props 
 * @returns {React.ReactNode}
 */
function StatsIcon(props) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            className="ionicon"
            viewBox="0 0 512 512"
        >
            <Rect
                width="48"
                height="160"
                x="64"
                y="320"
                fill="none"
                stroke={props.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                rx="8"
                ry="8"
            ></Rect>
            <Rect
                width="48"
                height="256"
                x="288"
                y="224"
                fill="none"
                stroke={props.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                rx="8"
                ry="8"
            ></Rect>
            <Rect
                width="48"
                height="368"
                x="400"
                y="112"
                fill="none"
                stroke={props.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                rx="8"
                ry="8"
            ></Rect>
            <Rect
                width="48"
                height="448"
                x="176"
                y="32"
                fill="none"
                stroke={props.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
                rx="8"
                ry="8"
            ></Rect>
        </Svg>
    );
}

StatsIcon.propTypes = {
    color: PropTypes.string
};

export default StatsIcon;