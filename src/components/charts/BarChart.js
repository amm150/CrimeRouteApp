import React from 'react';
import PropTypes from 'prop-types';
import {
    View,
    StyleSheet
} from 'react-native';
import { BarChart as SvgBarChart, Grid, YAxis } from 'react-native-svg-charts';
import { Text } from 'react-native-svg';
import colors from '../colors/colors.json';

/**
 * @description BarChart
 *
 * @returns {React.ReactNode}
 */
function BarChart(props) {
    function formatData(data) {
        const sortedData = [...data].sort((a, b) => {
            return b.value - a.value;
        });

        return sortedData.filter((item) => item.value > 0).map((itemData) => {
            return {
                label: itemData.name,
                value: itemData.value
            };
        });
    }

    const formattedData = formatData(props.data),
        axisData = {
            data: formattedData,
            yAccessor: ({ index }) => index,
            contentInset: {
                top: 25,
                bottom: 25
            },
            svg: {
                fill: colors['primary-focused']
            },
            spacing: 0.2,
            numberOfTicks: formattedData.length,
            formatLabel: (_, index) => formattedData[formattedData.length - index - 1].label
        },
        chartData = {
            data: formattedData,
            contentInset: {
                top: 10,
                bottom: 10
            },
            gridMin: 0,
            horizontal: true,
            svg: {
                fill: colors.primary
            },
            spacing: 0.2,
            style: { flex: 1, marginLeft: 8 },
            yAccessor: ({ item }) => item.value
        },
        Labels = ({
            x, y, bandwidth, data
        }) => (
            data.map((item, index) => {
                const max = formattedData[0].value / 4,
                    textData = {
                        key: index,
                        x: item.value > max ? x(0) + 10 : x(item.value) + 10,
                        y: y(index) + (bandwidth / 2),
                        fontSize: 14,
                        fill: item.value > max ? colors.white : colors.black,
                        alignmentBaseline: 'middle'
                    };

                return (
                    <Text {...textData}>
                        {item.value}
                    </Text>
                );
            })
        );

    return (
        <View style={styles.container}>
            <YAxis {...axisData} />
            <SvgBarChart {...chartData}>
                <Grid direction={Grid.Direction.VERTICAL} />
                <Labels />
            </SvgBarChart>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 325,
        flex: 1,
        paddingVertical: 16
    }
});

BarChart.propTypes = {
    data: PropTypes.array.isRequired,
    field: PropTypes.string.isRequired
};

export default BarChart;