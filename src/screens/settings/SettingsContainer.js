import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * @description SettingsContainer
 * 
 * @returns {React.ReactNode}
 */
function SettingsContainer() {

    return (
        <View>
            <Text style={styles.text}>
                This is the settings screen.
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

export default SettingsContainer;