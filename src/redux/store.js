import { createStore, applyMiddleware } from 'redux';
import { reducer } from './reducer';
import { changeColourScheme } from '../functions';

const localStorageMiddleware = ({getState}) => {
    return (next) => (action) => {
        const result = next(action);
        
        const ignore = ['SET_CURRENT_PAGE', 'SET_ADD_TRANSACTION', 'SET_EDIT_MODE'];
        if (ignore.includes(action.type)) return result;

        localStorage.setItem('budgetState', JSON.stringify(getState()));

        return result;
    }
};

const syncMiddleware = ({getState, dispatch}) => {
    return (next) => (action) => {
        const result = next(action);
        //sync with server if possible
        const ignore = ['SET_CURRENT_PAGE', 'SET_EDIT_MODE', 'SYNC', 'SET_USER', 'SET_ADD_TRANSACTION', 'SET_MESSAGE'];
        if (ignore.includes(action.type)) return result;
        sync(getState(), dispatch);

        return result;
    }
};

export const sync = (state, dispatch, manual=false) => {
    if (state.user === null) return;

    const backupData = {
        general: state.general,
        accounts: state.accounts,
        categories: state.categories,
        budgets: state.budgets,
        funds: state.funds,
        fundAdditions: state.fundAdditions,
        transactions: state.transactions
    };

    fetch('https://budget-app-ap1.herokuapp.com/api/backup', {
        method: 'POST', 
        headers: {'content-type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(backupData)
    }).then(res => res.json()).then(data => {
        if (data.status === 'success') {
            console.log('Updating data: ', data);
            dispatch({type: 'SYNC', payload: data.data});
            dispatch({type: 'SET_USER', payload: data.user});
            changeColourScheme(data.data.general.colourScheme);
            if (manual) dispatch({type: 'SET_MESSAGE', payload: {text: 'Data successfully synced!', type: 'success'}});
        } else {
            console.log(data);
            dispatch({type: 'SET_MESSAGE', payload: {text: data.message, type: 'error'}});
        }
    }).catch(err => {
        console.log('Error Syncing: ', err.message);
        dispatch({type: 'SET_USER', payload: null});
        dispatch({type: 'SET_MESSAGE', payload: {text: 'Failed to contact server for syncing. Please try to login again.', type: 'error'}});
    });
}

const getFromLocalStorage = () => {
    let state = localStorage.getItem('budgetState');
    if (state !== null) {
        state = JSON.parse(state);
        state.currentPage = 'Home';
        state.message = {text: '', type: ''};
        state.editMode = false;
        state.addTransaction = false;
        changeColourScheme(state.general.colourScheme);
        return state;
    }
}

const store = createStore(reducer, getFromLocalStorage(), applyMiddleware(localStorageMiddleware, syncMiddleware));

export default store;