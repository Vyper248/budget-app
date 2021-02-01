import { createStore, applyMiddleware } from 'redux';
import { reducer } from './reducer';
import { changeColourScheme } from '../functions';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/' : 'https://budget-app-ap1.herokuapp.com/';

const localStorageMiddleware = ({getState}) => {
    return (next) => (action) => {
        const result = next(action);
        
        const ignore = ['SET_CURRENT_PAGE', 'SET_ADD_TRANSACTION', 'SET_EDIT_MODE', 'SET_FETCHING'];
        if (ignore.includes(action.type)) return result;

        localStorage.setItem('budgetState', JSON.stringify(getState()));

        return result;
    }
};

const syncMiddleware = ({getState, dispatch}) => {
    return (next) => (action) => {
        const result = next(action);
        //sync with server if possible
        const ignore = ['SET_CURRENT_PAGE', 'SET_EDIT_MODE', 'SYNC', 'SET_USER', 'SET_ADD_TRANSACTION', 'SET_MESSAGE', 'SET_FETCHING'];
        if (ignore.includes(action.type)) return result;
        sync(getState(), dispatch);

        return result;
    }
};

export const sync = (state, dispatch, manual=false) => {
    if (!state.user) return;
    const setUser = (value) => dispatch({type: 'SET_USER', payload: value});
    const setMessage = (value) => dispatch({type: 'SET_MESSAGE', payload: value});
    const setFetching = (value) => dispatch({type: 'SET_FETCHING', payload: value});

    const backupData = {
        general: state.general,
        accounts: state.accounts,
        categories: state.categories,
        budgets: state.budgets,
        funds: state.funds,
        fundAdditions: state.fundAdditions,
        transactions: state.transactions,
        user: state.user
    };

    setFetching(true);
    fetch(url+'api/backup', {
        method: 'POST', 
        headers: {'content-type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(backupData)
    }).then(res => res.json()).then(data => {
        setFetching(false);
        if (data.status === 'success') {
            dispatch({type: 'SYNC', payload: data.data});
            setUser(data.user);
            changeColourScheme(data.data.general.colourScheme);
            if (manual) setMessage({text: 'Data successfully synced!', type: 'success'});
        } else {
            console.log(data);
            if (data.type === 'logout') setUser(null);
            setMessage({text: data.message, type: 'error'});
        }
    }).catch(err => {
        console.log('Error Syncing: ', err.message);
        setFetching(false);
        setUser(null);
        setMessage({text: 'Failed to contact server for syncing. Please try to login again.', type: 'error'});
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
        state.fetching = false;
        changeColourScheme(state.general.colourScheme);
        return state;
    }
}

const store = createStore(reducer, getFromLocalStorage(), applyMiddleware(localStorageMiddleware, syncMiddleware));

export default store;