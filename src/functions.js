import { add, compareAsc, compareDesc, parseISO, format } from 'date-fns';
import store from './redux/store';

export const getLatestDates = (startDate, periodLength, periods=0) => {
    let daysInPeriod = getDaysInPeriod(periodLength);

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
    if (periods > 0) numberOfPeriods = periods;
    for (let i = 0; i < numberOfPeriods; i++) {
        latestDates.push(formatDate(latestDate, 'yyyy-MM-dd'));
        latestDate = periodLength === 'monthly' ? add(latestDate, {months: -1}) : add(latestDate, {days: -daysInPeriod});
        if (compareAsc(parseISO(startDate), latestDate) >= 1) break;
    }

    latestDates.reverse();

    return latestDates;
};

export const getAllDates = (startDate, periodLength) => {
    let daysInPeriod = getDaysInPeriod(periodLength);

    //go forwards from starting date to todays date
    let currentDate = parseISO(startDate);
    let today = new Date();

    let dates = [];

    while (compareAsc(today, currentDate) === 1) {
        dates.push(formatDate(currentDate, 'yyyy-MM-dd'));
        if (periodLength === 'monthly') currentDate = add(currentDate, {months: 1});
        else currentDate = add(currentDate, {days: daysInPeriod});
    }

    return dates;
}

export const getDaysInPeriod = (periodLength) => {
    switch (periodLength) {
        case 'monthly': return 30;
        case 'weekly': return 7;
        case 'twoWeekly': return 14;
        case 'fourWeekly': return 28;
        default: return 30;
    }
}

