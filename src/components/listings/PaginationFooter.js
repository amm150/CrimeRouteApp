import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Button } from 'react-native';
import colors from '../colors/colors';

/**
 * @description PaginationFooter
 * 
 * @returns {React.ReactNode}
 */
function PaginationFooter(props) {
    function handleClickBack() {
        props.handleChangePage(props.page - 1);
    }

    function handleClickNext() {
        props.handleChangePage(props.page + 1);
    }

    function buildBackButton() {
        const buttonData = {
            color: colors.primary,
            disabled: props.page == 1,
            onPress: handleClickBack,
            title: '<'
        };

        return (
            <View style={styles.button}>
                <Button {...buttonData}/>
            </View>
        );
    }

    function buildNextButton() {
        const buttonData = {
            color: colors.primary,
            disabled: props.pageCount == props.page,
            onPress: handleClickNext,
            title: '>'
        };

        return (
            <View style={styles.button}>
                <Button {...buttonData}/>
            </View>
        );
    }

    function buildPageButton(value) {
        const selected =  props.page == value,
            buttonData = {
                color: selected ? colors.white : colors.primary,
                onPress: () => {
                    props.handleChangePage(Number(value))
                },
                title: value
            },
            buttonStyles = selected ? styles.buttonActive : styles.button;

        return (
            <View style={buttonStyles} key={value}>
                <Button {...buttonData}/>
            </View>
        );
    }

    function buildPageButtons() {
        const maxButtons = 6,
            max = props.pageCount >= maxButtons ? maxButtons : props.pageCount,
            halfMaxCount = Math.floor(max / 2) + 1;

        let buttons = [],
            start = 1,
            end = props.pageCount,
            i = 1;

        while(i < halfMaxCount) {
            if (props.page - i > 0) {
                start = props.page - i;
            }

            if (props.page + i <= props.pageCount) {
                end = props.page + i;
            }

            i++;
        }

        let startSet = false,
            endSet = false;

        while((end - start + 1) < max) {
            if (start - 1 >= 1 && !startSet) {
                start -= 1;
            } else {
                startSet = true;
            }

            if (end + 1 <= max && !endSet) {
                end += 1;
            } else {
                endSet = true;
            }
        }

        for (let i = start; i <= end; i++) {
            const pageNumber = i.toString(),
                button = buildPageButton(pageNumber);

            buttons.push(button);
        }

        return buttons;
    }

    const backButton = buildBackButton(),
        nextButton = buildNextButton(),
        pageButtons = buildPageButtons();

    return (
        <View style={styles.container}>
            {backButton}
            {pageButtons}
            {nextButton}
        </View>
    );
}

const styles = StyleSheet.create({
	container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 15
    },
    button: {
        borderWidth: 1,
        borderColor: 'black',
        margin: 5,
        borderRadius: 5,
        overflow: 'hidden'
    },
    buttonActive: {
        borderWidth: 1,
        borderColor: colors.primary,
        backgroundColor: colors.primary,
        color: colors.primary,
        margin: 5,
        borderRadius: 5,
        overflow: 'hidden'
    }
});

PaginationFooter.propTypes = {
    handleChangePage: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    page: PropTypes.number,
    pageCount: PropTypes.number,
    pageSize: PropTypes.number,
    totalResults: PropTypes.number
}; 

export default PaginationFooter;