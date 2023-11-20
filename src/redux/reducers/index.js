import { combineReducers } from 'redux';
import LangReducer from './LangReducer';
import TranslationReducer from './TranslationReducer';

export default combineReducers({
    lang: LangReducer,
    translations: TranslationReducer
});