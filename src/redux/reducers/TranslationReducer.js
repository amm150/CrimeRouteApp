import {
    UPDATE_TRANSLATIONS
} from '../types';

import { languages } from '../../translations/languages';

const initialState = languages.english;

export default (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_TRANSLATIONS:
            return action.payload;
        default:
            return state;
    }
}