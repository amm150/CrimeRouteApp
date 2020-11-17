import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

/**
 * @description ExploreContainer
 * 
 * @returns {React.ReactNode}
 */
function ExploreContainer() {

    return (
        <ScrollView>
            <Text style={styles.text}>
                This is the explore screen.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
	text: {
		fontWeight: 'bold',
        fontSize: 30
	}
});

export default ExploreContainer;