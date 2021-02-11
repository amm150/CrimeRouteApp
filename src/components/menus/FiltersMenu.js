import React, {
    useState
} from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
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
        [selectedFilterList, setSelectedFilterList] = useState(null);


    function handleCloseFilterList() {
        setSelectedFilterList(null);
        setShowFiltersList(false);
    }

    function handleClickFilter(filterName) {
        if(selectedFilterList === filterName) {
            handleCloseFilterList();
        } else {
            setSelectedFilterList(filterName);
            setShowFiltersList(true);
        }
    }

    function handleClickOption(id) {
        let newFilters;

        const selectedFiltersListArray = props.selectedFilters[selectedFilterList];

        // Already have this selected, so we want to remove it
        if(selectedFiltersListArray.includes(id)) {
            const newFiltersArray = [...selectedFiltersListArray],
                removedItemIndex = newFiltersArray.indexOf(id);

            newFiltersArray.splice(removedItemIndex, 1);

            newFilters = {
                ...props.selectedFilters,
                [selectedFilterList]: newFiltersArray
            };
        } else {
            const selections = selectedFilterList === 'crimedatetime' ? [id] : [...props.selectedFilters[selectedFilterList], id];

            newFilters = {
                ...props.selectedFilters,
                [selectedFilterList]: selections
            };
        }

        props.handleChangeFilters(newFilters);

        setShowFiltersList(false);
        setSelectedFilterList(null);
    }

    function buildFilters() {
        return Object.keys(props.filterOptions).map((currentFilter, idx) => {
            const buttonData = {
                containerStyle: styles.filterButton,
                key: idx,
                onPress: () => {
                    handleClickFilter(currentFilter)
                },
                title: props.translations[currentFilter],
                type: 'outline'
            };

            return <Button {...buttonData} />;
        }, []);
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
                checked: props.selectedFilters[selectedFilterList].includes(filterOption.id),
                onIconPress: () => {
                    handleClickOption(filterOption.id)
                }
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
            key: 'cancel',
            onPress: handleCloseFilterList,
            Component: TouchableOpacity
        },
        titleData = {
            style: {
                color: colors.white
            }
        },

        cancelButton = (
            <ListItem {...cancelButtonData}>
                <ListItem.Content>
                    <ListItem.Title {...titleData}>
                        {props.translations['cancel']}
                    </ListItem.Title>
                </ListItem.Content>
            </ListItem>
        )
        
        return [...filters, cancelButton];
    }

    const sheetData = {
        containerStyle: styles.filtersList,
        isVisible: showFiltersList,
        onRequestClose: handleCloseFilterList
    },
    filtersList = showFiltersList ? buildFiltersList() : null,
    bottomSheet = showFiltersList ? (
        <BottomSheet {...sheetData}>
            {filtersList}
        </BottomSheet>
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