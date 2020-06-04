import React from 'react';
import './App.css';

import { useSelector } from 'react-redux';

import Header from './components/Header';
import Table from './components/Table';

import { getLatestDates, getSummaryRows, getSummaryTotals, parseCurrency, checkBudget } from './functions';

function App() {
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

    return (
        <div className="App">
            <Header/>
            <h4>Period Summaries</h4>
            <Table>
                <thead>
                    <tr>
                        <td></td>
                        { incomeCategories.map(obj => <td>{obj.name}</td>) }
                        { funds.map(obj => <td>{obj.name}</td>) }
                        { expenseCategories.map(obj => <td>{obj.name}</td>) }
                        <td>Remaining</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        dates.map(date => {
                            return (
                                <tr>
                                    <td>{date}</td>
                                    { incomeCategories.map(obj => <td>{parseCurrency(rows[date][obj.name])}</td>) }
                                    { funds.map(obj => <td>{parseCurrency(rows[date][obj.name])}</td>) }
                                    { expenseCategories.map(obj => <td>{parseCurrency(rows[date][obj.name])}{checkBudget(budgets, date, obj.id, transactions)}</td>) }
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
                        { incomeCategories.map(obj => <td>{obj.name}</td>) }
                        { expenseCategories.map(obj => <td>{obj.name}</td>) }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        { incomeCategories.map(obj => <td>{parseCurrency(summaryTotals[obj.name])}</td>) }
                        { expenseCategories.map(obj => <td>{parseCurrency(summaryTotals[obj.name])}</td>) }
                    </tr>
                </tbody>
            </Table>

            <h4>Funds</h4>
            <Table>
                <thead>
                    <tr>
                        <td></td>
                        { funds.map(obj => <td>{obj.name}</td>) }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Target</td>
                        { funds.map(obj => <td>{summaryTotals[obj.name] !== undefined ? parseCurrency(summaryTotals[obj.name].target) : parseCurrency(0)}</td>) }
                    </tr>
                    <tr>
                        <td>Saved</td>
                        { funds.map(obj => <td>{summaryTotals[obj.name] !== undefined ? parseCurrency(summaryTotals[obj.name].saved) : parseCurrency(0)}</td>) }
                    </tr>
                    <tr>
                        <td>Spent</td>
                        { funds.map(obj => <td>{summaryTotals[obj.name] !== undefined ? parseCurrency(summaryTotals[obj.name].spent) : parseCurrency(0)}</td>) }
                    </tr>
                    <tr>
                        <td>Remaining</td>
                        { funds.map(obj => <td>{summaryTotals[obj.name] !== undefined ? parseCurrency(summaryTotals[obj.name].remaining) : parseCurrency(0)}</td>) }
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}



export default App;
