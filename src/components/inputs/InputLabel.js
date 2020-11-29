import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

import colors from '../colors/colors';

/**
 * @description InputLabel
 * 
 * @returns {React.ReactNode}
 */
function InputLabel(props) {
    return (
        <View>
            <Text style={styles.label}>
                {props.label}:
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: 20,
        marginBottom: 15,
        color: colors.primary
    }
});

InputLabel.propTypes = {
    label: PropTypes.string
}; 

export default InputLabel;