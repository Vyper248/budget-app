import { format, compareAsc, compareDesc, parseISO } from 'date-fns';

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
    budgets: [
        {
            id: 1,
            category: 20200723153102,
            amount: 50,
            startDate: '2020-01-03',
            carryOver: true,
        },
        {
            id: 2,
            category: 20200723153102,
            amount: 80,
            startDate: '2020-02-28',
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
    let dataValue = Number(format(new Date(),'yyyyMMddHHmmss'));
    switch(action.type) {
        case 'SET_CURRENT_PAGE': return {...state, currentPage: value, editMode: false};
        case 'SET_ADD_TRANSACTION': return {...state, addTransaction: value};
        case 'SET_EDIT_MODE': return {...state, editMode: value};

        case 'SET_PAY_PERIOD_TYPE': return {...state, general: {...state.general, payPeriodType: value, updated: dataValue}};
        case 'SET_BACKGROUND_COLOR': return {...state, general: {...state.general, backgroundColor: value}};
        case 'SET_TEXT_COLOR': return {...state, general: {...state.general, textColor: value}};
        case 'SET_CURRENCY_SYMBOL': return {...state, general: {...state.general, currencySymbol: value, updated: dataValue}};
        case 'SET_SHOW_DECIMALS': return {...state, general: {...state.general, showDecimals: value, updated: dataValue}};
        case 'SET_START_DATE': return {...state, general: {...state.general, startDate: value, updated: dataValue}};

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

        case 'REMOVE_ACCOUNT': let removedAccounts = removeObject(state.accounts, value); return {...state, accounts: removedAccounts};
        case 'REMOVE_CATEGORY': let removedCategories = removeObject(state.categories, value); return {...state, categories: removedCategories};
        case 'REMOVE_BUDGET': let removedBudgets = removeObject(state.budgets, value); return {...state, budgets: removedBudgets};
        case 'REMOVE_FUND': let removedFunds = removeObject(state.funds, value); return {...state, funds: removedFunds};
        case 'REMOVE_FUND_ADDITION': let removedFundAdditions = removeObject(state.fundAdditions, value); return {...state, fundAdditions: removedFundAdditions};
        case 'REMOVE_TRANSACTION': let removedTransactions = removeObject(state.transactions, value); return {...state, transactions: removedTransactions};

        case 'SYNC': return {...state, ...value};
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
        // if (previousBudget !== undefined && previousBudget.amount === newBudget.amount) {
        //     return removeObject(budgets, budget.id);
        // }

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