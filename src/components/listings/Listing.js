import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView, View } from 'react-native';

import ListingLoadingState from './loading-states/ListingLoadingState';
import colors from '../colors/colors';

/**
 * @description Listing
 * 
 * @returns {React.ReactNode}
 */
function Listing(props) {
    function buildListingMarkup() {
        let markup;

        if (props.loading) {
            const loadingStateData = {
                itemCount: props.loadingStateItemCount,
                listingItem: props.listingItemLoadingState
            };

            markup = <ListingLoadingState {...loadingStateData}/>;
        } else {
            markup = props.items.map((data, index) => {
                return (
                    <View style={styles.item} key={index}>
                        <Item {...props.commonItemData} {...data}/>
                    </View>
                );
            });
        }

        return markup;
    }

    const Item = props.listingItem,
        listingMarkup = buildListingMarkup();

    return (
        <View style={styles.container}>
            {listingMarkup}
        </View>
    );
}

const styles = StyleSheet.create({
	container: {
    },
    item: {
        borderColor: colors['dark-gray'],
        borderBottomWidth: 1,
        overflow:'hidden'
    }
});

Listing.propTypes = {
    commonItemData: PropTypes.object,
    items: PropTypes.array.isRequired,
    listingItem: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ]),
    listingItemLoadingState: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ]),
    loading: PropTypes.bool.isRequired,
    loadingStateItemCount: PropTypes.number
}; 

export default Listing;