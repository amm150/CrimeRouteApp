import React, {
    useEffect,
    useState,
    useRef,
    useCallback
} from 'react';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView, Text, View} from 'react-native';

import PageHeader from '../../components/headers/PageHeader';
import ListingWithPagination from '../../components/listings/ListingWithPagination';
import CrimeEventItem from '../../components/listings/items/CrimeEventItem';
import CrimeEventView from './CrimeEventView';
import ImageAndDescriptionLoadingState from '../../components/listings/items/loading-states/ImageAndDescriptionLoadingState';
import Icon from '../../components/icons/Icon';

import OpenBaltimoreDataHandler from '../../handlers/OpenBaltimoreData';
import OpenBaltimoreDataAdapter from '../../adapters/OpenBaltimoreCrimeDataAdapter';
import colors from '../../components/colors/colors';
import FiltersMenu from '../../components/menus/FiltersMenu';

/**
 * @description StatisticsContainer
 * 
 * @returns {React.ReactNode}
 */
function StatisticsContainer(props) {
    const [initializing, setInitializing] = useState(true),
        [eventSelected, setEventSelected] = useState(false),
        [eventData, setEventData] = useState({}),
        [filters, setFilters] = useState({
            crimedatetime: [],
            description: [],
            weapon: []
        }),
        [page, setPage] = useState(1),
        [pageSize, setPageSize] = useState(5),
        [totalResults, setTotalResults] = useState(0),
        [loading, setLoading] = useState(true),
        [results, setResults] = useState([]),
        openBaltimoreDataHandler = useRef(new OpenBaltimoreDataHandler()).current,
        openBaltimoreDataAdapter = useRef(new OpenBaltimoreDataAdapter()).current,
        ref = React.useRef(null);

    const fetchResults = useCallback(() => {
        const getCountPostData = {
                filters: filters,
                f: 'json',
                returnCountOnly: true
            },
            getResultsPostData = {
                filters: filters,
                f: 'json',
                orderByFields: 'CrimeDateTime DESC',
                outFields: '*',
                resultOffset: pageSize * (page - 1),
                resultRecordCount: pageSize
            };

        // First get the total results count
        return openBaltimoreDataHandler.getCrimeData(getCountPostData)
            .then((response) => {
                setTotalResults(response.count);

                // Then get the actual results
                return openBaltimoreDataHandler.getCrimeData(getResultsPostData);
            });
    }, [
        pageSize,
        page,
        filters
    ]);
    
    useEffect(() => {
        if(initializing) {
            setInitializing(false);
        }
    }, [initializing]);

    useEffect(() => {
        setLoading(true);
        ref.current.scrollTo({
            x: 0, 
            y: 0, 
            animated: true
        })

        fetchResults()
            .then((response) => {
                setResults(response.results);
                setLoading(false);
            });
    }, [
        fetchResults,
        page,
        pageSize
    ])

    function handleChangePage(newPage) {
        setPage(newPage);
    }

    function buildIcon() {
        return <Icon name={'crime'} color={colors['dark-gray']} />;
    }

    function handleClickItem(data) {
        setEventSelected(true);
        setEventData(data);
    }

    function handleClickBack() {
        setEventSelected(false);
        setEventData({});
    }

    function buildListing() {
        const commonItemData = {
                buildIcon: buildIcon,
                handleClickItem: handleClickItem
            },
            listingData = {
                commonItemData: commonItemData,
                handleChangePage: handleChangePage,
                items: results,
                listingItem: CrimeEventItem,
                listingItemLoadingState: ImageAndDescriptionLoadingState,
                loading: loading || initializing,
                loadingStateItemCount: 10,
                page: page,
                pageSize: pageSize,
                totalResults: totalResults
            };

        return <ListingWithPagination {...listingData}/>
    }

    function handleChangeFilters(newSelections) {
        setFilters(newSelections);
    }

    function buildEventView() {
        const data = {
            ...eventData
        };

        return <CrimeEventView {...data}/>
    }

    const headerData = {
            label: props.translations['statistics'],
            includeBackButton: eventSelected,
            handleClickBack: handleClickBack
        },
        pageContents = eventSelected ? buildEventView() : buildListing(),
        filtersData = {
            filterOptions: openBaltimoreDataAdapter.getFilters(),
            handleChangeFilters: handleChangeFilters,
            selectedFilters: filters
        };

    return (
        <View style={styles.container}>
            <PageHeader {...headerData}/>
            <FiltersMenu {...filtersData} />
            <ScrollView ref={ref} style={styles.contents} >
                {pageContents}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },  
	contents: {

    }
});

const mapStateToProps = (state) => {
    return {
        translations: state.translations
    }
};

export default connect(mapStateToProps, { })(StatisticsContainer);