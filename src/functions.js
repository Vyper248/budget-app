import { add, compareAsc, parseISO, format } from 'date-fns';
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

    if (value === null || value === undefined || value === 0) return `${currencySymbol}0${showDecimals ? '.00' : ''}`;
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

export const checkBudget = (budgets, date, categoryId, transactions) => {
    let budget = budgets.find(obj => {
        if (compareAsc(parseISO(obj.startDate), parseISO(date)) === 1) return false;
        if (obj.endDate !== undefined && compareAsc(parseISO(obj.endDate), parseISO(date)) === -1) return false;
        return true;
    });

    if (budget !== undefined) {
        return ` / ${parseCurrency(budget.amount)}`;
    } else {
        return '';
    }    
}