export const getSummaryTotals = (transactions, funds, categories, fundAdditions, dateFrom, dateTo) => {
    let obj = {};
    let dateMode = dateFrom !== undefined && dateTo !== undefined;

    //store names in object for quick lookup
    let {categoryNames, fundNames} = createNameObjects(categories, funds);

    //make sure every key has a value even if no transactions for it
    funds.forEach(fund => {
        let saved = fund.startingBalance > 0 ? fund.startingBalance : 0;
        if (dateMode) saved = 0;
        obj[fund.name] = {saved: saved, target: fund.targetAmount, spent: 0, remaining: saved};
    });
    categories.forEach(category => {
        let amount = category.startingBalance > 0 ? category.startingBalance : 0;
        if (dateMode) amount = 0;
        obj[category.name] = amount;
    });

    const addToTotals = tr => {
        if (dateMode) {
            //if date is not after or including first date, ignore
            if (compareAsc(parseISO(tr.date), parseISO(dateFrom)) === -1) return;
            //if date is after second date, ignore
            if (compareAsc(parseISO(tr.date), parseISO(dateTo)) === 1) return;
        }
        
        let heading = getTransactionHeading(fundNames, categoryNames, tr);

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

    //calculate total remaining
    let totalRemaining = 0;
    incomeCategories.forEach(category => totalRemaining += obj[category.name]);
    expenseCategories.forEach(category => totalRemaining -= obj[category.name]);
    funds.forEach(fund => totalRemaining -= obj[fund.name].saved);
    obj.remaining = totalRemaining;

    //calculate totals for income and expenses
    let totalIncome = 0;
    incomeCategories.forEach(category => totalIncome += obj[category.name]);
    obj.totalIncome = totalIncome;

    let totalExpenses = 0;
    expenseCategories.forEach(category => totalExpenses += obj[category.name]);
    obj.totalExpenses = totalExpenses;

    return obj;
}

export const getSummaryRows = (dates, transactions, funds, categories, fundAdditions) => {
    if (dates.length === 0) return [];    

    //create object to store final values
    let obj = {};
    dates.forEach(date => obj[date] = {});

    //store names in object for quick lookup
    let {categoryNames, fundNames} = createNameObjects(categories, funds);

    //filter out transactions that happened before first date and those which are for funds
    let filteredTransactions = transactions.filter(tr => {
        if (tr.fund !== undefined) return false;
        if (tr.type === 'transfer') return false;
        if (compareAsc(parseISO(tr.date), parseISO(dates[0])) >= 0) return true;
        return false;
    });

    //filter out fund additions that happened before first date
    let filteredFundAdditions = fundAdditions.filter(tr => {
        if (compareAsc(parseISO(tr.date), parseISO(dates[0])) >= 0) return true;
        return false;
    });

    //filter out transactions for funds, to be added after remaining amounts have been calculated
    let filteredFundTransactions = transactions.filter(tr => {
        if (compareAsc(parseISO(tr.date), parseISO(dates[0])) < 0) return false;
        if (tr.fund !== undefined) return true;
        return false;
    });

    //add transaction amounts to correct heading in object
    const addFunc = (negative) => (tr) => {
        let periodDate = getPeriodOfTransaction(dates, tr.date);
        let heading = getTransactionHeading(fundNames, categoryNames, tr);
        if (obj[periodDate][heading] === undefined) obj[periodDate][heading] = {amount: 0, transactions: []};
        if (negative === true) obj[periodDate][heading].amount -= tr.amount;
        else obj[periodDate][heading].amount += tr.amount;

        obj[periodDate][heading].transactions.push(tr);
    }
    filteredTransactions.forEach(addFunc(false));
    filteredFundAdditions.forEach(addFunc(false));

    //calculate remaining amount in each period
    Object.values(obj).forEach(row => {        
        const incomeCategories = categories.filter(obj => obj.type === 'income');
        const expenseCategories = categories.filter(obj => obj.type === 'expense');

        let remaining = 0;
        incomeCategories.forEach(obj => remaining += row[obj.name] !== undefined ? row[obj.name].amount : 0);
        expenseCategories.forEach(obj => remaining -= row[obj.name] !== undefined ? row[obj.name].amount : 0);
        funds.forEach(obj => remaining -= row[obj.name] !== undefined ? row[obj.name].amount : 0);
        
        row.remaining = remaining;

        //calculate income and expense totals
        let incomeTotal = 0;
        incomeCategories.forEach(obj => incomeTotal += row[obj.name] !== undefined ? row[obj.name].amount : 0);
        row.incomeTotal = incomeTotal;

        let expenseTotal = 0;
        expenseCategories.forEach(obj => expenseTotal += row[obj.name] !== undefined ? row[obj.name].amount : 0);
        row.expenseTotal = expenseTotal;
    });

    //add fund transactions, shouldn't have any effect on remaining amount as they come out of the fund instead
    filteredFundTransactions.forEach(addFunc(true));
    
    return obj;
};

export const getAccountSummary = (transactions, accounts, categories) => {
    let objs = [];

    accounts.forEach(account => {
        if (account.closed) return;

        const filteredTransactions = transactions.filter(obj => {
            if (obj.from !== undefined && obj.to !== undefined && (obj.from === account.id || obj.to === account.id)) return true; 
            return obj.account !== undefined && obj.account === account.id ? true : false;
        });   

        let total = filteredTransactions.reduce((t,c) => {
            t += getAmount(c, categories, account.id, false);
            return t;
        }, 0);        

        if (account.startingBalance !== undefined) {
            total += parseFloat(account.startingBalance);
        }

        objs.push({name: account.name, total: total, id: account.id});
    });

    return objs;
}

const createNameObjects = (categories, funds) => {
    let categoryNames = {};
    let fundNames = {};

    categories.forEach(category => categoryNames[category.id] = category.name);
    funds.forEach(fund => fundNames[fund.id] = fund.name);

    return {categoryNames, fundNames};
}

const getFundTarget = (funds, tr) => {
    let fund = funds.find(obj => obj.id === tr.fund);
    if (fund !== undefined) return fund.targetAmount;
    return 0;
}

const getTransactionHeading = (fundNames, categoryNames, tr) => {
    if (tr.category !== undefined) {
        let name = categoryNames[tr.category];
        if (name !== undefined) return name;
    } else if (tr.fund !== undefined) {
        let name = fundNames[tr.fund];
        if (name !== undefined) return name;
    }
    return 'Un-Categorised';
}

export const getPeriodOfTransaction = (dates, trDate) => {
    let periodDate = dates[0];

    for (let date of dates) {
        if (compareAsc(parseISO(trDate), parseISO(date)) >= 0) periodDate = date;
        else break;
    }
    
    return periodDate;
}

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
    budgets.sort((a,b) => {
        return compareAsc(parseISO(a.startDate), parseISO(b.startDate));
    });

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
        if (obj.from === id) return false;
        if (obj.to === id) return false;
    }

    if (obj.startingBalance !== undefined && obj.startingBalance > 0) return false;

    return true;
}

