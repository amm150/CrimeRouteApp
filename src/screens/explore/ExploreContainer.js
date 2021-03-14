import React, {
    useState,
    useEffect,
    useRef,
    useCallback
} from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    Platform
} from 'react-native';
import MapView from 'react-native-maps';
import PropTypes from 'prop-types';

import * as Permission from 'expo-permissions';
import colors from '../../components/colors/colors.json';

import PageHeader from '../../components/headers/PageHeader';
import SearchableAddressPicker from '../../components/dropdowns/SearchableAddressPicker';

import OpenBaltimoreDataHandler from '../../handlers/OpenBaltimoreData';
import OpenBaltimoreDataAdapter from '../../adapters/OpenBaltimoreCrimeDataAdapter';

import TimeUtil from '../../utils/TimeUtil';
import { LMS } from '../../consts/dateFormats';
import GoogleHandler from '../../handlers/GoogleHandler';
import FiltersMenu from '../../components/menus/FiltersMenu';

import AssaultIcon from '../../images/assault.png';
import ArsonIcon from '../../images/arson.png';
import LarcenyAutoIcon from '../../images/larcenyauto.png';
import DefaultCrimeIcon from '../../images/default-crime.png';
import RobberyIcon from '../../images/robbery.png';
import ShootingIcon from '../../images/shooting.png';
import HomicideIcon from '../../images/homicide.png';

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
        [focusRoute, setFocusRoute] = useState(false),
        [filters, setFilters] = useState({
            description: [],
            weapon: [],
            crimedatetime: []
        }),
        openBaltimoreDataHandler = useRef(new OpenBaltimoreDataHandler()).current,
        openBaltimoreDataAdapter = useRef(new OpenBaltimoreDataAdapter()).current,
        googleHandler = useRef(new GoogleHandler()).current,
        openDataBaltimoreFilters = openBaltimoreDataAdapter.getFilters();

    const fetchRoute = useCallback(() => {
        const queryData = {
            alternatives: true,
            destination: `${toLocation.latitude},${toLocation.longitude}`,
            mode: 'walking',
            origin: `${fromLocation.latitude},${fromLocation.longitude}`
        };

        return googleHandler.getDirections(queryData);
    }, [
        fromLocation,
        googleHandler,
        toLocation
    ]);

    useEffect(() => {
        if (!fromLocation || !toLocation) {
            setShowRoute(false);
        } else if (fromLocation && toLocation) {
            fetchRoute().then((response) => {
                setRoute(response.routes[0].route);
                setShowRoute(true);
                setFocusRoute(true);
            });
        }
    }, [
        fromLocation,
        toLocation,
        fetchRoute
    ]);

    const fetchResults = useCallback(() => {
        const getResultsPostData = {
                filters: filters,
                f: 'json',
                orderByFields: 'CrimeDateTime DESC',
                outFields: '*',
                resultRecordCount: 100
            };

        return openBaltimoreDataHandler.getCrimeData(getResultsPostData);
    }, [
        filters,
        openBaltimoreDataHandler
    ]);

    function calculateCurrentLocation() {
        let location = null;

        if (currentLocation) {
            location = currentLocation;
        } else if (nativeCurrentLocation) {
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
        Keyboard.dismiss();
        setFromLocation(coords);
    }

    function handleSelectToLocation(coords) {
        Keyboard.dismiss();
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

        /**
         * If we can't use the default android or ios location system,
         * fallback to the browser navigator.geolocation tool to get the user's location.
         */
        if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
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
        return <ActivityIndicator size="large" color={colors.primary} />;
    }

    function buildMarker(data, key = 'currentLocation', callout) {
        let child = null;

        if (callout) {
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
        function calculateIcon(data) {
            let icon = 'default-crime.png';

            switch (data.description) {
                case 'AGG. ASSAULT':
                case 'COMMON ASSAULT':
                case 'RAPE':
                    icon = AssaultIcon;
                    break;

                case 'ROBBERY - COMMERCIAL':
                case 'ROBBERY - RESIDENCE':
                case 'ROBBERY - STREET':
                case 'BURGLARY':
                case 'LARCENY':
                    icon = RobberyIcon;
                    break;

                case 'SHOOTING':
                    icon = ShootingIcon;
                    break;

                case 'ARSON':
                    icon = ArsonIcon;
                    break;

                case 'HOMICIDE':
                    icon = HomicideIcon;
                    break;

                case 'LARCENY FROM AUTO':
                case 'ROBBERY - CARJACKING':
                case 'AUTO THEFT':
                    icon = LarcenyAutoIcon;
                    break;

                default:
                    icon = DefaultCrimeIcon;
                    break;
            }

            return icon;
        }

        const markers = crimes.map((crimeData, index) => {
            let marker;

            const markerData = {
                    coordinate: {
                        latitude: Number(crimeData.latitude),
                        longitude: Number(crimeData.longitude)
                    },
                    image: calculateIcon(crimeData)
                };

            if (!Number.isNaN(crimeData.latitude) || !Number.isNaN(crimeData.longitude)) {
                const date = timeUtil.buildDateString(crimeData.crimedate, LMS),
                    callout = (
                        <View style={styles.callout}>
                            <Text style={styles.calloutText}>
                                {props.translations['date']}
                                :
                                {date}
                            </Text>
                            <Text style={styles.calloutText}>
                                {props.translations['location']}
                                :
                                {crimeData.location}
                            </Text>
                            <Text style={styles.calloutText}>
                                {props.translations['description']}
                                :
                                {crimeData.description}
                            </Text>
                            <Text style={styles.calloutText}>
                                {props.translations['neighborhood']}
                                :
                                {crimeData.neighborhood}
                            </Text>
                            <Text style={styles.calloutText}>
                                {props.translations['weapon']}
                                :
                                {crimeData.weapon}
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

        if (focusRoute) {
            mapRef.current.fitToCoordinates(route, {
                edgePadding: {
                    top: 300,
                    right: 50,
                    bottom: 50,
                    left: 50
                },
                animated: true
            });

            setFocusRoute(false);
        }

        return <MapView.Polyline {...routeData} />;
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

            markup = <SearchableAddressPicker {...fromAddressPickerData} />;
        }

        return markup;
    }

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
                if (Platform.OS === 'android') {
                    await Permission.askAsync(Permission.LOCATION);
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
                    <SearchableAddressPicker {...toAddressPickerData} />
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
            filterOptions: openDataBaltimoreFilters,
            handleChangeFilters: handleChangeFilters,
            selectedFilters: filters
        };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <PageHeader {...headerData} />
                <FiltersMenu {...filtersData} />
                <View style={styles.contents}>
                    {markup}
                </View>
            </View>
        </TouchableWithoutFeedback>
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
    initialRegion: {
        latitude: 39.299236,
        longitude: -76.609383,
        latitudeDelta: 0.4,
        longitudeDelta: 0.1,
    },
    loadingEnabled: true,
    provider: 'google',
    showsUserLocation: true,
    showsMyLocationButton: true,
    style: styles.map,
    userLocationUpdateInterval: 1000
};

ExploreContainer.propTypes = {
    translations: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        translations: state.translations
    };
};

export default connect(mapStateToProps, { })(ExploreContainer);