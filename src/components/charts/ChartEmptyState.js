import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

/**
 * @description ChartEmptyState
 * 
 * @returns {React.ReactNode}
 */
function ChartEmptyState(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {props.message}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
	container: {
        padding: 50
    },
    text: {
        fontSize: 24,
        textAlign: 'center'
    }
});

ChartEmptyState.propTypes = {
    message: PropTypes.string
}; 

export default ChartEmptyState;