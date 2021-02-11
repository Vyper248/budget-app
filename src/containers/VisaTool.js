import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAccountSummary, parseCurrency } from '../functions';

import Container from '../components/Container';
import LabelledInput from '../components/LabelledInput';
import Table from '../components/Table';

const VisaTool = () => {
    const dispatch = useDispatch();
    const salary = useSelector(state => state.general.salary);
    const setSalary = (e) => dispatch({type: 'SET_SALARY', payload: e.target.value});

    const transactions = useSelector(state => state.transactions);
    const accounts = useSelector(state => state.accounts);
    const categories = useSelector(state => state.categories);

    const accountSummary = getAccountSummary(transactions, accounts, categories);
    const totalMoney = accountSummary.reduce((a,c) => a+c.total, 0);
    const baseSalary = 18600;
    const savingsMinimum = 16000;
    let savingsNeeded = ((baseSalary - salary) * 2.5) + savingsMinimum;
    if (salary >= baseSalary) savingsNeeded = 0;
    let moneyRequired = savingsNeeded - totalMoney;

    return (
        <div>
            <Container>
                <h4>UK Visa Requirements</h4>
                <p>This tool calculates how much cash savings you need to meet the UK visa requirements, taking into account your current salary. If your salary is above £18,600, then no savings are required.</p>
                <LabelledInput label="Salary" type="number" value={salary} onChange={setSalary}/>
                <Table>
                    <thead>
                        <tr>
                            <td>Savings Required</td>
                            <td>Total Money</td>
                            <td>{moneyRequired > 0 ? 'Still Needed' : 'Spare Money'}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{parseCurrency(savingsNeeded)}</td>
                            <td>{parseCurrency(totalMoney)}</td>
                            <td>{parseCurrency(moneyRequired >= 0 ? moneyRequired : -moneyRequired)}</td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default VisaTool;