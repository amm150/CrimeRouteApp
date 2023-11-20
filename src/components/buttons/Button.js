import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Button } from 'react-native';

import colors from '../colors/colors';

/**
 * @description Button
 * 
 * @returns {React.ReactNode}
 */
function ButtonComponent(props) {
    const buttonData = {
        color: colors.primary,
        disabled: props.disabled,
        onPress: props.handleClick,
        title: props.label
    };

    return (
        <View style={styles.buttonWrapper}>
            <Button {...buttonData}/>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonWrapper: {
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: colors.white
    }
});

ButtonComponent.propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string,
    handleClick: PropTypes.func.isRequired
}; 

export default ButtonComponent;