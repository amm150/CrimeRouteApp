import React, {
    useState,
    useEffect,
    useRef,
    useCallback
} from 'react';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, ActivityIndicator, Platform, PermissionsAndroid } from 'react-native';
import MapView from 'react-native-maps';

import colors from '../../components/colors/colors';
import * as Permission from 'expo-permissions';
 
import PageHeader from '../../components/headers/PageHeader';
import SearchableAddressPicker from '../../components/dropdowns/SearchableAddressPicker';

import OpenBaltimoreDataHandler from '../../handlers/OpenBaltimoreData';
import TimeUtil from '../../utils/TimeUtil';

const baltimoreCityRegion = {
    latitude: 39.299236,
    longitude: -76.609383,
    latitudeDelta: 0.4,
    longitudeDelta: 0.1,
};

/**
 * @description ExploreContainer
 * 
 * @returns {React.ReactNode}
 */
function ExploreContainer(props) {
    const timeUtil = useRef(new TimeUtil()).current,
        [crimes, setCrimes] = useState([]),
        [currentLocation, setCurrentLocation] = useState(null),
        [loading, setLoading] = useState(true),
        openBaltimoreDataHandler = useRef(new OpenBaltimoreDataHandler()).current;

    const fetchResults = useCallback(() => {
        // Gets the date two weeks ago
        const getResultsPostData = {
                $order: `crimedate desc`,
                $limit: 150
            };
        
        return openBaltimoreDataHandler.getCrimeData(getResultsPostData);
    }, []);

    function updateCurrentLocation(data) {
        setCurrentLocation({
            latitude: data.coords.latitude,
            longitude: data.coords.longitude
        });
    }

    useEffect(() => {
        const options = {
            enableHighAccuracy: true
        };

        // If we can't use the default android or ios location system, fallback to the browser navigator.geolocation tool to get the user's location.
        if(Platform.OS !== 'ios' && Platform.OS !== 'android') {
            navigator.geolocation.watchPosition(updateCurrentLocation, () => {}, options);
        }
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

    function buildMarker(data, key = 'currentLocation', callout) {
        let child;

        if(callout) {
            child = (
                <MapView.Callout>
                    {callout}
                </MapView.Callout>
            );
        }

        return (
            <MapView.Marker key={key} {...data}>
                {child}
            </MapView.Marker>
        );
    }

    function buildCrimeMarkers() {
        const markers = crimes.map((crimeData, index) => {
            let marker,
                markerData = {
                    coordinate: {
                        latitude: Number(crimeData.latitude),
                        longitude: Number(crimeData.longitude)
                    },
                    pinColor: 'blue'
                };
                
            if(!isNaN(crimeData.latitude) || !isNaN(crimeData.longitude)) {
                const date = new Date(crimeData.crimedate),
                    time = crimeData.crimetime ? timeUtil.convertMilitaryTimeToStandard(crimeData.crimetime) : 'N/A',
                    title = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} - ${time}`,
                    callout = (
                        <View style={styles.callout}>
                            <Text style={styles.calloutText}>
                                {props.translations['date']}: {title}
                            </Text>
                            <Text style={styles.calloutText}>
                                {props.translations['location']}: {crimeData.location}
                            </Text>
                            <Text style={styles.calloutText}>
                                {props.translations['description']}: {crimeData.description}
                            </Text>
                            <Text style={styles.calloutText}>
                                {props.translations['neighborhood']}: {crimeData.neighborhood}
                            </Text>
                            <Text style={styles.calloutText}>
                                {props.translations['weapon']}: {crimeData.weapon}
                            </Text>
                        </View>
                    );
                marker = buildMarker(markerData, index, callout);
            }

            return marker;
        }, []);

        return markers;
    }

    function buildMap() {
        const mapData = {
            onMapReady: async () => {
                if(Platform.OS === 'android') {
                    const { status } = await Permission.askAsync(Permission.LOCATION);
                }
            },
            options: {
                fullscreenControl: false,
                mapTypeControl: false,
                zoomControl: false
            },
            followsUserLocation: true,
            initialRegion: baltimoreCityRegion,
            provider: 'google',
            showsUserLocation: true,
            style: styles.map,
            userLocationUpdateInterval: 1000
        },

        // If we had to manually get their location because they're using a browser.
        currentLocationMarker = currentLocation ? buildMarker({
            coordinate: {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude
            },
            icon: '../../icons/current-location.png'
        }) : null,

        crimeMarkers = buildCrimeMarkers(),
        locationPicker = <SearchableAddressPicker />;

        return (
            <MapView {...mapData}>
                {currentLocationMarker}
                {crimeMarkers}
                <View style={styles.locationPicker}>
                    {locationPicker}
                </View>
            </MapView>
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
        display: 'flex',
        flex: 1
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    contents: {
        display: 'flex',
        justifyContent: 'center',
        flex: 1,
        position: 'relative'
    },
    calloutText: {
        fontSize: 14
    },
    callout: {
        padding: 5
    },
    locationPicker: {
        position: 'absolute',
        top: 0,
        width: '100%'
    }
});


const mapStateToProps = (state) => {
    return {
        translations: state.translations
    }
};

export default connect(mapStateToProps, { })(ExploreContainer);