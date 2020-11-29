import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Image, Text, View } from 'react-native';

/**
 * @description ImageAndDescription
 * 
 * @returns {React.ReactNode}
 */
function ImageAndDescription(props) {
    function buildImage(){
        const imageData = {
            source: {
                uri: props.image
            },
            style: styles.image
        };

        return <Image {...imageData} />;
    }

    function buildIcon(){
        return (
            <View style={styles.image}>
                {props.icon}
            </View>
        );
    }

    const image = props.image ? buildImage() : buildIcon();

    return (
        <View style={styles.container}>
            {image}
            <View style={styles.text}>
                <Text style={styles.title}>
                    {props.title}
                </Text>
                <Text style={styles.description}>
                    {props.description}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
	container: {
        height: 'auto',
        display: 'flex',
        flexDirection: 'row',
        padding: 15
    },
    title: {
        fontSize: 18,

    },
    description: {
        fontSize: 14
    },
    image: {
        width: 50,
        height: 50,
        resizeMode: 'center'
    },
    text: {
        display: 'flex',
        flexDirection: 'column',
        marginLeft: 15,
        flex: 1
    }
});

ImageAndDescription.propTypes = {
    description: PropTypes.string,
    icon: PropTypes.node,
    image: PropTypes.string,
    title: PropTypes.string
}; 

export default ImageAndDescription;