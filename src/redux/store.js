import { createStore, applyMiddleware } from 'redux';
import { reducer } from './reducer';
import { changeColourScheme } from '../functions';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:8888/.netlify/functions/' : 'https://budget-app-serverless.netlify.app/.netlify/functions';
let timeout = null;

let controller = new AbortController();

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

        if (action.type === 'IMPORT_BACKUP') {
            overwriteBackup(getState(), dispatch);
            return result;
        }

        const ignore = ['SET_CURRENT_PAGE', 'SET_EDIT_MODE', 'SYNC', 'SET_USER', 'SET_ADD_TRANSACTION', 'SET_MESSAGE', 'SET_FETCHING'];
        if (ignore.includes(action.type)) return result;

        //don't want too many syncs to happen if doing a lot of quick changes
        if (timeout !== null) { 
            clearTimeout(timeout);
            timeout = null; 
        }

        timeout = setTimeout(() => {
            sync(getState(), dispatch);
            timeout = null;
        }, 500);

        return result;
    }
};

const getBackupData = (state) => {
    return {
        general: state.general,
        accounts: state.accounts,
        categories: state.categories,
        budgets: state.budgets,
        funds: state.funds,
        fundAdditions: state.fundAdditions,
        transactions: state.transactions,
        user: state.user
    };
}

const overwriteBackup = (state, dispatch) => {
    if (!state.user) return;
    const setUser = (value) => dispatch({type: 'SET_USER', payload: value});
    const setMessage = (value) => dispatch({type: 'SET_MESSAGE', payload: value});
    const setFetching = (value) => dispatch({type: 'SET_FETCHING', payload: value});

    const backupData = getBackupData(state);

    setFetching(true);
    fetch(url+'overwriteBackup', {
        method: 'POST', 
        headers: {'content-type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(backupData)
    }).then(res => res.json()).then(data => {
        setFetching(false);
        if (data.status === 'success') {
            setUser(data.user);
            dispatch({type: 'SET_SYNC_DATE'});
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

export const sync = (state, dispatch, manual=false) => {
    if (!state.user) return;
    const setUser = (value) => dispatch({type: 'SET_USER', payload: value});
    const setMessage = (value) => dispatch({type: 'SET_MESSAGE', payload: value});
    const setFetching = (value) => dispatch({type: 'SET_FETCHING', payload: value});

    const backupData = getBackupData(state);

    if (state.fetching) {
        controller.abort();
        controller = new AbortController();
    }

    const signal = controller.signal;

    setFetching(true);
    fetch(url+'backup', {
        method: 'POST', 
        signal,
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

        //if a request is aborted, it's because another has started, so don't need to set fetching to false
        if (err.message.includes('The user aborted a request.')) return;

        setFetching(false);
        setMessage({text: 'Failed to contact server for syncing. Please try to login again.', type: 'error'});
        
        if (err.message.includes('Failed to fetch')) return;
        setUser(null);
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