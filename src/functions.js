import { add, compareAsc, compareDesc, parseISO, format } from 'date-fns';
import store from './redux/store';

export const getLatestDates = (startDate, periodLength) => {
    let daysInPeriod = 0;
    switch (periodLength) {
        case 'monthly': daysInPeriod = 30; break;
        case 'weekly': daysInPeriod = 7; break;
        case 'twoWeekly': daysInPeriod = 14; break;
        case 'fourWeekly': daysInPeriod = 28; break;
        default: daysInPeriod = 30; break;
    }

    //go forwards from starting date to todays date
    let currentDate = parseISO(startDate);
    let today = new Date();

    while (compareAsc(today, currentDate) === 1) {
        if (periodLength === 'monthly') currentDate = add(currentDate, {months: 1});
        else currentDate = add(currentDate, {days: daysInPeriod});
    }

    //go back 1 pay period to get last pay date
    let latestDate = periodLength === 'monthly' ? add(currentDate, {months: -1}) : add(currentDate, {days: -daysInPeriod});

    //go back and add to array previous pay periods (up to 12/13);
    let latestDates = [];
    let numberOfPeriods = periodLength === 'fourWeekly' ? 13 : 12;
    for (let i = 0; i < numberOfPeriods; i++) {
        latestDates.push(format(latestDate, 'yyyy-MM-dd'));
        latestDate = periodLength === 'monthly' ? add(latestDate, {months: -1}) : add(latestDate, {days: -daysInPeriod});
        if (compareAsc(parseISO(startDate), latestDate) >= 1) break;
    }

    latestDates.reverse();

    return latestDates;
};

export const getSummaryTotals = (transactions, funds, categories, fundAdditions) => {
    let obj = {};

    //make sure every key has a value even if no transactions for it
    funds.forEach(fund => obj[fund.name] = {saved: 0, target: fund.targetAmount, spent: 0, remaining: 0});
    categories.forEach(category => obj[category.name] = category.startingBalance > 0 ? category.startingBalance : 0);

    const addToTotals = tr => {
        let heading = getTransactionHeading(funds, categories, tr);

        if (tr.fund !== undefined) {
            let target = getFundTarget(funds, tr);            
            if (obj[heading] === undefined) obj[heading] = {saved: 0, target: target, spent: 0, remaining: 0};            
            
            if (tr.account > 0) obj[heading].spent += tr.amount;
            else obj[heading].saved += tr.amount;

            obj[heading].remaining = obj[heading].saved - obj[heading].spent;

            return;
        }

        if (obj[heading] === undefined) obj[heading] = 0;
        obj[heading] += tr.amount;
    }

    transactions.forEach(addToTotals);
    fundAdditions.forEach(addToTotals);

    //work out total remaining
    const incomeCategories = categories.filter(obj => obj.type === 'income');
    const expenseCategories = categories.filter(obj => obj.type === 'expense');

    let totalRemaining = 0;
    incomeCategories.forEach(category => totalRemaining += obj[category.name]);
    expenseCategories.forEach(category => totalRemaining -= obj[category.name]);
    funds.forEach(fund => totalRemaining -= obj[fund.name].saved);
    obj.remaining = totalRemaining;

    return obj;
}

export const getSummaryRows = (dates, transactions, funds, categories, fundAdditions) => {
    if (dates.length === 0) return [];    

    //create object to store final values
    let obj = {};
    dates.forEach(date => obj[date] = {});

    //filter out transactions that happened before first date and those which are for funds
    let filteredTransactions = transactions.filter(tr => {
        if (tr.fund !== undefined) return false;
        if (compareAsc(parseISO(tr.date), parseISO(dates[0])) >= 0) return true;
        return false;
    });

    //filter out fund additions that happened before first date
    let filteredFundAdditions = fundAdditions.filter(tr => {
        if (compareAsc(parseISO(tr.date), parseISO(dates[0])) >= 0) return true;
        return false;
    })
    

    //add transaction amounts to correct heading in object
    const addFunc = (tr) => {
        let periodDate = getPeriodOfTransaction(dates, tr.date);
        let heading = getTransactionHeading(funds, categories, tr);
        if (obj[periodDate][heading] === undefined) obj[periodDate][heading] = 0;
        obj[periodDate][heading] += tr.amount;
    }
    filteredTransactions.forEach(addFunc);
    filteredFundAdditions.forEach(addFunc);

    //calculate remaining amount in each period
    Object.values(obj).forEach(row => {        
        const incomeCategories = categories.filter(obj => obj.type === 'income');
        const expenseCategories = categories.filter(obj => obj.type === 'expense');

        let remaining = 0;
        incomeCategories.forEach(obj => remaining += row[obj.name] !== undefined ? row[obj.name] : 0);
        expenseCategories.forEach(obj => remaining -= row[obj.name] !== undefined ? row[obj.name] : 0);
        funds.forEach(obj => remaining -= row[obj.name] !== undefined ? row[obj.name] : 0);
        
        row.remaining = remaining;
    });
    
    return obj;
};

