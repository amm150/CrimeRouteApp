import React, {
    useEffect,
    useState,
    useCallback,
    useRef
} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    ActivityIndicator,
    Text,
    View
} from 'react-native';
import { Card } from 'react-native-elements';
import OpenBaltimoreDataHandler from '../../handlers/OpenBaltimoreData';
import colors from '../colors/colors.json';
import translations from '../../translations/english';
import ChartEmptyState from './ChartEmptyState';
import PieChart from './PieChart';

/**
 * @description CrimeCountChart
 *
 * @returns {React.ReactNode}
 */
function CrimeCountChart(props) {
    const [loading, setLoading] = useState(true),
        [results, setResults] = useState([]),
        openBaltimoreDataHandler = useRef(new OpenBaltimoreDataHandler()).current,
        ChartComponent = useRef(props.chartType).current;

    const fetchResults = useCallback(() => {
        const postData = {
                filters: props.filters,
                f: 'json',
                groupByFieldsForStatistics: `${props.field}`,
                outFields: '*',
                outStatistics: `[{"statisticType":"COUNT","onStatisticField":"${props.field}","outStatisticFieldName":"${props.field}CrimeCount"}]`
            };

        // First get the total results count
        return openBaltimoreDataHandler.getCrimeCounts(postData, props.field);
    }, [
        props.field,
        props.filters,
        openBaltimoreDataHandler
    ]);

    const handleIncreaseRefreshingCountCallback = props.handleIncreaseRefreshingCount,
        handleDecreaseRefreshingCountCallback = props.handleDecreaseRefreshingCount;

    useEffect(() => {
        setLoading(true);

        if (props.refreshing) {
            handleIncreaseRefreshingCountCallback();
        }

        fetchResults().then((response) => {
            setLoading(false);
            setResults(response.results);

            console.log(response.results);

            if (props.refreshing) {
                handleDecreaseRefreshingCountCallback();
            }
        });
    }, [
        props.filters,
        fetchResults,
        props.refreshing,
        handleIncreaseRefreshingCountCallback,
        handleDecreaseRefreshingCountCallback
    ]);

    function buildLoadingState() {
        return <ActivityIndicator size="large" color={colors.primary} />;
    }

    function buildChart() {
        let chart;

        if (results.length > 1) {
            const chartData = {
                data: results,
                field: props.field
            };

            chart = (
                <ChartComponent {...chartData} />
            );
        } else {
            const emptyStateData = {
                message: translations['noresults']
            };

            chart = <ChartEmptyState {...emptyStateData} />;
        }

        return chart;
    }

    const markup = loading ? buildLoadingState() : buildChart();

    return (
        <Card>
            <Text style={styles.title}>
                {props.title}
            </Text>
            {markup}
        </Card>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        textAlign: 'center'
    }
});

CrimeCountChart.defaultProps = {
    chartType: PieChart
};

CrimeCountChart.propTypes = {
    chartType: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.func
    ]),
    field: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    handleDecreaseRefreshingCount: PropTypes.func.isRequired,
    handleIncreaseRefreshingCount: PropTypes.func.isRequired,
    refreshing: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired
};

export default CrimeCountChart;