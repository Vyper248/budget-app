const category = {
    name: '',
    description: '',
    type: 'income,expense',
    hidden: false,
};

const fund = {
    name: '',
    description: '',
    targetAmount: 0,
    complete: false,
}

const account = {
    name: '',
    note: '',
    interestRate: 0.0,
    startingBalance: 0,
    balance: 0,
    spending: true,
    default: false,
    closed: false,
    extraCharges: 0,
    currency: '£',
}

const budget = {
    category: 0,
    amount: 0,
    startDate: 'date',
    endDate: 'date',
}

export const modals = {
    categories: {
        modal: category,
        editString: '_CATEGORY'
    },
    funds: {
        modal: fund,
        editString: '_FUND'
    },
    accounts: {
        modal: account,
        editString: '_ACCOUNT'

    },
    budgets: {
        modal: budget,
        editString: '_BUDGET'
    }
};