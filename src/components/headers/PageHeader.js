import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';

import SafeAreaView from 'react-native-safe-area-view';
import colors from '../colors/colors';
import IconButton from '../buttons/IconButton';

/**
 * @description PageHeader
 * 
 * @returns {React.ReactNode}
 */
function PageHeader(props) {
    function buildBackButton() {
        const buttonData = {
            color: colors.black,
            disabled: false,
            handleClickButton: props.handleClickBack,
            icon: 'back'
        };

        return (
            <View style={styles.backButton}>
                <IconButton {...buttonData}/>
            </View>
        );
    }

    const backButton = props.includeBackButton ? buildBackButton() : null;

    return (
        <View style={styles.wrapper}>
            <SafeAreaView forceInset={{ top: 'always' }}>
                <View style={styles.container}>
                    {backButton}
                    <Text style={styles.text}>
                        {props.label}
                    </Text>
                </View>
            </SafeAreaView> 
        </View>
    );
}

const styles = StyleSheet.create({
	container: {
        height: 60,
        backgroundColor: colors.white,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
        marginRight: 15
    },
    backButton: {
        alignSelf: 'flex-start'
    },  
    wrapper: {
        backgroundColor: colors.white,
        borderBottomColor: colors['light-gray'],
        borderBottomWidth: 1
    },
    text: {
        position: 'absolute',
        fontSize: 30,
        textAlign: 'center',
        margin: 'auto'
    }
});

PageHeader.propTypes = {
    handleClickBack: PropTypes.func,
    includeBackButton: PropTypes.bool,
    label: PropTypes.string
}; 

export default PageHeader;