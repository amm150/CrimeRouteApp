import {
    UPDATE_LANG,
    UPDATE_TRANSLATIONS
} from '../types';

export const updateLang = (val) => {
    return {
        type: UPDATE_LANG,
        payload: val
    };
}

export const updateTranslations = (val) => {
    return {
        type: UPDATE_TRANSLATIONS,
        payload: val
    };
}