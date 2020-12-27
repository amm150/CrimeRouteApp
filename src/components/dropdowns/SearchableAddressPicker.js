import React, {
    useEffect,
    useRef,
    useState
} from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { google } from '../../consts/apiKeys';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
 

function SearchableAddressPicker(props) {
    const [search, setSearch] = useState(''),
        [results, setResults] = useState([]),
        [showingResults, setShowingResults] = useState(false);

    // useEffect(() => {
    //     if(search.length) {
    //         const postData = {
    //             input: search
    //         };
    
    //         service = new google.maps.places.PlacesService();
    //         service.textSearch(search);

    //         // googleHandler.getAutocompleteAddresses(postData)
    //         //     .then((response) => {
    //         //         console.log(response);
    //         //         setResults(response.predictions);
    //         //         setShowingResults(true);
    //         //     });
    //     }
    // }, [
    //     search,
    //     googleHandler
    // ]);


    // function handleChangeSearch(searchValue) {
    //     setSearch(searchValue);
    // };

    const pickerData = {
            currentLocation: true,
            fetchDetails: true,
            placeholder: 'Search',
            onPress: (data, details = null) => {
                // 'details' is provided when fetchDetails = true
                console.log(data, details);
            },
            query: {
                key: google,
                language: 'en'
            },
            style: styles.picker,
            requestUrl: {
                useOnPlatform: 'web',
                // Have to use a proxy for this api since it blocks the request with CORS.
                url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api'
            }
        }

    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete {...pickerData}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    picker: {
        flex: 1
    }
});

SearchableAddressPicker.propTypes = {
    
};

export default SearchableAddressPicker;
