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
import { PieChart } from 'react-native-svg-charts';
import { Card } from 'react-native-elements';
import OpenBaltimoreDataHandler from '../../handlers/OpenBaltimoreData';
import colors from '../colors/colors.json';
import translations from '../../translations/english';
import ChartEmptyState from './ChartEmptyState';

/**
 * @description CrimeCountChart
 *
 * @returns {React.ReactNode}
 */
function CrimeCountChart(props) {
    const [loading, setLoading] = useState(true),
        [results, setResults] = useState([]),
        [selection, setSelection] = useState({
            name: '',
            value: 0
        }),
        openBaltimoreDataHandler = useRef(new OpenBaltimoreDataHandler()).current,
        colorOptions = [colors['dark-gray'], colors['primary-focused'], colors['light-gray'], colors.primary];

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
            if (response.results.length > 0) {
                setSelection({
                    name: response.results[0].name,
                    value: response.results[0].value
                });
            }

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

    function formatData(data) {
        const sortedData = [...data].sort((a, b) => {
            return a.value - b.value;
        });

        return sortedData.filter((item) => item.value > 0).map((itemData, index) => {
            const n = index / colorOptions.length,
                colorIndex = (n - Math.floor(n)) * colorOptions.length;

            return {
                value: itemData.value,
                svg: {
                    fill: colorOptions[colorIndex]
                },
                key: `${props.field}-${index}`,
                onPress: () => {
                    setSelection({
                        name: itemData.name,
                        value: itemData.value
                    });
                }
            };
        });
    }

    function buildLoadingState() {
        return <ActivityIndicator size="large" color={colors.primary} />;
    }

    function buildChart() {
        let chart;

        if (results.length > 1) {
            const formattedData = formatData(results),
                chartData = {
                    data: formattedData,
                    innerRadius: 50,
                    outerRadius: 100,
                    style: { height: 250, width: '100%' }
                };

            chart = (
                <PieChart {...chartData}>
                    <View style={styles.selectedLabel}>
                        <Text style={styles.selectedLabelName}>
                            {selection.name}
                        </Text>
                        <Text style={styles.selectedLabelValue}>
                            {selection.value}
                        </Text>
                    </View>
                </PieChart>
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
            <View style={styles.container}>
                <Text style={styles.title}>
                    {props.title}
                </Text>
                <View style={styles.content}>
                    {markup}
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
	container: {
        flex: 1
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 250
    },
    title: {
        fontSize: 18,
        textAlign: 'center'
    },
    selectedLabel: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectedLabelValue: {
        color: colors['dark-gray'],
        maxWidth: 100,
        textAlign: 'center'
    },
    selectedLabelName: {
        color: colors.primary,
        maxWidth: 100,
        textAlign: 'center'
    }
});

CrimeCountChart.propTypes = {
    field: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    handleDecreaseRefreshingCount: PropTypes.func.isRequired,
    handleIncreaseRefreshingCount: PropTypes.func.isRequired,
    refreshing: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired
};

export default CrimeCountChart;