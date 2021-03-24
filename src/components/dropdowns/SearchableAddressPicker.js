import React, {
    useRef,
    useState,
    useCallback
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    TouchableOpacity,
    FlatList,
    TextInput,
    ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { debounce } from 'lodash';
import Icon from '../icons/Icon';
import colors from '../colors/colors.json';

import GoogleHandler from '../../handlers/GoogleHandler';

function SearchableAddressPicker(props) {
    const googleHandler = useRef(new GoogleHandler()).current,
        [loading, setLoading] = useState(false),
        [searchValue, setSearchValue] = useState(props.selection),
        [results, setResults] = useState([]),
        [showResults, setShowResults] = useState(false);

    const fetchAutocompleteAddresses = useCallback((queryData) => {
        setLoading(true);

        return googleHandler.getAutocompleteAddresses(queryData).then((response) => {
            setResults(response.predictions);
            setShowResults(true);
            setLoading(false);
        });
    }, [
        googleHandler
    ]);

    const searchLocation = useCallback((value) => {
        setSearchValue(value);

        const queryData = {
            input: value,
            location: '39.299236, -76.609383',
            radius: 1600 * 20, // 1600 meters is 1 mile, radius of 150 miles.
            strictbounds: true
        };

        debouncedFetchAutocompleteAddresses(queryData);
    }, [
        debouncedFetchAutocompleteAddresses
    ]);

    const debouncedFetchAutocompleteAddresses = debounce(fetchAutocompleteAddresses, 250);

    async function getPlaceDetails(id) {
        const queryData = {
            fields: 'geometry',
            place_id: id
        };

        return googleHandler.getPlaceDetails(queryData);
    }

    function handleRemoveAddress() {
        setSearchValue('');
        setShowResults(false);

        props.handleRemoveAddress();
    }

    function buildRemoveIcon() {
        const iconData = {
            color: colors['dark-gray'],
            name: 'X'
        };

        return (
            <TouchableOpacity onPress={handleRemoveAddress}>
                <View style={styles.removeIcon}>
                    <Icon {...iconData} />
                </View>
            </TouchableOpacity>
        );
    }

    function buildPredefinedPlaces() {
        let places = [];

        if (props.currentLocation) {
            places = [{
                description: props.translations['currentlocation'],
                geometry: {
                    location: {
                        lat: Number(props.currentLocation.latitude),
                        lng: Number(props.currentLocation.longitude)
                    }
                },
                place_id: 'currentlocation'
            }];
        }

        return places;
    }

    function buildListing() {
        function buildItem(data) {
            const itemData = {
                style: styles.resultItem,
                onPress: () => {
                    setSearchValue(data.item.description);
                    setShowResults(false);

                    if (data.item.place_id !== 'currentlocation') {
                        getPlaceDetails(data.item.place_id).then((itemDetails) => {
                            const coordinates = {
                                latitude: itemDetails.result.geometry.location.lat,
                                longitude: itemDetails.result.geometry.location.lng
                            };

                            props.handleSelectAddress(coordinates, data.item.description);
                        });
                    } else if (data.item.place_id === 'currentlocation') {
                        props.handleSelectAddress({
                            latitude: data.item.geometry.location.lat,
                            longitude: data.item.geometry.location.lng
                        }, data.item.description);
                    }
                }
            };

            return (
                <TouchableOpacity {...itemData}>
                    <Text>{data.item.description}</Text>
                </TouchableOpacity>
            );
        }

        function buildResults() {
            let mergedResults = [...results];

            const pinnedResults = buildPredefinedPlaces();

            if (pinnedResults.length > 0) {
                mergedResults = [...pinnedResults, ...results];
            }

            return mergedResults;
        }

        let markup;

        if (loading) {
            const activityIndicatorData = {
                color: colors.primary,
                size: 'large'
            };

            markup = (
                <View style={styles.loadingIndicator}>
                    <ActivityIndicator {...activityIndicatorData} />
                </View>
            );
        } else {
            const listingData = {
                data: buildResults(),
                renderItem: buildItem,
                keyExtractor: (item) => item.place_id,
                style: styles.searchResultsContainer,
                keyboardShouldPersistTaps: 'handled'
            };

            markup = (
                <FlatList {...listingData} />
            );
        }

        return markup;
    }

    function handleFocus() {
        setShowResults(true);
    }

    const textInputData = {
        onBlur: () => {
            setShowResults(false);
        },
        clearButtonMode: 'always',
        placeholder: props.placeholderText,
        style: styles.searchBox,
        placeholderTextColor: colors['dark-gray'],
        refreshing: loading,
        returnKeyType: 'done',
        onFocus: handleFocus,
        onChangeText: searchLocation,
        value: searchValue
    },
    listing = showResults ? buildListing() : null,
    removeIcon = Platform.OS !== 'ios' ? buildRemoveIcon() : null;

    return (
        <View style={styles.container}>
            <View style={styles.searchWrapper}>
                <TextInput {...textInputData} />
                {removeIcon}
            </View>
            {listing}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 1,
    },
    searchWrapper: {
        display: 'flex',
        flexDirection: 'row'
    },
    searchResultsContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.white
    },
    loadingIndicator: {
        display: 'flex',
        justifyContent: 'center',
        flex: 1,
        width: '100%',
        backgroundColor: colors.white,
        height: 100
    },
    resultItem: {
        width: '100%',
        justifyContent: 'center',
        height: 40,
        borderBottomColor: colors['dark-gray'],
        borderBottomWidth: 1,
        paddingLeft: 15
    },
    searchBox: {
        flex: 1,
        height: 50,
        fontSize: 18,
        borderRadius: 8,
        borderColor: colors['dark-gray'],
        color: colors['black'],
        backgroundColor: colors['white'],
        borderWidth: 1.5,
        padding: 10
    },
    removeIcon: {
        width: 30,
        height: 30,
        position: 'relative',
        display: 'flex',
        flex: 1,
        justifyContent: 'center'
    }
});

SearchableAddressPicker.defaultProps = {
    currentLocation: null,
    placeholderText: '',
    selection: ''
};

SearchableAddressPicker.propTypes = {
    currentLocation: PropTypes.object,
    handleSelectAddress: PropTypes.func.isRequired,
    handleRemoveAddress: PropTypes.func.isRequired,
    placeholderText: PropTypes.string,
    selection: PropTypes.string,
    translations: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        translations: state.translations
    };
};

export default connect(mapStateToProps, { })(SearchableAddressPicker);