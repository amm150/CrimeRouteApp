import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

/**
 * @description ImageAndDescriptionLoadingState
 * 
 * @returns {React.ReactNode}
 */
function ImageAndDescriptionLoadingState() {
    return (
        <View style={styles.container}>
            <ShimmerPlaceHolder style={styles.image}/>
            <View style={styles.text}>
                <ShimmerPlaceHolder style={styles.title}/>
                <ShimmerPlaceHolder style={styles.description}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
	container: {
        height: 80,
        display: 'flex',
        flexDirection: 'row',
        padding: 15
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
        borderRadius: 20
    },
    description: {
        borderRadius: 20
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'center',
        borderRadius: 25
    },
    text: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 15
    }
});

export default ImageAndDescriptionLoadingState;