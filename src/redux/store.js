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

const syncMiddleware = ({getState, dispatch}) => {
    return (next) => (action) => {
        const result = next(action);
        //sync with server if possible
        const ignore = ['SET_EDIT_MODE', 'SET_BACKGROUND_COLOR', 'SET_TEXT_COLOR', 'SYNC'];
        if (ignore.includes(action.type)) return result;
        sync(getState(), dispatch);

        return result;
    }
};

export const sync = (state, dispatch) => {
    const backupData = {
        general: state.general,
        accounts: state.accounts,
        categories: state.categories,
        budgets: state.budgets,
        funds: state.funds,
        fundAdditions: state.fundAdditions,
        transactions: state.transactions
    };

    fetch('http://localhost:3001/api/backup', {
        method: 'POST', 
        headers: {'content-type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(backupData)
    }).then(res => res.json()).then(data => {
        if (data.status === 'success') {
            console.log('Updating data: ', data.data);
            dispatch({type: 'SYNC', payload: data.data});
        } else {
            console.log(data);
        }
    });
}

const getFromLocalStorage = () => {
    let state = localStorage.getItem('budgetState');
    if (state !== null) {
        state = JSON.parse(state);
        state.currentPage = 'Home';
        state.editMode = false;
        state.addTransaction = false;
        return state;
    }
}

const store = createStore(reducer, getFromLocalStorage(), applyMiddleware(localStorageMiddleware, syncMiddleware));

export default store;