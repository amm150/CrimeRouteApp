import React, {
    useRef
} from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';

import ImageAndDescription from './ImageAndDescription';
import TimeUtil from '../../../utils/TimeUtil';

/**
 * @description CrimeEventItem
 * 
 * @returns {React.ReactNode}
 */
function CrimeEventItem(props) {
    function handleClickItem() {
        props.handleClickItem(props);
    }

    const timeUtil = useRef(new TimeUtil()).current,
        date = new Date(props.crimedate),
        time = timeUtil.convertMilitaryTimeToStandard(props.crimetime),
        itemData = {
            description: `${props.neighborhood} - ${props.location} - ${props.description}`,
            icon: props.buildIcon(props.description),
            image: props.image,
            title: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} - ${time}`
        };

    return (
        <TouchableOpacity onPress={handleClickItem}>
            <ImageAndDescription {...itemData} />
        </TouchableOpacity>
    );
}

CrimeEventItem.propTypes = {
    buildIcon: PropTypes.func,
    crimedate: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.node,
    image: PropTypes.string,
    location: PropTypes.string,
    neighborhood: PropTypes.string,
}; 

export default CrimeEventItem;