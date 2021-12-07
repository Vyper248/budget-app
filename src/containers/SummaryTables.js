import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import Grid from '../components/Grid';
import AmountGroup from '../components/AmountGroup';
import IconButton from '../components/IconButton';
import AccountSummary from '../components/AccountSummary';
import TopPopup from '../components/TopPopup';
import TransactionList from '../components/TransactionList';
import SummaryTable from '../components/SummaryTable';
import PieChart from '../components/PieChart';

import { getLatestDates, getAllDates, getSummaryRows, getSummaryTotals, getAccountSummary, parseCurrency, checkBudget, checkFundTarget, filterDeleted } from '../functions';

const getChartData = (summaryTotals, expenseCategories, funds) => {
    const chartData = [];

    expenseCategories.forEach(cat => {
        let value = summaryTotals[cat.name];
        let obj = {label: cat.name, value: value};
        chartData.push(obj);
    });

    funds.forEach(fund => {
        console.log(fund);
        let fundObj = summaryTotals[fund.name];
        let obj = {label: fund.name, value: fundObj.saved};
        chartData.push(obj);
    });

    chartData.push({label: 'Remaining', value: summaryTotals.remaining});

    return chartData;
}

const SummaryTables = () => {
    const isMobile = useMediaQuery({ maxWidth: 700 });

    const general = useSelector(state => state.general);
    const transactions = useSelector(state => filterDeleted(state.transactions));
    const categories = useSelector(state => filterDeleted(state.categories));
    const budgets = useSelector(state => filterDeleted(state.budgets));
    const funds = useSelector(state => filterDeleted(state.funds));
    const fundAdditions = useSelector(state => filterDeleted(state.fundAdditions));
    const accounts = useSelector(state => filterDeleted(state.accounts));

    const filteredFunds = funds.filter(obj => obj.complete === false);

    const [latestDate, setLatestDate] = useState('Totals');
        
    const [showTransactions, setShowTransactions] = useState(false);
    const [transactionArray, setTransactionArray] = useState([]);
    const [transactionHeading, setTransactionHeading] = useState('');
    const [transactionPos, setTransactionPos] = useState({x: 0, y: 0});
    const [transactionId, setTransactionId] = useState(0);
    const [transactionType, setTransactionType] = useState('');
    const [extraDates, setExtraDates] = useState(general.periodsToDisplay);
    
    let periodsToDisplay = extraDates > general.periodsToDisplay ? extraDates : general.periodsToDisplay;
    const dates = getLatestDates(general.startDate, general.payPeriodType, periodsToDisplay);
    const allDates = getAllDates(general.startDate, general.payPeriodType);
    const rows = getSummaryRows(dates, transactions, funds, categories, fundAdditions);

    const incomeCategories = categories.filter(obj => obj.type === 'income' && obj.hidden === false);
    const expenseCategories = categories.filter(obj => obj.type === 'expense' && obj.hidden === false);

    const summaryTotals = getSummaryTotals(transactions, funds, categories, fundAdditions);
    const accountSummary = getAccountSummary(transactions, accounts, categories);
    const accountTotal = accountSummary.reduce((a,c) => { return a+c.total; }, 0);

    const showMorePeriods = () => {
        let add = general.periodsToDisplay > 0 ? general.periodsToDisplay : 12;
        let qty = extraDates + add;
        if (qty > allDates.length) qty = allDates.length;
        setExtraDates(qty);
    }

    const showLessPeriods = () => {
        let subtract = general.periodsToDisplay > 0 ? general.periodsToDisplay : 12;
        let qty = extraDates-subtract;
        if (qty < general.periodsToDisplay) qty = general.periodsToDisplay;
        setExtraDates(qty);
    }

    const setPreviousDate = () => {
        if (latestDate === 'Totals') {
            setLatestDate(dates[dates.length-1]);
            return;
        }

        let currentIndex = dates.indexOf(latestDate);
        let newIndex = currentIndex-1;
        if (newIndex < 0) return;

        let newDate = dates[newIndex];
        setLatestDate(newDate);
    }

    const setNextDate = () => {
        let currentIndex = dates.indexOf(latestDate);
        let newIndex = currentIndex+1;
        if (newIndex > dates.length-1) {
            setLatestDate('Totals');
            return;
        } else if (latestDate === 'Totals') {
            return;
        }

        let newDate = dates[newIndex];
        setLatestDate(newDate);
    }

    const onClickValue = (obj, heading='', type='', id) => (e) => {
        if (obj === undefined) return;
        let transactions = obj.transactions;
        setShowTransactions(true);
        setTransactionArray(transactions);
        setTransactionHeading(heading);
        setTransactionType(type);
        setTransactionId(id);

        let leftPos = e.target.offsetLeft-550;
        if (leftPos < 0) leftPos = e.target.offsetLeft + e.target.offsetWidth - 101;
        let topPos = e.target.offsetTop - 101;
        setTransactionPos({x: leftPos, y: topPos});
    }

    const onCloseTransactions = () => {
        setShowTransactions(false);
        setTransactionArray([]);
        setTransactionHeading('');
        setTransactionPos(0);
        setTransactionType('');
        setTransactionId(0);
    }

    const chartData = getChartData(summaryTotals, expenseCategories, funds);

    if (isMobile) {
        let displayDate = latestDate;
        if (latestDate !== 'Totals') {
            displayDate = format(new Date(latestDate), 'do MMM yyyy');
        }

        let index = dates.indexOf(latestDate);

        const getHeading = () => {
            return (
                <Grid style={{fontSize: '1.5em', fontWeight: 'bold', margin: '0px'}} start='1' end='3' template='50px auto 50px'>
                    { index === 0 ? <div></div> : <IconButton Icon={FiArrowLeft} onClick={setPreviousDate} size='1.3em' topAdjust='0px'/> }
                    <div>{displayDate}</div> 
                    { latestDate === 'Totals' ? <div></div> : <IconButton Icon={FiArrowRight} onClick={setNextDate} size='1.3em' topAdjust='0px'/> }
                </Grid>
            );
        }

        //when user goes foward from starting date, they can see the totals for each category
        if (latestDate === 'Totals') {
            return (
                <div style={{marginBottom: '100px'}}>
                    <Grid>
                        { getHeading() }
                        { incomeCategories.map(obj => <AmountGroup key={'totals-heading-'+obj.id} title={obj.name} amount={parseCurrency(summaryTotals[obj.name])} type='income'/>) }
                        { filteredFunds.map(obj => <AmountGroup key={'totals-heading-'+obj.id} title={obj.name} amount={parseCurrency(summaryTotals[obj.name] ? summaryTotals[obj.name].remaining : 0)+checkFundTarget(summaryTotals[obj.name])} type='fund'/>) }
                        { expenseCategories.map(obj => <AmountGroup key={'totals-heading-'+obj.id} title={obj.name} amount={parseCurrency(summaryTotals[obj.name])} type='expense'/>) }
                        <AmountGroup title='Remaining' amount={parseCurrency(summaryTotals.remaining)} type='remaining'/>
                    </Grid>

                    <h3>Accounts</h3>
                    <Grid>
                        { accountSummary.map(obj => <AmountGroup key={'account-'+obj.id} title={obj.name} amount={parseCurrency(obj.total)} type='account'/>) }
                        <AmountGroup title='Total' amount={parseCurrency(accountTotal)} type='remaining'/>
                    </Grid>
                </div>
            );
        }
        
        return (
            <div style={{marginBottom: '100px'}}>
                <Grid>
                    { getHeading() }
                    { incomeCategories.map(obj => <AmountGroup key={'heading-'+obj.id} title={obj.name} amount={getAmount(rows, latestDate, obj.name)} type='income'/>) }
                    { filteredFunds.map(obj => <AmountGroup key={'heading-'+obj.id} title={obj.name} amount={getAmount(rows, latestDate, obj.name)} type='fund'/>) }
                    { expenseCategories.map(obj => <AmountGroup key={'heading-'+obj.id} title={obj.name} amount={getAmount(rows, latestDate, obj.name)} type='expense'/>) }
                    <AmountGroup title='Remaining' amount={parseCurrency(rows[latestDate].remaining)} type='remaining'/>
                </Grid>
            </div>
        );
    }    

    return (
        <div>
            {
                general.swapSummaries ? (<div>
                    <h4>Account Summaries</h4>
                    <AccountSummary arr={accountSummary} total={accountTotal}/>
                </div>) : null
            }
            <h4>Period Summaries</h4>
            { 
                showTransactions ? <TopPopup onClose={onCloseTransactions} posX={transactionPos.x} posY={transactionPos.y} width={'450px'}>
                        <TransactionList heading={transactionHeading} transactions={transactionArray} type={transactionType}/>
                    </TopPopup> : null 
            }
            <SummaryTable 
                dates={dates} allDates={allDates}
                incomeCategories={incomeCategories} filteredFunds={filteredFunds} expenseCategories={expenseCategories} 
                summaryTotals={summaryTotals} rows={rows} 
                onClickValue={onClickValue} checkFundTarget={checkFundTarget} 
                transactionId={transactionId} getAmount={getAmount}
                showMorePeriods={showMorePeriods} showLessPeriods={showLessPeriods}
            />
            {
                !general.swapSummaries ? (<div>
                    <h4>Account Summaries</h4>
                    <AccountSummary arr={accountSummary} total={accountTotal}/>
                </div>) : null
            }
            { general.showChart ? <PieChart width={600} data={chartData} title='Totals Chart'/> : null }
        </div>
    );
}

const getAmount = (rows, date, name) => {
    let valueObj = rows[date][name];
    if (valueObj === undefined) return '-';
    return parseCurrency(valueObj.amount);
}

export default SummaryTables;