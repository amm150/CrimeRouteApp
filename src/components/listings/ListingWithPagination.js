import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView, View } from 'react-native';

import PaginationFooter from '../listings/PaginationFooter';
import Listing from '../listings/Listing';

/**
 * @description ListingWithPagination
 * 
 * @returns {React.ReactNode}
 */
function ListingWithPagination(props) {
    function buildPagination() {
        const paginationData = {
            handleChangePage: props.handleChangePage,
            page: props.page,
            pageCount: Math.ceil(props.totalResults / props.pageSize),
            pageSize: props.pageSize,
            totalResults: props.totalResults
        };

        return <PaginationFooter {...paginationData} />;
    }
    const listingData = {
            commonItemData: props.commonItemData,
            items: props.items,
            listingItem: props.listingItem,
            listingItemLoadingState: props.listingItemLoadingState,
            loading: props.loading,
            loadingStateItemCount: props.loadingStateItemCount
        },
        pagination = props.totalResults > props.pageSize ? buildPagination() : null;

    return (
        <View style={styles.container}>
            <Listing {...listingData} />
            {pagination}
        </View>
    );
}

const styles = StyleSheet.create({
	container: {

    }
});

ListingWithPagination.propTypes = {
    commonItemData: PropTypes.object,
    items: PropTypes.array.isRequired,
    handleChangePage: PropTypes.func.isRequired,
    listingItem: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ]),
    listingItemLoadingState: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ]),
    loading: PropTypes.bool.isRequired,
    loadingStateItemCount: PropTypes.number,
    page: PropTypes.number,
    pageSize: PropTypes.number,
    totalResults: PropTypes.number
}; 

export default ListingWithPagination;