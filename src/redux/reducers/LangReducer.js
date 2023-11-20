import {
    UPDATE_LANG
} from '../types';

const initialState = 'english';

export default (state = initialState, action) => {
    switch(action.type) {
        case UPDATE_LANG:
            return action.payload;
        default:
            return state;
    }
}