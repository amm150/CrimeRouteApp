import React, {
    useRef
} from 'react';
import { StyleSheet, View } from 'react-native';

import PageHeader from '../../components/headers/PageHeader';
import DropDownButton from '../../components/dropdowns/DropdownButton';
import DatabaseUtil from '../../utils/DatabaseUtil';

import { connect } from 'react-redux';
import { updateLang, updateTranslations } from '../../redux/actions';
import { languages } from '../../translations/languages';

/**
 * @description SettingsContainer
 * 
 * @returns {React.ReactNode}
 */
function SettingsContainer(props) {
    function buildOptions(){
        return Object.keys(languages).map((key) => {
            return {
                id: key,
                label: props.translations[key]
            }
        }, []);
    }

    const database = useRef(new DatabaseUtil()).current,
        headerData = {
            label: props.translations['settings']
        },
        dropdownData = {
            label: props.translations['language'],
            handleChangeSelectedOption: (value) => {
                database.storeData('lang', value);
                props.updateLang(value);
                props.updateTranslations(languages[value]);
            },
            options: buildOptions(),
            selectedOption: props.lang
        };


    return (
        <View>
            <PageHeader {...headerData}/>
            <View style={styles.contents} >
                <DropDownButton {...dropdownData} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contents: {
        padding: 15
    }
});

const mapStateToProps = (state) => {
    return { 
        lang: state.lang,
        translations: state.translations
    }
};

export default connect(mapStateToProps, { 
    updateLang, 
    updateTranslations 
})(SettingsContainer);