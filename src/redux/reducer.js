import { format } from 'date-fns';

const initialState = {
    currentPage: 'Home',
    addTransaction: false,
    editMode: false,
    general: {
        payPeriodType: 'fourWeekly',
        backgroundColor: 'black',
        textColor: 'white',
        currencySymbol: '£',
        showDecimals: true,
        startDate: '2019-11-08',
    },
    accounts: [],
    categories: [
        {
            id: 20200723153000,
            name: 'Earnings',
            description: '',
            type: 'income',
            hidden: false,
            dateCreated: '2020-06-03'
        },
        {
            id: 20200723153001,
            name: 'Interest',
            description: '',
            type: 'income',
            hidden: false,
            dateCreated: '2020-06-03'
        },
        {
            id: 20200723153102,
            name: 'Food',
            description: '',
            type: 'expense',
            hidden: false,
            dateCreated: '2020-06-03'
        },
    ],
    budgets: [
        {
            id: 1,
            category: 20200723153102,
            amount: 50,
            startDate: '2020-01-03',
            endDate: '2020-02-27',
            carryOver: true,
        },
        {
            id: 2,
            category: 20200723153102,
            amount: 80,
            startDate: '2020-02-28',
            endDate: undefined,
            carryOver: true,
        }
    ],
    funds: [
        {
            id: 20200723153130,
            name: 'Savings',
            description: 'General Savings',
            targetAmount: 0,
            complete: false,
            dateCreated: '2020-01-03'
        }
    ],
    fundAdditions: [],
    transactions: [],
};

export const reducer = (state = initialState, action) => {
    let value = action.payload;
    switch(action.type) {
        case 'SET_CURRENT_PAGE': return {...state, currentPage: value, editMode: false};
        case 'SET_ADD_TRANSACTION': return {...state, addTransaction: value};
        case 'SET_EDIT_MODE': return {...state, editMode: value};

        case 'SET_PAY_PERIOD_TYPE': return {...state, general: {...state.general, payPeriodType: value}};
        case 'SET_BACKGROUND_COLOR': return {...state, general: {...state.general, backgroundColor: value}};
        case 'SET_TEXT_COLOR': return {...state, general: {...state.general, textColor: value}};
        case 'SET_CURRENCY_SYMBOL': return {...state, general: {...state.general, currencySymbol: value}};
        case 'SET_SHOW_DECIMALS': return {...state, general: {...state.general, showDecimals: value}};
        case 'SET_START_DATE': return {...state, general: {...state.general, startDate: value}};

        case 'ADD_ACCOUNT': let newAccounts = getNewArray(state.accounts, value); return {...state, accounts: newAccounts};
        case 'ADD_CATEGORY': let newCategories = getNewArray(state.categories, value); return {...state, categories: newCategories};
        case 'ADD_BUDGET': let newBudgets = getNewArray(state.budgets, value); return {...state, budgets: newBudgets};
        case 'ADD_FUND': let newFunds = getNewArray(state.funds, value); return {...state, funds: newFunds};
        case 'ADD_FUND_ADDITION': let newFundAdditions = getNewArray(state.fundAdditions, value); return {...state, fundAdditions: newFundAdditions, addTransaction: false};
        case 'ADD_TRANSACTION': let newTransactions = getNewArray(state.transactions, value); return {...state, transactions: newTransactions, addTransaction: false};

        case 'UPDATE_ACCOUNT': let updatedAccounts = replaceAccount(state.accounts, value); return {...state, accounts: updatedAccounts};
        case 'UPDATE_CATEGORY': let updatedCategories = replaceObject(state.categories, value); return {...state, categories: updatedCategories};
        case 'UPDATE_BUDGET': let updatedBudgets = replaceObject(state.budgets, value); return {...state, budgets: updatedBudgets};
        case 'UPDATE_FUND': let updatedFunds = replaceObject(state.funds, value); return {...state, funds: updatedFunds};
        case 'UPDATE_FUND_ADDITION': let updatedFundAdditions = replaceObject(state.fundAdditions, value); return {...state, fundAdditions: updatedFundAdditions};

        case 'REMOVE_ACCOUNT': let removedAccounts = removeObject(state.accounts, value); return {...state, accounts: removedAccounts};
        case 'REMOVE_CATEGORY': let removedCategories = removeObject(state.categories, value); return {...state, categories: removedCategories};
        case 'REMOVE_BUDGET': let removedBudgets = removeObject(state.budgets, value); return {...state, budgets: removedBudgets};
        case 'REMOVE_FUND': let removedFunds = removeObject(state.funds, value); return {...state, funds: removedFunds};
        case 'REMOVE_FUND_ADDITION': let removedFundAdditions = removeObject(state.fundAdditions, value); return {...state, fundAdditions: removedFundAdditions};
        case 'REMOVE_TRANSACTION': let removedTransactions = removeObject(state.transactions, value); return {...state, transactions: removedTransactions};
        default: return state;
    }
}

const removeObject = (arr, id) => {
    return arr.map(obj => {
        if (obj.id === id) {
            let date = Number(format(new Date(),'yyyyMMddHHmmss'));
            return {id: obj.id, deleted: date};
        } else return obj;
    });
    // return arr.filter(obj => obj.id !== id);
}

const replaceObject = (arr, object) => {
    let copy = [...arr];
    let index = copy.findIndex(obj => obj.id === object.id);
    if (index === -1) return arr;
    object.updated = Number(format(new Date(),'yyyyMMddHHmmss'));
    copy.splice(index,1,object);
    return copy;
}

const replaceAccount = (arr, object) => {
    let copy = [...arr];

    //there can only be one default account
    if (object.defaultAccount === true) {
        copy.forEach(obj => obj.id !== object.id ? obj.defaultAccount = false : null);
    }

    let index = copy.findIndex(obj => obj.id === object.id);
    if (index === -1) return arr;
    object.updated = Number(format(new Date(),'yyyyMMddHHmmss'));
    copy.splice(index,1,object);
    return copy;
}

const getNewArray = (arr, object) => {
    object.id = Number(format(new Date(),'yyyyMMddHHmmss'));    
    return [...arr, object];
}