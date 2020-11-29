import React, {
    useState,
    useEffect,
    useRef,
    useCallback
} from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import MapView, { 
    Marker,
    PROVIDER_GOOGLE
} from 'react-native-maps';

import colors from '../../components/colors/colors';

import PageHeader from '../../components/headers/PageHeader';
import OpenBaltimoreDataHandler from '../../handlers/OpenBaltimoreData';

/**
 * @description ExploreContainer
 * 
 * @returns {React.ReactNode}
 */
function ExploreContainer(props) {
    const [crimes, setCrimes] = useState([]),
        [loading, setLoading] = useState(true),
        openBaltimoreDataHandler = useRef(new OpenBaltimoreDataHandler()).current;

        const fetchResults = useCallback(() => {
            const getResultsPostData = {
                    $limit: 0,
                    $offset: 0
                };
            
            return openBaltimoreDataHandler.getCrimeData(getResultsPostData);
        }, []);
    
        useEffect(() => {
            setLoading(true);
    
            fetchResults()
                .then((response) => {
                    setCrimes(response);
                    setLoading(false);
                });
        }, [
            fetchResults
        ]);

    function buildLoadingState() {
        return <ActivityIndicator size={'large'} color={colors.primary}/>;
    }

    function buildMap() {

        // TODO: Read the data from the crimes state and render the markers on the map
        return (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: 39.299236,
                        longitude: -76.609383,
                        latitudeDelta: 0.4,
                        longitudeDelta: 0.1,
                    }}
                    showsUserLocation={true}
                />
        );
    }

    const headerData = {
            label: props.translations['explore']
        },
        markup = loading ? buildLoadingState() : buildMap();

    return (
        <View style={styles.container}>
            <PageHeader {...headerData}/>
            <View style={styles.contents}>
                {markup}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
	text: {
		fontWeight: 'bold',
        fontSize: 30
    },
    container: {
        height: '100%'
    },  
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    contents: {
        display: 'flex',
        justifyContent: 'center',
        height: '100%'
    }
});


const mapStateToProps = (state) => {
    return {
        translations: state.translations
    }
};

export default connect(mapStateToProps, { })(ExploreContainer);