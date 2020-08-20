import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { FaPiggyBank } from 'react-icons/fa';

import Table from '../components/Table';
import Grid from '../components/Grid';
import AmountGroup from '../components/AmountGroup';
import IconButton from '../components/IconButton';
import BudgetInput from '../components/BudgetInput';

import { getLatestDates, getSummaryRows, getSummaryTotals, parseCurrency, checkBudget, checkFundTarget, filterDeleted } from '../functions';

const SummaryTables = () => {
    const isMobile = useMediaQuery({ maxWidth: 700 });

    const general = useSelector(state => state.general);
    const transactions = useSelector(state => filterDeleted(state.transactions));
    const categories = useSelector(state => filterDeleted(state.categories));
    const budgets = useSelector(state => filterDeleted(state.budgets));
    const funds = useSelector(state => filterDeleted(state.funds));
    const fundAdditions = useSelector(state => filterDeleted(state.fundAdditions));

    const filteredFunds = funds.filter(obj => obj.complete === false);

    const dates = getLatestDates(general.startDate, general.payPeriodType);
    const [latestDate, setLatestDate] = useState(dates[dates.length-1]);

    const [editCategory, setEditCategory] = useState(0);

    const rows = getSummaryRows(dates, transactions, funds, categories, fundAdditions);

    const incomeCategories = categories.filter(obj => obj.type === 'income');
    const expenseCategories = categories.filter(obj => obj.type === 'expense');

    const summaryTotals = getSummaryTotals(transactions, funds, categories, fundAdditions);

    const toggleEditCategory = (id) => () => {
        if (editCategory === id) setEditCategory(0);
        else setEditCategory(id);
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

    if (isMobile) {
        let displayDate = latestDate;
        if (latestDate !== 'Totals') {
            displayDate = format(new Date(latestDate), 'do MMMM yyyy');
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
                <div>
                    <Grid>
                        { getHeading() }
                        { incomeCategories.map(obj => <AmountGroup key={'totals-heading-'+obj.id} title={obj.name} amount={parseCurrency(summaryTotals[obj.name])} type='income'/>) }
                        { filteredFunds.map(obj => <AmountGroup key={'totals-heading-'+obj.id} title={obj.name} amount={parseCurrency(summaryTotals[obj.name] ? summaryTotals[obj.name].remaining : 0)+checkFundTarget(summaryTotals[obj.name])} type='fund'/>) }
                        { expenseCategories.map(obj => <AmountGroup key={'totals-heading-'+obj.id} title={obj.name} amount={parseCurrency(summaryTotals[obj.name])} type='expense'/>) }
                        <AmountGroup title='TotalRemaining' amount={parseCurrency(summaryTotals.remaining)} type='remaining'/>
                    </Grid>
                </div>
            );
        }
        
        return (
            <div>
                <Grid>
                    { getHeading() }
                    { incomeCategories.map(obj => <AmountGroup key={'heading-'+obj.id} title={obj.name} amount={parseCurrency(rows[latestDate][obj.name])} type='income'/>) }
                    { filteredFunds.map(obj => <AmountGroup key={'heading-'+obj.id} title={obj.name} amount={parseCurrency(rows[latestDate][obj.name])} type='fund'/>) }
                    { expenseCategories.map(obj => <AmountGroup key={'heading-'+obj.id} title={obj.name} amount={parseCurrency(rows[latestDate][obj.name])} type='expense' editBudget={true} budget={checkBudget(budgets, latestDate, obj.id, transactions, true)} id={obj.id} date={latestDate}/>) }
                    <AmountGroup title='Remaining' amount={parseCurrency(rows[latestDate].remaining)} type='remaining'/>
                </Grid>
            </div>
        );
    }    

    return (
        <div>
            <h4>Period Summaries</h4>
            <Table>
                <thead>
                    <tr>
                        <td>Date</td>
                        { incomeCategories.map(obj => <td key={'heading-'+obj.id} className="income">{obj.name}</td>) }
                        { filteredFunds.map(obj => <td key={'heading-'+obj.id} className="fund">{obj.name}</td>) }
                        { expenseCategories.map(obj => <td key={'heading-'+obj.id} className="expense">{obj.name}<div className="budgetIcon" onClick={toggleEditCategory(obj.id)}><FaPiggyBank/></div></td>) }
                        <td className="remaining">Remaining</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        dates.map(date => {
                            return (
                                <tr key={'summaryDate-'+date}>
                                    <td>{date}</td>
                                    { incomeCategories.map(obj => <td key={obj.id}>{parseCurrency(rows[date][obj.name])}</td>) }
                                    { filteredFunds.map(obj => <td key={obj.id}>{parseCurrency(rows[date][obj.name])}</td>) }
                                    { expenseCategories.map(obj => <td key={obj.id}>{parseCurrency(rows[date][obj.name])}{editCategory === obj.id ? <span> / <BudgetInput value={checkBudget(budgets, date, obj.id, transactions, true)} category={obj.id} date={date}/></span> : checkBudget(budgets, date, obj.id, transactions)}</td>) }
                                    <td>{ parseCurrency(rows[date].remaining) }</td>
                                </tr>
                            )
                        })
                    }
                    <tr>
                        <td>Total</td>
                        { incomeCategories.map(obj => <td key={'totalsRow-'+obj.id}>{parseCurrency(summaryTotals[obj.name])}</td>) }
                        { filteredFunds.map(obj => <td key={'fundHeading-'+obj.id}>{parseCurrency(summaryTotals[obj.name].remaining)}{checkFundTarget(summaryTotals[obj.name])}</td>) }
                        { expenseCategories.map(obj => <td key={'totalsRow-'+obj.id}>{parseCurrency(summaryTotals[obj.name])}</td>) }
                        <td>{parseCurrency(summaryTotals.remaining)}</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}

export default SummaryTables;