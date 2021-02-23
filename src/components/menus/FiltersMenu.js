import React, {
    useState
} from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableWithoutFeedback, Text, View, TouchableOpacity } from 'react-native';
import { BottomSheet, Button, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import colors from '../../components/colors/colors.json';


/**
 * @description FiltersMenu
 * 
 * @returns {React.ReactNode}
 */
function FiltersMenu(props) {
    const [showFiltersList, setShowFiltersList] = useState(false),
        [selectedFilterList, setSelectedFilterList] = useState(null),
        [selectedFilters, setSelectedFilters] = useState(props.selectedFilters);

    function handleClickSave() {
        props.handleChangeFilters(selectedFilters);

        setShowFiltersList(false);
        setSelectedFilterList(null);
    }

    function handleCloseFilterList() {
        handleClickSave();
    }

    function handleClickFilter(filterName) {
        // If we have a filter already open, save their changes before doing anything else.
        if(selectedFilterList !== null) {
            handleClickSave();
        }

        if(selectedFilterList === filterName) {
            handleCloseFilterList();
        } else {
            setSelectedFilterList(filterName);
            setShowFiltersList(true);
        }
    }

    function handleClickOption(id) {
        let newFilters;

        const selectedFiltersListArray = selectedFilters[selectedFilterList];

        // Already have this selected, so we want to remove it
        if(selectedFiltersListArray.includes(id)) {
            const newFiltersArray = [...selectedFiltersListArray],
                removedItemIndex = newFiltersArray.indexOf(id);

            newFiltersArray.splice(removedItemIndex, 1);

            newFilters = {
                ...selectedFilters,
                [selectedFilterList]: newFiltersArray
            };
        } else {
            const selections = selectedFilterList === 'crimedatetime' ? [id] : [...selectedFilters[selectedFilterList], id];

            newFilters = {
                ...selectedFilters,
                [selectedFilterList]: selections
            };
        }

        setSelectedFilters(newFilters);
    }

    function handleClickClearFilters() {
        const newFilters = Object.entries(selectedFilters).reduce((acc, [key, value]) => {
            return {
                ...acc,
                [key]: []
            }
        }, {});

        setSelectedFilters(newFilters);
        props.handleChangeFilters(newFilters);
    }

    function buildFilters() {
        const filters = Object.keys(props.filterOptions).map((currentFilter, idx) => {
            const buttonData = {
                buttonStyle: {
                    backgroundColor: colors.primary
                },
                titleStyle: {
                    color: colors.white
                },
                containerStyle: styles.filterButton,
                key: idx,
                onPress: () => {
                    handleClickFilter(currentFilter)
                },
                title: props.translations[currentFilter],
                type: 'outline'
            };

            return <Button {...buttonData} />;
        }, []),

        clearFiltersButtonData = {
            containerStyle: styles.filterButton,
            key: 'clear-filters',
            onPress: handleClickClearFilters,
            title: props.translations['clearfilters'],
            type: 'outline'
        },

        clearFiltersButton = <Button {...clearFiltersButtonData} />;

        return [...filters, clearFiltersButton];
    }

    function buildFiltersList() {
        const filters = props.filterOptions[selectedFilterList].map((filterOption, idx) => {
            const buttonData = {
                key: idx,
                onPress: () => {
                    handleClickOption(filterOption.id)
                },
                Component: TouchableOpacity
            },
            checkBoxData = {
                checkedIcon: selectedFilterList === 'crimedatetime' ? 'dot-circle-o' : 'check-square-o',
                checked: selectedFilters[selectedFilterList].includes(filterOption.id),
                onIconPress: () => {
                    handleClickOption(filterOption.id)
                },
                uncheckedIcon: selectedFilterList === 'crimedatetime' ? 'circle-o' : 'square-o'
            };


            return (
                <ListItem {...buttonData}>
                    <ListItem.Content style={styles.filterListItemContent}>
                        <ListItem.CheckBox {...checkBoxData}/>
                        <ListItem.Title>
                            {filterOption.name}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            );
        }, []),

        cancelButtonData = {
            containerStyle: {
                backgroundColor: colors.primary
            },
            key: 'close',
            onPress: handleCloseFilterList,
            Component: TouchableOpacity
        },

        cancelButton = (
            <ListItem {...cancelButtonData}>
                <ListItem.Content>
                    <ListItem.Title style={{color: colors.white}}>
                        {props.translations['close']}
                    </ListItem.Title>
                </ListItem.Content>
            </ListItem>
        );
        
        return [...filters, cancelButton];
    }

    const sheetData = {
        containerStyle: styles.filtersList,
        isVisible: showFiltersList,
        onRequestClose: handleCloseFilterList
    },
    filtersList = showFiltersList ? buildFiltersList() : null,
    bottomSheet = showFiltersList ? (
        <TouchableWithoutFeedback onPress={handleCloseFilterList}>
            <BottomSheet {...sheetData}>
                {filtersList}
            </BottomSheet>
        </TouchableWithoutFeedback>
    ) : null;

    return (
        <View style={styles.container}>
            <View style={styles.filtersContainer}>
                {buildFilters()}
            </View>
            {bottomSheet}
        </View>
    );
}

const styles = StyleSheet.create({
    filterListItemContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    filtersContainer: {
        display: 'flex',
        flexDirection: 'row',
        overflow: 'scroll'
    },
    filterButton: {
        margin: 5
    },
    container: {
        backgroundColor: colors.white
    }
});

FiltersMenu.propTypes = {
    filterOptions: PropTypes.object,
    handleChangeFilters: PropTypes.func,
    selectedFilters: PropTypes.object,
}; 

const mapStateToProps = (state) => {
    return {
        translations: state.translations
    }
};

export default connect(mapStateToProps, { })(FiltersMenu);