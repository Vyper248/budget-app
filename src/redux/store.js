import { createStore, applyMiddleware } from 'redux';
import { reducer } from './reducer';

const localStorageMiddleware = ({getState}) => {
    return (next) => (action) => {
        const result = next(action);
        
        const ignore = ['SET_CURRENT_PAGE', 'SET_ADD_TRANSACTION', 'SET_EDIT_MODE'];
        if (ignore.includes(action.type)) return result;

        localStorage.setItem('budgetState', JSON.stringify(getState()));
        return result;
    }
};

const getFromLocalStorage = () => {
    let state = localStorage.getItem('budgetState');
    if (state !== null) return JSON.parse(state);
}

const store = createStore(reducer, getFromLocalStorage(), applyMiddleware(localStorageMiddleware));

// store.subscribe(() => {
//     console.log('Save Store');
// });

export default store;