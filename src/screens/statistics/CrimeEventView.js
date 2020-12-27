import React, {
    useRef
} from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import TimeUtil from '../../utils/TimeUtil';

/**
 * @description CrimeEventView
 * 
 * @returns {React.ReactNode}
 */
function CrimeEventView(props) {
    const timeUtil = useRef(new TimeUtil()).current,
        date = new Date(props.crimedate),
        time = props.crimetime ? timeUtil.convertMilitaryTimeToStandard(props.crimetime) : 'N/A',
        formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} - ${time}`;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {props.translations['date']}: {formattedDate}
            </Text>
            <Text style={styles.text}>
                {props.translations['location']}: {props.location}
            </Text>
            <Text style={styles.text}>
                {props.translations['description']}: {props.description}
            </Text>
            <Text style={styles.text}>
                {props.translations['neighborhood']}: {props.neighborhood}
            </Text>
            <Text style={styles.text}>
                {props.translations['district']}: {props.district}
            </Text>
            <Text style={styles.text}>
                {props.translations['weapon']}: {props.weapon}
            </Text>
            <Text style={styles.text}>
                {props.translations['crimecode']}: {props.crimecode}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15
    },  
	text: {
        fontSize: 18
    }
});

CrimeEventView.propTypes = {
    crimecode: PropTypes.string,
    crimedate: PropTypes.string,
    crimetime: PropTypes.string,
    description: PropTypes.string,
    district: PropTypes.string,
    inside_outside: PropTypes.string,
    latitude: PropTypes.string,
    location: PropTypes.string,
    longitude: PropTypes.string,
    neighborhood: PropTypes.string,
    post: PropTypes.string,
    premise: PropTypes.string,
    total_incidents: PropTypes.string,
    weapon: PropTypes.string,
}

const mapStateToProps = (state) => {
    return {
        translations: state.translations
    }
};

export default connect(mapStateToProps, { })(CrimeEventView);