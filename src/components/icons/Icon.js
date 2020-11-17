import React from "react";

import * as iconNames from './Icons';

/**
 * @description Dynamically references the icon component based on the icon name. For example if the icon name is "explore", then it looks for the exploreIcon export from Icons.js.
 * 
 * @param {*} props 
 * @returns {React.ReactNode}
 */
function IconWrapper(props) {
    const iconName = props.name.toLowerCase(),
        Icon = iconNames[`${iconName}Icon`],
        iconData = {
            color: props.color
        };

    return (
        <Icon {...iconData}/>
    );
}

export default IconWrapper;