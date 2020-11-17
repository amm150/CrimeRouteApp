import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * @description NewsContainer
 * 
 * @returns {React.ReactNode}
 */
function NewsContainer() {

    return (
        <View>
            <Text style={styles.text}>
                This is the news screen.
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

export default NewsContainer;