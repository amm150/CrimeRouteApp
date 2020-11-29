import React, {
    useState
} from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import InputLabel from '../inputs/InputLabel';

/**
 * @description DropdownButton
 * 
 * @returns {React.ReactNode}
 */
function DropdownButton(props) {
    const [selectedOption, setSelectedOption] = useState(props.selectedOption);

    function buildPickerItems() {
        return props.options.map((item, idx) => {
            const itemData = {
                key: idx,
                label: item.label,
                value: item.id
            }
            return <Picker.Item {...itemData} />
        });
    }

    function handleChangeSelectedOption(itemValue) {
        setSelectedOption(itemValue);

        props.handleChangeSelectedOption(itemValue);
    }

    const labelData = {
            label: props.label
        },
        pickerData = {
            enabled: !props.disabled,
            itemStyle: styles.pickerItem,
            selectedValue: selectedOption,
            style: styles.picker,
            mode: 'dropdown',
            onValueChange: handleChangeSelectedOption
        },
        pickerItems = buildPickerItems();

    return (
        <View>
            <InputLabel {...labelData}/>
            <Picker {...pickerData}>
                {pickerItems}
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    picker: {
        height: 50
    },
    pickerItem: {
        height: 100
    }
});

DropdownButton.propTypes = {
    color: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    handleChangeSelectedOption: PropTypes.func,
    options: PropTypes.array.isRequired,
    selectedOption: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
}; 

export default DropdownButton;