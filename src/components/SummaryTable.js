import React from "react";
import { FaPiggyBank } from "react-icons/fa";
import { useSelector } from 'react-redux';

import { reverseDate, parseCurrency, checkBudget, filterDeleted } from "../functions";

import Table from "./Table";
import BudgetInput from "./BudgetInput";

const SummaryTable = ({dates, incomeCategories, filteredFunds, expenseCategories, summaryTotals, rows, editCategory, toggleEditCategory, onClickValue, checkFundTarget, transactionId, getAmount}) => {
    const budgets = useSelector(state => filterDeleted(state.budgets));
    const transactions = useSelector(state => filterDeleted(state.transactions));

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
                                <td>{reverseDate(date)}</td>
                                { incomeCategories.map(obj => <td key={obj.id} className={transactionId === obj.id+date ? 'trValue selected' : 'trValue'} onClick={onClickValue(rows[date][obj.name], obj.name, 'income', obj.id+date)}>{getAmount(rows, date, obj.name)}</td>) }
                                { filteredFunds.map(obj => <td key={obj.id}className={transactionId === obj.id+date ? 'trValue selected' : 'trValue'} onClick={onClickValue(rows[date][obj.name], obj.name, 'fund', obj.id+date)}>{getAmount(rows, date, obj.name)}</td>) }
                                { expenseCategories.map(obj => <td key={obj.id} className={transactionId === obj.id+date ? 'trValue selected' : 'trValue'} onClick={onClickValue(rows[date][obj.name], obj.name, 'expense', obj.id+date)}>{getAmount(rows, date, obj.name)}{editCategory === obj.id ? <span> / <BudgetInput value={checkBudget(budgets, date, obj.id, transactions, true)} category={obj.id} date={date}/></span> : checkBudget(budgets, date, obj.id, transactions)}</td>) }
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