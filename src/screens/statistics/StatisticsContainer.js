import React, {
    useEffect,
    useState,
    useRef,
    useCallback
} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    RefreshControl,
    ScrollView,
    View
} from 'react-native';

import PageHeader from '../../components/headers/PageHeader';
import OpenBaltimoreCrimeDataAdapter from '../../adapters/OpenBaltimoreCrimeDataAdapter';
import FiltersMenu from '../../components/menus/FiltersMenu';
import CrimeCountChart from '../../components/charts/CrimeCountChart';
import usePrevious from '../../components/_hooks/usePrevious';

/**
 * @description StatisticsContainer
 *
 * @returns {React.ReactNode}
 */
function StatisticsContainer(props) {
    const [refreshing, setRefreshing] = useState(false),
        [refreshingCount, setRefreshingCount] = useState(0),
        prevRefreshingCount = usePrevious(refreshingCount),
        [filters, setFilters] = useState({
            crimedatetime: []
        }),
        openBaltimoreDataAdapter = useRef(new OpenBaltimoreCrimeDataAdapter()).current,
        ref = React.useRef(null);

    useEffect(() => {
        if (refreshingCount === 0 && prevRefreshingCount > 0) {
            setRefreshing(false);
        }
    }, [
        refreshingCount,
        prevRefreshingCount
    ]);

    function handleChangeFilters(newSelections) {
        setFilters(newSelections);
    }

    function handleRefreshData() {
        setRefreshing(true);
    }

    const handleIncreaseRefreshingCount = useCallback(() => {
        setRefreshingCount((prevCount) => {
            return prevCount + 1;
        });
    }, []);

    const handleDecreaseRefreshingCount = useCallback(() => {
        setRefreshingCount((prevCount) => {
            return prevCount - 1;
        });
    }, []);

    const headerData = {
            label: props.translations['statistics']
        },
        filtersData = {
            filterOptions: {
                crimedatetime: openBaltimoreDataAdapter.getFilters().crimedatetime
            },
            handleChangeFilters: handleChangeFilters,
            selectedFilters: filters
        },
        refreshControlData = {
            onRefresh: handleRefreshData,
            refreshing: Boolean(refreshingCount)
        },
        scrollViewData = {
            ref: ref,
            style: styles.contentsref,
            refreshControl: <RefreshControl {...refreshControlData} />
        },
        commonChartData = {
            filters: filters,
            handleDecreaseRefreshingCount: handleDecreaseRefreshingCount,
            handleIncreaseRefreshingCount: handleIncreaseRefreshingCount,
            refreshing: refreshing
        },
        byTypeData = {
            ...commonChartData,
            field: 'Description',
            title: props.translations['crimeByType']
        },
        byWeaponData = {
            ...commonChartData,
            field: 'Weapon',
            title: props.translations['crimeByWeapon']
        };

    return (
        <View style={styles.container}>
            <PageHeader {...headerData}/>
            <FiltersMenu {...filtersData} />
            <ScrollView {...scrollViewData}>
                <CrimeCountChart {...byTypeData}/>
                <CrimeCountChart {...byWeaponData}/>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flex: 1
    },
	contents: {
        paddingBottom: 100,
        marginBottom: 50
    }
});

StatisticsContainer.propTypes = {
    translations: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        translations: state.translations
    };
};

export default connect(mapStateToProps, { })(StatisticsContainer);