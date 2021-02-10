import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { parseISO, differenceInMonths } from 'date-fns';

import { getAccountSummary, today, parseCurrency, reverseDate } from '../functions';

import Container from '../components/Container';
import Grid from '../components/Grid';
import LabelledInput from '../components/LabelledInput';
import Table from '../components/Table';

const SavingsGoal = () => {
    const dispatch = useDispatch();
    const targetDate = useSelector(state => state.general.savingsGoalDate);
    const target = useSelector(state => state.general.savingsGoalTarget);
    const transactions = useSelector(state => state.transactions);
    const accounts = useSelector(state => state.accounts);
    const categories = useSelector(state => state.categories);

    const accountSummary = getAccountSummary(transactions, accounts, categories);
    const totalMoney = accountSummary.reduce((a,c) => a+c.total, 0);
    const amountToSave = target - totalMoney;
    const monthsToTarget = differenceInMonths(parseISO(targetDate), new Date());
    const monthlySavings = amountToSave / monthsToTarget;

    const setTargetDate = (e) => dispatch({type: 'SET_SAVINGS_GOAL_DATE', payload: e.target.value});
    const setTarget = (e) => dispatch({type: 'SET_SAVINGS_GOAL_TARGET', payload: e.target.value});

    return (
        <div>
            <Container>
                <h4>Savings Goal</h4>
                <LabelledInput label="Target Date" type="date" value={targetDate} onChange={setTargetDate}/>
                <LabelledInput label="Target" type="number" value={target} onChange={setTarget}/>
                <br/>
                <Table>
                    <thead>
                        <tr>
                            <td>Total Money</td>
                            <td>Months to Target</td>
                            <td>Amount to Save</td>
                            <td>Monthly</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{parseCurrency(totalMoney)}</td>
                            <td>{monthsToTarget}</td>
                            <td>{parseCurrency(amountToSave > 0 ? amountToSave : 0)}</td>
                            <td>{parseCurrency(monthlySavings > 0 ? monthlySavings : 0)}</td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default SavingsGoal;