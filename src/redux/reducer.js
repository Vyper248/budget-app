import { format, compareAsc, compareDesc, parseISO } from 'date-fns';

const initialState = {
    currentPage: 'Home',
    addTransaction: false,
    editMode: false,
    lastSync: 0,
    user: null,
    fetching: false,
    message: {
        text: '', 
        type: ''
    },
    general: {
        payPeriodType: 'fourWeekly',
        currencySymbol: '£',
        colourScheme: 'dark',
        showDecimals: true,
        startDate: '2019-11-08',
        swapSummaries: false,
        periodsToDisplay: 6,
        reverseSummaryTable: false,
        savingsGoalDate: '2019-11-08',
        savingsGoalTarget: 0,
        salary: 0,
        updated: 20200220153001,
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
    budgets: [],
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
    let dateValue = Number(format(new Date(),'yyyyMMddHHmmss'));
    switch(action.type) {
        case 'SET_CURRENT_PAGE': return {...state, currentPage: value, editMode: false, addTransaction: false, message: {text: '', type: ''}};
        case 'SET_ADD_TRANSACTION': return {...state, addTransaction: value};
        case 'SET_EDIT_MODE': return {...state, editMode: value};
        case 'SET_USER': return {...state, user: value};
        case 'SET_FETCHING': return {...state, fetching: value};
        case 'SET_MESSAGE': return {...state, message: value};

        case 'SET_PAY_PERIOD_TYPE': return {...state, general: {...state.general, payPeriodType: value, updated: dateValue}};
        case 'SET_COLOUR_SCHEME': return {...state, general: {...state.general, colourScheme: value, updated: dateValue}};
        case 'SET_CURRENCY_SYMBOL': return {...state, general: {...state.general, currencySymbol: value, updated: dateValue}};
        case 'SET_SHOW_DECIMALS': return {...state, general: {...state.general, showDecimals: value, updated: dateValue}};
        case 'SET_START_DATE': return {...state, general: {...state.general, startDate: value, updated: dateValue}};
        case 'SET_SAVINGS_GOAL_DATE': return {...state, general: {...state.general, savingsGoalDate: value, updated: dateValue}};
        case 'SET_SAVINGS_GOAL_TARGET': return {...state, general: {...state.general, savingsGoalTarget: value, updated: dateValue}};
        case 'SET_SALARY': return {...state, general: {...state.general, salary: value, updated: dateValue}};
        case 'SET_PERIODS_TO_DISPLAY': return {...state, general: {...state.general, periodsToDisplay: value, updated: dateValue}};
        case 'SET_SWAP_SUMMARIES': return {...state, general: {...state.general, swapSummaries: value, updated: dateValue}};
        case 'SET_REVERSE_SUMMARY_TABLE': return {...state, general: {...state.general, reverseSummaryTable: value, updated: dateValue}};

        case 'ADD_ACCOUNT': let newAccounts = getNewArray(state.accounts, value); return {...state, accounts: newAccounts};
        case 'ADD_CATEGORY': let newCategories = getNewArray(state.categories, value); return {...state, categories: newCategories};
        case 'ADD_BUDGET': let newBudgets = getNewArray(state.budgets, value); return {...state, budgets: newBudgets};
        case 'ADD_FUND': let newFunds = getNewArray(state.funds, value); return {...state, funds: newFunds};
        case 'ADD_FUND_ADDITION': let newFundAdditions = getNewArray(state.fundAdditions, value); return {...state, fundAdditions: newFundAdditions, addTransaction: false};
        case 'ADD_TRANSACTION': let newTransactions = getNewArray(state.transactions, value); return {...state, transactions: newTransactions, addTransaction: false};

        case 'UPDATE_ACCOUNT': let updatedAccounts = replaceAccount(state.accounts, value); return {...state, accounts: updatedAccounts};
        case 'UPDATE_CATEGORY': let updatedCategories = replaceObject(state.categories, value); return {...state, categories: updatedCategories};
        case 'UPDATE_BUDGET': let updatedBudgets = updateBudget(state.budgets, value); return {...state, budgets: updatedBudgets};
        case 'UPDATE_FUND': let updatedFunds = replaceObject(state.funds, value); return {...state, funds: updatedFunds};
        case 'UPDATE_FUND_ADDITION': let updatedFundAdditions = replaceObject(state.fundAdditions, value); return {...state, fundAdditions: updatedFundAdditions};
        case 'UPDATE_TRANSACTION': let updatedTransactions = replaceObject(state.transactions, value); return {...state, transactions: updatedTransactions, addTransaction: false};

        case 'REMOVE_ACCOUNT': let removedAccounts = removeObject(state.accounts, value); return {...state, accounts: removedAccounts};
        case 'REMOVE_CATEGORY': let removedCategories = removeObject(state.categories, value); return {...state, categories: removedCategories};
        case 'REMOVE_BUDGET': let removedBudgets = removeObject(state.budgets, value); return {...state, budgets: removedBudgets};
        case 'REMOVE_FUND': let removedFunds = removeObject(state.funds, value); return {...state, funds: removedFunds};
        case 'REMOVE_FUND_ADDITION': let removedFundAdditions = removeObject(state.fundAdditions, value); return {...state, fundAdditions: removedFundAdditions};
        case 'REMOVE_TRANSACTION': let removedTransactions = removeObject(state.transactions, value); return {...state, transactions: removedTransactions};

        case 'SYNC': return {...state, ...value, lastSync: dateValue};
        case 'IMPORT_BACKUP': return {...state, ...value};
        default: return state;
    }
}

const updateBudget = (budgets, newBudget) => {
    newBudget.id = Number(format(new Date(),'yyyyMMddHHmmss')); 
    //get previous budget
    let previousBudget = getPreviousBudget(budgets, newBudget.startDate, newBudget.category);

    //check if there's already a budget with this start date
    let budget = budgets.find(obj => obj.startDate === newBudget.startDate && obj.category === newBudget.category);
    if (budget !== undefined) {
        //check if this budget is same as previous - then delete
        if (previousBudget !== undefined && previousBudget.amount === newBudget.amount) {
            return removeObject(budgets, budget.id);
        }

        budget.amount = newBudget.amount;
        return replaceObject(budgets, budget);
    }

    //if there's no budget already, but new budget is same as previous budget, don't do anything
    if (previousBudget !== undefined && newBudget.amount === previousBudget.amount) return budgets;

    //if no budget already, and new budget is different, then add new
    let newBudgets = [...budgets, newBudget];
    newBudgets.sort((a,b) => {
        return compareAsc(parseISO(a.startDate), parseISO(b.startDate));
    });

    return newBudgets;
}

const getPreviousBudget = (budgets, date, category) => {
    for (let i = budgets.length-1; i >= 0; i--) {
        let budget = budgets[i];
        if (budget.category !== category) continue;
        if (compareDesc(parseISO(budget.startDate), parseISO(date)) === 1) return budget;
    }
    return undefined;
}

const removeObject = (arr, id) => {
    return arr.map(obj => {
        if (obj.id === id) {
            let date = Number(format(new Date(),'yyyyMMddHHmmss'));
            return {id: obj.id, deleted: date};
        } else return obj;
    });
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