export const filterDeleted = (arr, ignoreHidden=false) => {
    return arr.filter(obj => {
        if (obj.deleted !== undefined) return false;
        if (ignoreHidden && obj.hidden) return false;
        if (ignoreHidden && obj.closed) return false;
        if (ignoreHidden && obj.complete) return false;
        return true;
    });
}

export const filterTransactions = (arr=[], filter='') => {
    return arr.filter(obj => {
        if (obj.description) return obj.description.toLowerCase().includes(filter.toLowerCase());
        else if (filter.length > 0) return false;
        else return true;
    });
}

export const formatDate = (date, formatMethod='MMM d, yyyy') => {
    if (date === undefined) return '';
    if (date.length === 0) return '';
    let formattedDate = 'Incorrect Date Format';

    try {
        let parsed = parseISO(date).toString() === 'Invalid Date' ? date : parseISO(date);
        formattedDate = format(parsed, formatMethod);
    } catch (err) {
        console.log(err.message);
    }

    return formattedDate;
} 

export const reverseDate = (date) => {
    return formatDate(date, 'dd-MM-yyyy');
}

export const today = () => {
    return format(new Date(), 'yyyy-MM-dd');
}

export const parseTransaction = (tr) => {
    let { categories, accounts, funds } = store.getState();
    let copyTr = {...tr};

    if (copyTr.category !== undefined) {
        let category = categories.find((obj) => obj.id === copyTr.category);
        if (category !== undefined) copyTr.category = category.name;
    }

    if (copyTr.account !== undefined) {
        let account = accounts.find((obj) => obj.id === copyTr.account);
        if (account !== undefined) copyTr.account = account.name;
    }

    if (copyTr.fund !== undefined) {
        let fund = funds.find((obj) => obj.id === copyTr.fund);
        if (fund !== undefined) copyTr.fund = fund.name;
    }

    if (copyTr.from !== undefined) {
        let account = accounts.find((obj) => obj.id === copyTr.from);
        if (account !== undefined) copyTr.from = account.name;
    }

    if (copyTr.to !== undefined) {
        let account = accounts.find((obj) => obj.id === copyTr.to);
        if (account !== undefined) copyTr.to = account.name;
    }

    return copyTr;
}

export const getSpendingsTableObjs = (accounts, categories, funds, transactions, fromDate, toDate) => {
    //Setup table object
    const tableObj = {totals: {}};
    const accountTotals = {};

    //Setup income table object
    const incomeTableObj = {totals: {}};
    const incomeAccountTotals = {};

    const setupTableObj = (obj) => {
        let itemObj = {};
        accounts.forEach(account => itemObj[account.name] = 0);
        // accounts.forEach(account => itemObj[account.name+'-data'] = []);

        incomeTableObj[obj.name] = itemObj;
        incomeTableObj.totals[obj.name] = 0;
        tableObj[obj.name] = itemObj;
        tableObj.totals[obj.name] = 0;
    };

    categories.forEach(setupTableObj);
    funds.forEach(setupTableObj);
    accounts.forEach(account => {
        accountTotals[account.name] = 0;
        incomeAccountTotals[account.name] = 0;
    });
    
    //add transaction data to table object
    transactions.forEach(tr => {
        if (tr.type !== 'spend') return;

        if (compareAsc(parseISO(tr.date), parseISO(fromDate)) === -1) return; //if before fromDate, ignore
        if (compareAsc(parseISO(tr.date), parseISO(toDate)) === 1) return; //if after toDate, ignore

        let category = categories.find(obj => obj.id === tr.category);
        
        let parsed = parseTransaction(tr);
        let key = parsed.category !== undefined ? parsed.category : parsed.fund;

        if (category?.type === 'income') {
            incomeTableObj[key][parsed.account] += parsed.amount;
            // incomeTableObj[key][parsed.account+'-data'].push(parsed);
            incomeTableObj.totals[key] += parsed.amount;
            incomeAccountTotals[parsed.account] += parsed.amount;
        } else {
            tableObj[key][parsed.account] += parsed.amount;
            // tableObj[key][parsed.account+'-data'].push(parsed);
            tableObj.totals[key] += parsed.amount;
            accountTotals[parsed.account] += parsed.amount;
        }
    });

    let totalAmount = Object.values(tableObj.totals).reduce((a,c) => a+c, 0);
    let totalIncomeAmount = Object.values(incomeTableObj.totals).reduce((a,c) => a+c, 0);

    return {tableObj, accountTotals, incomeTableObj, incomeAccountTotals, totalAmount, totalIncomeAmount};
}

