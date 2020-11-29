import React, {
    useEffect,
    useState,
    useRef,
    useCallback
} from 'react';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView, Text, View } from 'react-native';

import PageHeader from '../../components/headers/PageHeader';
import ListingWithPagination from '../../components/listings/ListingWithPagination';
import CrimeEventItem from '../../components/listings/items/CrimeEventItem';
import CrimeEventView from './CrimeEventView';
import ImageAndDescriptionLoadingState from '../../components/listings/items/loading-states/ImageAndDescriptionLoadingState';
import Icon from '../../components/icons/Icon';

import OpenBaltimoreDataHandler from '../../handlers/OpenBaltimoreData';
import colors from '../../components/colors/colors';

/**
 * @description StatisticsContainer
 * 
 * @returns {React.ReactNode}
 */
function StatisticsContainer(props) {
    const [initializing, setInitializing] = useState(true),
        [eventSelected, setEventSelected] = useState(false),
        [eventData, setEventData] = useState({}),
        [page, setPage] = useState(1),
        [pageSize, setPageSize] = useState(10),
        [totalResults, setTotalResults] = useState(0),
        [loading, setLoading] = useState(true),
        [results, setResults] = useState([]),
        openBaltimoreDataHandler = useRef(new OpenBaltimoreDataHandler()).current,
        ref = React.useRef(null);

    const fetchResults = useCallback(() => {
        const getCountPostData = {
                $query: 'select count(*)'
            },
            getResultsPostData = {
                $limit: pageSize,
                $offset: pageSize * page
            };

        // First get the total results count
        return openBaltimoreDataHandler.getCrimeData(getCountPostData)
            .then((count) => {
                const totalResultsCount = Number(count[0].count);

                setTotalResults(totalResultsCount);

                // Then get the actual results
                return openBaltimoreDataHandler.getCrimeData(getResultsPostData);
            });
    }, [
        pageSize,
        page
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
                setResults(response);
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
        pageContents = eventSelected ? buildEventView() : buildListing();

    return (
        <View style={styles.container}>
            <PageHeader {...headerData}/>
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