import React from "react";
import { FaPiggyBank } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { format } from "date-fns";

import { reverseDate, parseCurrency, checkBudget, filterDeleted } from "../functions";

import Table from "./Table";
import BudgetInput from "./BudgetInput";

const SummaryTable = ({dates, incomeCategories, filteredFunds, expenseCategories, summaryTotals, rows, editCategory, toggleEditCategory, onClickValue, checkFundTarget, transactionId, getAmount}) => {
    const budgets = useSelector(state => filterDeleted(state.budgets));
    const transactions = useSelector(state => filterDeleted(state.transactions));
    const reverseSummaryTable = useSelector(state => state.general.reverseSummaryTable);
    const displayMonths = useSelector(state => state.general.displayMonths);

    const budgetIcon = (id) => {
        return <div className="budgetIcon" onClick={toggleEditCategory(id)}><FaPiggyBank/></div>;
    }

    const getTD = (obj, date, type) => {
        let amount = getAmount(rows, date, obj.name);
        let tdClassName = transactionId === obj.id+date ? 'trValue selected' : 'trValue';
        //only give class name if it's a cell user can click on
        if (amount === '-') tdClassName = '';
        return  <td key={obj.id+date} className={tdClassName} onClick={onClickValue(rows[date][obj.name], obj.name, type, obj.id+date)}>
                    { amount }
                    { editCategory === obj.id 
                        ? <span> / <BudgetInput value={checkBudget(budgets, date, obj.id, transactions, true)} category={obj.id} date={date}/></span> 
                        : checkBudget(budgets, date, obj.id, transactions) }
                </td>
    }

    const getValueRow = (arr, type) => {
        return arr.map(obj => {
            return  <tr key={obj.id}>
                        <td className={type} style={{minWidth: '120px'}}>{obj.name}{type === 'expense' ? budgetIcon(obj.id) : null}</td>
                        { dates.map(date => getTD(obj, date, type)) }
                        { 
                            type === 'fund' 
                                ? <td>{parseCurrency(summaryTotals[obj.name].remaining)}{checkFundTarget(summaryTotals[obj.name])}</td> 
                                : <td>{parseCurrency(summaryTotals[obj.name])}</td>
                        }
                    </tr>
        });
    }

    const formatDate = (date) => {
        if (displayMonths) return format(new Date(date), 'MMM-Y');
        else return reverseDate(date);
    }

    if (reverseSummaryTable) {
        let minWidth = displayMonths ? '110px' : '125px';
        return (
            <Table>
                <thead>
                    <tr>
                        <td>Dates</td>
                        { dates.map(date => <td key={'date-'+date} style={{minWidth: minWidth}}>{formatDate(date)}</td>) }
                        <td>Total</td>
                    </tr>    
                </thead>  
                <tbody>
                    { getValueRow(incomeCategories, 'income') }
                    { getValueRow(filteredFunds, 'fund') }
                    { getValueRow(expenseCategories, 'expense') }
                    <tr>
                        <td className="remaining">Remaining</td>
                        { dates.map(date => <td key={'remaining-'+date}>{ parseCurrency(rows[date].remaining) }</td>) }
                        <td>{parseCurrency(summaryTotals.remaining)}</td>
                    </tr>
                </tbody>
            </Table>
        );
    }

    const getValue = (arr, date, type) => {
        return arr.map(obj => getTD(obj, date, type));
    }

    return (
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
                                <td>{formatDate(date)}</td>
                                { getValue(incomeCategories, date, 'income') }
                                { getValue(filteredFunds, date, 'fund') }
                                { getValue(expenseCategories, date, 'expense') }
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
    );
}

export default SummaryTable;