export const changeColourScheme = (scheme) => {
    let root = document.documentElement;

    if (scheme === 'dark') {
        root.style.setProperty('--bg-color', '#222');
        root.style.setProperty('--text-color', 'white');
        root.style.setProperty('--light-text-color', '#CCC');
        root.style.setProperty('--icon-color', '#4dc6ff');

        root.style.setProperty('--menu-bg-color', '#009fe8');
        root.style.setProperty('--menu-selected-bg-color', '#0076ad');
        root.style.setProperty('--menu-text-color', 'white');
        root.style.setProperty('--menu-selected-text-color', 'white');
        root.style.setProperty('--menu-border-color', '#BBB');
        
        root.style.setProperty('--footer-bg', '#222');
        root.style.setProperty('--footer-border', '#009fe8');
        
        root.style.setProperty('--table-heading-bg-color', '#009fe8');
        root.style.setProperty('--table-heading-text-color', 'white');
        
        root.style.setProperty('--obj-highlight-bg', '#444');
        root.style.setProperty('--obj-highlight-text', 'white');

        root.style.setProperty('--mild-highlight', '#333');
    }

    if (scheme === 'black') {
        root.style.setProperty('--bg-color', 'black');
        root.style.setProperty('--text-color', 'white');
        root.style.setProperty('--light-text-color', '#CCC');
        root.style.setProperty('--icon-color', '#4dc6ff');

        root.style.setProperty('--menu-bg-color', '#009fe8');
        root.style.setProperty('--menu-selected-bg-color', '#0076ad');
        root.style.setProperty('--menu-text-color', 'white');
        root.style.setProperty('--menu-selected-text-color', 'white');
        root.style.setProperty('--menu-border-color', '#BBB');
        
        root.style.setProperty('--footer-bg', 'black');
        root.style.setProperty('--footer-border', '#009fe8');
        
        root.style.setProperty('--table-heading-bg-color', '#009fe8');
        root.style.setProperty('--table-heading-text-color', 'white');

        root.style.setProperty('--obj-highlight-bg', '#444');
        root.style.setProperty('--obj-highlight-text', 'white');

        root.style.setProperty('--mild-highlight', '#222');
    }

    if (scheme === 'light') {
        root.style.setProperty('--bg-color', 'white');
        root.style.setProperty('--text-color', 'black');
        root.style.setProperty('--light-text-color', '#555');
        root.style.setProperty('--icon-color', 'black');

        root.style.setProperty('--menu-bg-color', '#009fe8');
        root.style.setProperty('--menu-selected-bg-color', '#0076ad');
        root.style.setProperty('--menu-text-color', 'white');
        root.style.setProperty('--menu-selected-text-color', 'white');
        root.style.setProperty('--menu-border-color', 'black');
        
        root.style.setProperty('--footer-bg', 'white');
        root.style.setProperty('--footer-border', 'black');
        
        root.style.setProperty('--table-heading-bg-color', '#AAA');
        root.style.setProperty('--table-heading-text-color', 'black');

        root.style.setProperty('--obj-highlight-bg', '#CCC');
        root.style.setProperty('--obj-highlight-text', 'black');

        root.style.setProperty('--mild-highlight', '#EEE');
    }
}