import { format } from 'date-fns';

const initialState = {
    currentPage: 'Home',
    general: {
        payPeriodType: 'fourWeekly',
        backgroundColor: 'black',
        textColor: 'white',
        currencySymbol: '£',
        showDecimals: true,
        startDate: '2019-11-08',
    },
    accounts: [
        {
            id: 1,
            name: 'Tesco',
            description: '',
            interestRate: 1.0,
            startingBalance: 300,
            balance: 300,
            spending: true,
            default: true,
            closed: false,
            extraCharges: 0,
            currency: '£',
            dateCreated: '2020-06-03'
        },
    ],
    categories: [
        {
            id: 1,
            name: 'Earnings',
            description: '',
            type: 'income',
            hidden: false,
            dateCreated: '2020-06-03'
        },
        {
            id: 3,
            name: 'Interest',
            description: '',
            type: 'income',
            hidden: false,
            dateCreated: '2020-06-03'
        },
        {
            id: 2,
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
            category: 2,
            amount: 50,
            startDate: '2020-01-03',
            endDate: '2020-02-27',
            carryOver: true,
        },
        {
            id: 2,
            category: 2,
            amount: 80,
            startDate: '2020-02-28',
            endDate: undefined,
            carryOver: true,
        }
    ],
    funds: [
        {
            id: 1,
            name: 'New Phone',
            description: 'Saving for a new phone',
            targetAmount: 1200,
            complete: false,
            dateCreated: '2020-06-03'
        },
        {
            id: 2,
            name: 'Savings',
            description: 'General Savings',
            targetAmount: 0,
            complete: false,
            dateCreated: '2020-01-03'
        }
    ],
    fundAdditions: [
        {
            id: 1,
            amount: 50,
            date: '2020-02-28',
            fund: 1,
            dateCreated: '2020-06-04'
        },
        {
            id: 2,
            amount: 50,
            date: '2020-04-24',
            fund: 1,
            dateCreated: '2020-06-04'
        }
    ],
    transactions: [
        {
            id: 1,
            type: 'spend',
            amount: 24.21,
            description: 'Food',
            date: '2020-04-28',
            category: 2,
            account: 1,
            dateCreated: '2020-06-03'
        },
        {
            id: 2,
            type: 'spend',
            amount: 14.71,
            description: 'Food',
            date: '2020-02-28',
            category: 2,
            account: 1,
            dateCreated: '2020-06-03'
        },
        {
            id: 3,
            type: 'spend',
            amount: 874.29,
            description: 'Earnings',
            date: '2020-02-28',
            category: 1,
            account: 1,
            dateCreated: '2020-06-03'
        },
        {
            id: 4,
            type: 'spend',
            amount: 874.29,
            description: 'Earnings',
            date: '2020-04-24',
            category: 1,
            account: 1,
            dateCreated: '2020-06-03'
        },
        {
            id: 5,
            type: 'spend',
            amount: 25,
            description: 'Phone Case',
            date: '2020-05-22',
            fund: 1,
            account: 1,
            dateCreated: '2020-06-03'
        }
    ],
};

export const reducer = (state = initialState, action) => {
    let value = action.payload;
    switch(action.type) {
        case 'SET_CURRENT_PAGE': return {...state, currentPage: value};

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
        case 'ADD_FUND_ADDITION': let newFundAddition = getNewArray(state.fundAdditions, value); return {...state, fundAdditions: newFundAddition};

        case 'UPDATE_ACCOUNT': let updatedAccounts = replaceObject(state.accounts, value); return {...state, accounts: updatedAccounts};
        case 'UPDATE_CATEGORY': let updatedCategories = replaceObject(state.categories, value); return {...state, categories: updatedCategories};
        case 'UPDATE_BUDGET': let updatedBudgets = replaceObject(state.budgets, value); return {...state, budgets: updatedBudgets};
        case 'UPDATE_FUND': let updatedFunds = replaceObject(state.funds, value); return {...state, funds: updatedFunds};
        case 'UPDATE_FUND_ADDITION': let updatedFundAdditions = replaceObject(state.fundAdditions, value); return {...state, fundAdditions: updatedFundAdditions};

        case 'REMOVE_ACCOUNT': let removedAccounts = removeObject(state.accounts, value); return {...state, accounts: removedAccounts};
        case 'REMOVE_CATEGORY': let removedCategories = removeObject(state.categories, value); return {...state, categories: removedCategories};
        case 'REMOVE_BUDGET': let removedBudgets = removeObject(state.budgets, value); return {...state, budgets: removedBudgets};
        case 'REMOVE_FUND': let removedFunds = removeObject(state.funds, value); return {...state, funds: removedFunds};
        case 'REMOVE_FUND_ADDITION': let removedFundAdditions = removeObject(state.fundAdditions, value); return {...state, fundAdditions: removedFundAdditions};
        default: return state;
    }
}

const removeObject = (arr, id) => {
    return arr.filter(obj => obj.id !== id);
}

const replaceObject = (arr, object) => {
    let copy = [...arr];
    let index = copy.findIndex(obj => obj.id === object.id);
    if (index === -1) return arr;
    copy.splice(index,1,object);
    return copy;
}

const getNewArray = (arr, object) => {
    object.id = format(new Date(),'yyyyMMddHHmmss');
    return [...arr, object];
}