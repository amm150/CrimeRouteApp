import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';

/**
 * @description Listing
 * 
 * @returns {React.ReactNode}
 */
function Listing(props) {
    function buildListingItems() {
        let items = [],
            i = 0;
        
        while (i < props.itemCount) {
            i++;

            items.push(<Item key={i}/>);
        };

        return items;
    }

    const Item = props.listingItem,
        listingMarkup = buildListingItems();

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
        
    }
});

Listing.defaultProps = {
    itemCount: 10
};

Listing.propTypes = {
    itemCount: PropTypes.number,
    listingItem: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ])
}; 

export default Listing;