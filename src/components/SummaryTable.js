import React, { useState } from "react";
import { FaPiggyBank } from "react-icons/fa";
import { MdUnfoldMore, MdUnfoldLess } from "react-icons/md";
import { useSelector } from 'react-redux';
import { format } from "date-fns";

import { reverseDate, parseCurrency } from "../functions";

import Table from "./Table";

const SummaryTable = ({dates, allDates, incomeCategories, filteredFunds, expenseCategories, summaryTotals, rows, onClickValue, checkFundTarget, transactionId, getAmount, showMorePeriods, showLessPeriods}) => {
    const reverseSummaryTable = useSelector(state => state.general.reverseSummaryTable);
    const displayMonths = useSelector(state => state.general.displayMonths);
    const periodsToDisplay = useSelector(state => state.general.periodsToDisplay);
    const displayIncomeTotal = useSelector(state => state.general.displayIncomeTotal);
    const displayExpenseTotal = useSelector(state => state.general.displayExpenseTotal);

    const showLessBtn = dates.length > periodsToDisplay;
    const showMoreBtn = dates.length < allDates.length;

    const getTD = (obj, date, type) => {
        let amount = getAmount(rows, date, obj.name);
        let tdClassName = transactionId === obj.id+date ? 'trValue selected' : 'trValue';
        //only give class name if it's a cell user can click on
        if (amount === '-') tdClassName = '';
        return  <td key={obj.id+date} className={tdClassName} onClick={onClickValue(rows[date][obj.name], obj.name, type, obj.id+date)}>
                    { amount }
                </td>
    }

    const getValueRow = (arr, type) => {
        return arr.map(obj => {
            return  <tr key={obj.id} className='summary'>
                        <td className={type} style={{minWidth: '120px'}}>{obj.name}</td>
                        { dates.map(date => getTD(obj, date, type)) }
                        { 
                            type === 'fund' 
                                ? <td className='highlighted'>{parseCurrency(summaryTotals[obj.name].remaining)}{checkFundTarget(summaryTotals[obj.name])}</td> 
                                : <td className='highlighted'>{parseCurrency(summaryTotals[obj.name])}</td>
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
            <div style={{padding: '20px', width: 'fit-content'}}>
                <Table>
                    <thead>
                        <tr>
                            <td className='date'>
                                <div className={`lessPeriodIcon reversed ${!showLessBtn ? 'hidden' : ''}`} onClick={showLessPeriods}><MdUnfoldLess/></div> 
                                Date 
                                <div className={`morePeriodIcon reversed ${!showMoreBtn ? 'hidden' : ''}`} onClick={showMorePeriods}><MdUnfoldMore/></div>
                            </td>
                            { dates.map(date => <td key={'date-'+date} style={{minWidth: minWidth}}>{formatDate(date)}</td>) }
                            <td>Total</td>
                        </tr>    
                    </thead>  
                    <tbody>
                        { getValueRow(incomeCategories, 'income') }
                        { displayIncomeTotal 
                            ? <tr className='summary'>
                                <td className='income bold'>Total Income</td>
                                {
                                    dates.map(date => <td className='highlighted'>{parseCurrency(rows[date].incomeTotal)}</td>)
                                }
                                <td className='highlighted'>{parseCurrency(summaryTotals.totalIncome)}</td>
                            </tr> 
                            : null }
                        { getValueRow(filteredFunds, 'fund') }
                        { getValueRow(expenseCategories, 'expense') }
                        { displayExpenseTotal 
                            ? <tr className='summary'>
                                <td className='expense bold'>Total Expenses</td>
                                {
                                    dates.map(date => <td className='highlighted'>{parseCurrency(rows[date].expenseTotal)}</td>)
                                }
                                <td className='highlighted'>{parseCurrency(summaryTotals.totalExpenses)}</td>
                            </tr> 
                            : null }
                        <tr>
                            <td className="remaining bold">Remaining</td>
                            { dates.map(date => <td key={'remaining-'+date}>{ parseCurrency(rows[date].remaining) }</td>) }
                            <td className='highlighted'>{parseCurrency(summaryTotals.remaining)}</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        );
    }

    const getValue = (arr, date, type) => {
        return arr.map(obj => getTD(obj, date, type));
    }

    return (
        <div style={{padding: '20px', overflow: 'scroll'}}>
            <Table>
                <thead>
                    <tr>
                        <td className='date'>
                            <div className={`lessPeriodIcon ${!showLessBtn ? 'hidden' : ''}`} onClick={showLessPeriods}><MdUnfoldLess/></div> 
                            Date 
                            <div className={`morePeriodIcon ${!showMoreBtn ? 'hidden' : ''}`} onClick={showMorePeriods}><MdUnfoldMore/></div>
                        </td>
                        { incomeCategories.map(obj => <td key={'heading-'+obj.id} className="income">{obj.name}</td>) }
                        { displayIncomeTotal ? <td className='income bold'>Total Income</td> : null }
                        { filteredFunds.map(obj => <td key={'heading-'+obj.id} className="fund">{obj.name}</td>) }
                        { expenseCategories.map(obj => <td key={'heading-'+obj.id} className="expense">{obj.name}</td>) }
                        { displayExpenseTotal ? <td className='expense bold'>Total Expenses</td> : null }
                        <td className="remaining bold">Remaining</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        dates.map(date => {
                            return (
                                <tr className='summary' key={'summaryDate-'+date}>
                                    <td>{formatDate(date)}</td>
                                    { getValue(incomeCategories, date, 'income') }
                                    { displayIncomeTotal ? <td className='highlighted'>{parseCurrency(rows[date].incomeTotal)}</td> : null }
                                    { getValue(filteredFunds, date, 'fund') }
                                    { getValue(expenseCategories, date, 'expense') }
                                    { displayExpenseTotal ? <td className='highlighted'>{parseCurrency(rows[date].expenseTotal)}</td> : null }
                                    <td>{ parseCurrency(rows[date].remaining) }</td>
                                </tr>
                            )
                        })
                    }
                    <tr>
                        <td className='highlighted'>Total</td>
                        { incomeCategories.map(obj => <td className='highlighted' key={'totalsRow-'+obj.id}>{parseCurrency(summaryTotals[obj.name])}</td>) }
                        { displayIncomeTotal ? <td className='highlighted'>{parseCurrency(summaryTotals.totalIncome)}</td> : null }
                        { filteredFunds.map(obj => <td className='highlighted' key={'fundHeading-'+obj.id}>{parseCurrency(summaryTotals[obj.name].remaining)}{checkFundTarget(summaryTotals[obj.name])}</td>) }
                        { expenseCategories.map(obj => <td className='highlighted' key={'totalsRow-'+obj.id}>{parseCurrency(summaryTotals[obj.name])}</td>) }
                        { displayExpenseTotal ? <td className='highlighted'>{parseCurrency(summaryTotals.totalExpenses)}</td> : null }
                        <td className='highlighted'>{parseCurrency(summaryTotals.remaining)}</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}

export default SummaryTable;