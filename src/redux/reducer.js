const initialState = {
    general: {
        payPeriodType: 'monthly',
        backgroundColor: 'black',
        textColor: 'white',
        currencySymbol: '£',
        showDecimals: true
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
            budget: 0,
            carryOverBudget: false,
            hidden: false,
            dateCreated: '2020-06-03'
        },
        {
            id: 2,
            name: 'Food',
            description: '',
            type: 'expense',
            budget: 60,
            carryOverBudget: true,
            hidden: false,
            dateCreated: '2020-06-03'
        },
    ],
    funds: [
        {
            id: 1,
            name: 'New Phone',
            description: 'Saving for a new phone',
            targetAmount: 1200,
            moneyAdded: 0,
            complete: false,
            dateCreated: '2020-06-03'
        }
    ],
    transactions: [],
};

export const reducer = (state = initialState, action) => {
    let value = action.payload;
    switch(action.type) {
        case 'SET_PAY_PERIOD_TYPE': return {...state, general: {...state.general, payPeriodType: value}};
        case 'SET_BACKGROUND_COLOR': return {...state, general: {...state.general, backgroundColor: value}};
        case 'SET_TEXT_COLOR': return {...state, general: {...state.general, textColor: value}};
        case 'SET_CURRENCY_SYMBOL': return {...state, general: {...state.general, currencySymbol: value}};
        case 'SET_SHOW_DECIMALS': return {...state, general: {...state.general, showDecimals: value}};

        case 'ADD_ACCOUNT': let newAccounts = getNewArray(state.accounts, value); return {...state, accounts: newAccounts};
        case 'ADD_CATEGORY': let newCategories = getNewArray(state.categories, value); return {...state, categories: newCategories};
        case 'ADD_FUND': let newFunds = getNewArray(state.funds, value); return {...state, funds: newFunds};

        case 'UPDATE_ACCOUNT': let updatedAccounts = replaceObject(state.accounts, value); return {...state, accounts: updatedAccounts};
        case 'UPDATE_CATEGORY': let updatedCategories = replaceObject(state.categories, value); return {...state, categories: updatedCategories};
        case 'UPDATE_FUND': let updatedFunds = replaceObject(state.funds, value); return {...state, funds: updatedFunds};

        case 'REMOVE_ACCOUNT': let removedAccounts = removeObject(state.accounts, value); return {...state, accounts: removedAccounts};
        case 'REMOVE_CATEGORY': let removedCategories = removeObject(state.categories, value); return {...state, categories: removedCategories};
        case 'REMOVE_FUND': let removedFunds = removeObject(state.funds, value); return {...state, funds: removedFunds};
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
    let latestID = arr[arr.length-1].id;
    object.id = latestID+1;
    return [...arr, object];
}