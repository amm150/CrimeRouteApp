import React, {
    useEffect,
    useState
} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import { PieChart as SvgPieChart } from 'react-native-svg-charts';
import colors from '../colors/colors.json';

/**
 * @description PieChart
 *
 * @returns {React.ReactNode}
 */
function PieChart(props) {
    const [selection, setSelection] = useState({
            name: '',
            value: 0
        }),
        colorOptions = [colors['dark-gray'], colors['primary-focused'], colors['light-gray'], colors.primary];

    useEffect(() => {
        if (selection.name === '' && selection.value === 0 && props.data.length) {
            const sortedData = [...props.data].sort((a, b) => {
                return b.value - a.value;
            }),
            selectedItem = sortedData[0];

            setSelection({
                name: selectedItem.name,
                value: selectedItem.value
            });
        }
    }, [
        props.data,
        selection
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

    const formattedData = formatData(props.data),
        chartData = {
            data: formattedData,
            innerRadius: 50,
            outerRadius: 100,
            style: { height: 250, width: '100%' }
        };

    return (
        <SvgPieChart {...chartData}>
            <View style={styles.selectedLabel}>
                <Text style={styles.selectedLabelName}>
                    {selection.name}
                </Text>
                <Text style={styles.selectedLabelValue}>
                    {selection.value}
                </Text>
            </View>
        </SvgPieChart>
    );
}

const styles = StyleSheet.create({
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

PieChart.propTypes = {
    data: PropTypes.array.isRequired,
    field: PropTypes.string.isRequired
};

export default PieChart;