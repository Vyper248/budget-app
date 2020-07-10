import React from 'react';
import { useMediaQuery } from 'react-responsive'

import { useSelector } from 'react-redux';
import { format } from 'date-fns';

import Table from '../components/Table';
import Grid from '../components/Grid';
import AmountGroup from '../components/AmountGroup';

import { getLatestDates, getSummaryRows, getSummaryTotals, parseCurrency, checkBudget } from '../functions';

const SummaryTables = () => {
    const isMobile = useMediaQuery({ maxWidth: 700 });

    const general = useSelector(state => state.general);
    const transactions = useSelector(state => state.transactions);
    const categories = useSelector(state => state.categories);
    const budgets = useSelector(state => state.budgets);
    const funds = useSelector(state => state.funds);
    const fundAdditions = useSelector(state => state.fundAdditions);
    const accounts = useSelector(state => state.accounts);

    const dates = getLatestDates(general.startDate, general.payPeriodType);
    const rows = getSummaryRows(dates, transactions, funds, categories, fundAdditions);

    const incomeCategories = categories.filter(obj => obj.type === 'income');
    const expenseCategories = categories.filter(obj => obj.type === 'expense');

    const summaryTotals = getSummaryTotals(transactions, funds, categories, fundAdditions);

    if (isMobile) {
        let latestDate = dates[dates.length-1];
        let displayDate = format(new Date(latestDate), 'do MMMM yyyy');
        
        return (
            <div>
                <Grid>
                    <div style={{fontSize: '1.5em', gridColumnStart: 1, gridColumnEnd: 3, fontWeight: 'bold'}}>{displayDate}</div>
                    { incomeCategories.map(obj => <AmountGroup key={'heading-'+obj.id} title={obj.name} amount={parseCurrency(rows[latestDate][obj.name])} type='income'/>) }
                    { funds.map(obj => <AmountGroup key={'heading-'+obj.id} title={obj.name} amount={parseCurrency(rows[latestDate][obj.name])} type='fund'/>) }
                    { expenseCategories.map(obj => <AmountGroup key={'heading-'+obj.id} title={obj.name} amount={parseCurrency(rows[latestDate][obj.name])+checkBudget(budgets, latestDate, obj.id, transactions)} type='expense'/>) }
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
                        <td></td>
                        { incomeCategories.map(obj => <td key={'heading-'+obj.id}>{obj.name}</td>) }
                        { funds.map(obj => <td key={'heading-'+obj.id}>{obj.name}</td>) }
                        { expenseCategories.map(obj => <td key={'heading-'+obj.id}>{obj.name}</td>) }
                        <td>Remaining</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        dates.map(date => {
                            return (
                                <tr key={'summaryDate-'+date}>
                                    <td>{date}</td>
                                    { incomeCategories.map(obj => <td key={obj.id}>{parseCurrency(rows[date][obj.name])}</td>) }
                                    { funds.map(obj => <td key={obj.id}>{parseCurrency(rows[date][obj.name])}</td>) }
                                    { expenseCategories.map(obj => <td key={obj.id}>{parseCurrency(rows[date][obj.name])}{checkBudget(budgets, date, obj.id, transactions)}</td>) }
                                    <td>{ parseCurrency(rows[date].remaining) }</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>

            <h4>Totals</h4>
            <Table>
                <thead>
                    <tr>
                        { incomeCategories.map(obj => <td key={'totalsHeading-'+obj.id}>{obj.name}</td>) }
                        { expenseCategories.map(obj => <td key={'totalsHeading-'+obj.id}>{obj.name}</td>) }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        { incomeCategories.map(obj => <td key={'totalsRow-'+obj.id}>{parseCurrency(summaryTotals[obj.name])}</td>) }
                        { expenseCategories.map(obj => <td key={'totalsRow-'+obj.id}>{parseCurrency(summaryTotals[obj.name])}</td>) }
                    </tr>
                </tbody>
            </Table>

            <h4>Funds</h4>
            <Table>
                <thead>
                    <tr>
                        <td></td>
                        { funds.map(obj => <td key={'fundHeading-'+obj.id}>{obj.name}</td>) }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Target</td>
                        { funds.map(obj => <td key={'fundTotalTarget-'+obj.id}>{summaryTotals[obj.name] !== undefined ? parseCurrency(summaryTotals[obj.name].target) : parseCurrency(0)}</td>) }
                    </tr>
                    <tr>
                        <td>Saved</td>
                        { funds.map(obj => <td key={'fundTotalSaved-'+obj.id}>{summaryTotals[obj.name] !== undefined ? parseCurrency(summaryTotals[obj.name].saved) : parseCurrency(0)}</td>) }
                    </tr>
                    <tr>
                        <td>Spent</td>
                        { funds.map(obj => <td key={'fundTotalSpent-'+obj.id}>{summaryTotals[obj.name] !== undefined ? parseCurrency(summaryTotals[obj.name].spent) : parseCurrency(0)}</td>) }
                    </tr>
                    <tr>
                        <td>Remaining</td>
                        { funds.map(obj => <td key={'fundTotalRemaining-'+obj.id}>{summaryTotals[obj.name] !== undefined ? parseCurrency(summaryTotals[obj.name].remaining) : parseCurrency(0)}</td>) }
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}

export default SummaryTables;