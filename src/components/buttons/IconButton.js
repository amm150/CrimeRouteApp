import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import colors from '../colors/colors';
import Icon from '../icons/Icon';

/**
 * @description IconButton
 * 
 * @returns {React.ReactNode}
 */
function IconButton(props) {
    function handleClickButton() {
        if(!props.disabled){
            props.handleClickButton();
        }
    }

    const iconData = {
            color: props.color,
            name: props.icon
        },
        buttonData = {
            onPress: handleClickButton
        };

    return (
        <TouchableOpacity {...buttonData}>
            <View style={styles.buttonWrapper}>
                <Icon {...iconData}/>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonWrapper: {
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: colors.white,
        height: 40,
        width: 40,
        padding: 5
    }
});

IconButton.defaultProps = {
    disabled: false
};

IconButton.propTypes = {
    color: PropTypes.string,
    disabled: PropTypes.bool,
    handleClickButton: PropTypes.func.isRequired,
    name: PropTypes.string
}; 

export default IconButton;