const getFundTarget = (funds, tr) => {
    let fund = funds.find(obj => obj.id === tr.fund);
    if (fund !== undefined) return fund.targetAmount;
    return 0;
}

const getTransactionHeading = (funds, categories, tr) => {
    if (tr.category !== undefined) {
        let category = categories.find(obj => obj.id === tr.category);
        if (category !== undefined) return category.name;
    } else if (tr.fund !== undefined) {
        let fund = funds.find(obj => obj.id === tr.fund);
        if (fund !== undefined) return fund.name;
    }
    return 'Un-Categorised';
}

const getPeriodOfTransaction = (dates, trDate) => {
    let periodDate = dates[0];

    for (let date of dates) {
        if (compareAsc(parseISO(trDate), parseISO(date)) >= 0) periodDate = date;
        else break;
    }
    
    return periodDate;
};

export const parseCurrency = (value) => {
    let { general } = store.getState();    
    let { currencySymbol, showDecimals } = general;    

    //make sure it doens't return -£0.00
    if (value > -0.009 && value < 0.009) return `${currencySymbol}0${showDecimals ? '.00' : ''}`;
    if (value === null || value === undefined || value === 0 || isNaN(value)) return `${currencySymbol}0${showDecimals ? '.00' : ''}`;
    let string = Number(value).toFixed(showDecimals ? 2 : 0);    

    let negative = false;
    if (string.includes('-')) {
        string = string.replace('-','');
        negative = true;
    }
    let arr = string.split('');

    for (let i = arr.length-4; i >= 0; i--) {
        let fromRight = arr.length - i - 4;
        if (fromRight > 0 && fromRight%3 === 0) arr[i] += ',';
    }

    arr.unshift(currencySymbol);
    if (negative) arr.unshift('-');
    return arr.join('');    
}

export const checkBudget = (budgets, date, categoryId, transactions, number=false) => {
    let budget = getLatestBudget(budgets, date, categoryId);

    if (budget !== undefined && budget.amount > 0) {
        if (number) return budget.amount;
        return ` / ${parseCurrency(budget.amount)}`;
    } else {
        if (number) return 0;
        return '';
    }    
}


const getLatestBudget = (budgets, date, category) => {
    for (let i = budgets.length-1; i >= 0; i--) {
        let budget = budgets[i];
        if (budget.category !== category) continue;
        if (compareDesc(parseISO(budget.startDate), parseISO(date)) >= 0) return budget;
    }
    return undefined;
}

export const checkFundTarget = (fund) => {
    if (fund === undefined) return '';
    if (fund.target !== 0) return ` / ${parseCurrency(fund.target)}`;
    else return '';
}

export const capitalize = (string) => {
    return string.slice(0,1).toUpperCase() + string.slice(1);
}

export const toCamelCase = (string) => {
    let removeSpaces = string.replace(/ /g, '');
    return removeSpaces.slice(0,1).toLowerCase() + removeSpaces.slice(1);
}

export const fromCamelCase = (string) => {
    let replaceCapitals = string.replace(/[A-Z]/g, ' $&');
    return capitalize(replaceCapitals);
}

//determine whether amount should be positive or negative
export const getAmount = (transaction, categories, accountId, asCurrency=true) => {
    //fund addition, so positive
    if (transaction.type === undefined) return asCurrency ? parseCurrency(transaction.amount) : transaction.amount;

    //transaction for a fund, so negative
    if (transaction.fund !== undefined) return asCurrency ? parseCurrency(-transaction.amount) : -transaction.amount;

    if (transaction.category !== undefined) {
        let category = categories.find(obj => obj.id === transaction.category);
        if (category !== undefined) {
            //transaction for expense category, so negative
            if (category.type === 'expense') return asCurrency ? parseCurrency(-transaction.amount) : -transaction.amount;

            //transaction for income category, so positive
            if (category.type ===  'income') return asCurrency ? parseCurrency(transaction.amount) : transaction.amount;
        } else {
            //has a category, but can't find it, so return 0
            return asCurrency ? parseCurrency(0) : 0;
        }
    }    

    if (transaction.from !== undefined && accountId !== undefined) {
        //transfer from this account, so negative
        if (transaction.from === accountId) return asCurrency ? parseCurrency(-transaction.amount) : -transaction.amount;

        //transfer to this account, so positive
        if (transaction.to === accountId) return asCurrency ? parseCurrency(transaction.amount) : transaction.amount;
    }
}

export const checkIfCanDelete = (obj) => {
    let id = obj.id;

    let { transactions, fundAdditions, budgets } = store.getState();

    let allObjs = [...transactions, ...fundAdditions, ...budgets];

    for (let obj of allObjs) {
        if (obj.category === id) return false;
        if (obj.fund === id) return false;
        if (obj.account === id) return false;
    }

    return true;
}

export const filterDeleted = (arr) => {
    return arr.filter(obj => obj.deleted !== undefined ? false : true);
}