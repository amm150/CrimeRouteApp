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
import OpenBaltimoreDataAdapter from '../../adapters/OpenBaltimoreCrimeDataAdapter';

import TimeUtil from '../../utils/TimeUtil';
import { LMS } from '../../consts/dateFormats';
import GoogleHandler from '../../handlers/GoogleHandler';

import FiltersMenu from '../../components/menus/FiltersMenu';

/**
 * @description ExploreContainer
 * 
 * @returns {React.ReactNode}
 */
function ExploreContainer(props) {
    const timeUtil = useRef(new TimeUtil()).current,
        mapRef = useRef(null),
        [crimes, setCrimes] = useState([]),
        [currentLocation, setCurrentLocation] = useState(null),
        [nativeCurrentLocation, setNativeCurrentLocation] = useState(null),
        [fromLocation, setFromLocation] = useState(null),
        [toLocation, setToLocation] = useState(null),
        [loading, setLoading] = useState(true),
        [showRoute, setShowRoute] = useState(false),
        [route, setRoute] = useState([]),
        [filters, setFilters] = useState({
            description: [],
            weapon: [],
            crimedatetime: []
        }),
        openBaltimoreDataHandler = useRef(new OpenBaltimoreDataHandler()).current,
        openBaltimoreDataAdapter = useRef(new OpenBaltimoreDataAdapter()).current,
        googleHandler = useRef(new GoogleHandler()).current;

    function fetchRoute() {
        const queryData = {
            alternatives: true,
            destination: `${toLocation.latitude},${toLocation.longitude}`,
            mode: 'walking',
            origin: `${fromLocation.latitude},${fromLocation.longitude}`
        };

        return googleHandler.getDirections(queryData);
    }

    useEffect(() => {
        if(!fromLocation || !toLocation) {
            setShowRoute(false);
        } else if (fromLocation && toLocation) {
            fetchRoute().then((response) => {
                setRoute(response.routes[0].route);
                setShowRoute(true);
            })
        }
    }, [
        fromLocation,
        toLocation
    ]);

    const fetchResults = useCallback(() => {
        const getResultsPostData = {
                filters: filters,
                f: 'json',
                orderByFields: 'CrimeDateTime DESC',
                outFields: '*',
                resultRecordCount: 50
            };
        
        return openBaltimoreDataHandler.getCrimeData(getResultsPostData);
    }, [
        filters
    ]);

    function calculateCurrentLocation() {
        let location = null;

        if(currentLocation) {
            location = currentLocation;
        } else if(nativeCurrentLocation) {
            location = nativeCurrentLocation;
        }

        return location;
    }

    function updateCurrentLocation(data) {
        setCurrentLocation({
            latitude: data.coords.latitude,
            longitude: data.coords.longitude
        });
    }

    function handleSelectFromLocation(coords) {
        setFromLocation(coords);
    }

    function handleSelectToLocation(coords) {
        setToLocation(coords);
    }
    
    function handleRemoveFromLocation() {
        setFromLocation(null);
    }

    function handleRemoveToLocation() {
        setToLocation(null);
        setFromLocation(null);
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
                setCrimes(response.results);
                setLoading(false);
            });
    }, [
        fetchResults,
        filters
    ]);

    function buildLoadingState() {
        return <ActivityIndicator size={'large'} color={colors.primary}/>;
    }

    function buildMarker(data, key = 'currentLocation', callout) {
        let child = null;

        if(callout) {
            child = (
                <MapView.Callout style={{ flex: 1, position: 'absolute' }}>
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
                    pinColor: 'red'
                };
                
            if(!isNaN(crimeData.latitude) || !isNaN(crimeData.longitude)) {
                const date = timeUtil.buildDateString(crimeData.crimedate, LMS),
                    callout = (
                        <View style={styles.callout}>
                            <Text style={styles.calloutText}>
                                {props.translations['date']}: {date}
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

    function buildRoutePath() {
        const routeData = {
            coordinates: route,
            fillColor: colors.primary,
            geodesic: false,
            strokeColor: colors.primary,
            strokeWidth: 5
        };

        return <MapView.Polyline {...routeData} />
    }
    
    function buildFromAddressPicker() {
        let markup;

        if (toLocation) {
            const fromAddressPickerData = {
                address: fromLocation,
                currentLocation: calculateCurrentLocation(),
                handleSelectAddress: handleSelectFromLocation,
                handleRemoveAddress: handleRemoveFromLocation,
                placeholderText: props.translations['from']
            };

            markup = <SearchableAddressPicker {...fromAddressPickerData}/>;
        }

        return markup;
    };

    function handleChangeUserLocation(newLoc) {
        setNativeCurrentLocation({
            latitude: newLoc.nativeEvent.coordinate.latitude,
            longitude: newLoc.nativeEvent.coordinate.longitude
        });
    }

    function buildMap() {
        const mapData = {
            onUserLocationChange: handleChangeUserLocation,
            onMapReady: async () => {
                if(Platform.OS === 'android') {
                    const { status } = await Permission.askAsync(Permission.LOCATION);
                }
            },
            ref: mapRef,
            ...mapOptions
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
        toAddressPickerData = {
            address: toLocation,
            currentLocation: calculateCurrentLocation(),
            handleSelectAddress: handleSelectToLocation,
            handleRemoveAddress: handleRemoveToLocation,
            placeholderText: props.translations['to']
        },
        fromAddressPicker = buildFromAddressPicker(),
        routePath = showRoute ? buildRoutePath() : null;

        return (
            <View style={StyleSheet.absoluteFillObject}>
                <MapView {...mapData}>
                    {crimeMarkers}
                    {currentLocationMarker}
                    {routePath}
                </MapView>
                <View style={styles.locationPicker}>
                    <SearchableAddressPicker {...toAddressPickerData}/>
                    {fromAddressPicker}
                </View>
            </View>
        );
    }

    function handleChangeFilters(newSelections) {
        setFilters(newSelections);
    }

    const headerData = {
            label: props.translations['explore']
        },
        markup = loading ? buildLoadingState() : buildMap(),
        filtersData = {
            filterOptions: openBaltimoreDataAdapter.getFilters(),
            handleChangeFilters: handleChangeFilters,
            selectedFilters: filters
        };

    return (
        <View style={styles.container}>
            <PageHeader {...headerData}/>
            <FiltersMenu {...filtersData} />
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
        flex: 1,
        padding: 5
    },
    locationPicker: {
        position: 'absolute',
        top: 0,
        width: '100%'
    }
});

const mapOptions = {
    options: {
        fullscreenControl: false,
        mapTypeControl: false,
        zoomControl: false
    },
    followsUserLocation: true,
    initialRegion: {
        latitude: 39.299236,
        longitude: -76.609383,
        latitudeDelta: 0.4,
        longitudeDelta: 0.1,
    },
    provider: 'google',
    showsUserLocation: true,
    style: styles.map,
    userLocationUpdateInterval: 1000
};

const mapStateToProps = (state) => {
    return {
        translations: state.translations
    }
};

export default connect(mapStateToProps, { })(ExploreContainer);