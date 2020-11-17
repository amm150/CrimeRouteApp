import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * @description StatisticsContainer
 * 
 * @returns {React.ReactNode}
 */
function StatisticsContainer() {

    return (
        <View>
            <Text style={styles.text}>
                This is the statistics screen.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
	text: {
		fontWeight: 'bold',
        fontSize: 30
	}
});

export default StatisticsContainer;