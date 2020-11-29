import React from "react";
import PropTypes from 'prop-types';

import * as iconNames from './Icons';

/**
 * @description Dynamically references the icon component based on the icon name. For example if the icon name is "explore", then it looks for the exploreIcon export from Icons.js.
 * 
 * @param {*} props 
 * @returns {React.ReactNode}
 */
function IconWrapper(props) {
    const Icon = iconNames[`${props.name}Icon`],
        iconData = {
            color: props.color
        };

    return (
        <Icon {...iconData}/>
    );
}

IconWrapper.defaultProps = {
    color: 'black'
};

IconWrapper.propTypes = {
    color: PropTypes.string,
    name: PropTypes.string.isRequired
}; 

export default IconWrapper;