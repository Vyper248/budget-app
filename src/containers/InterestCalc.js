import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { getAccountSummary, filterDeleted, parseCurrency } from '../functions';

import Container from '../components/Container';
import Table from '../components/Table';
import Input from '../components/Input';

const InterestCalc = () => {
    const transactions = useSelector(state => filterDeleted(state.transactions));
    const accounts = useSelector(state => filterDeleted(state.accounts));
    const categories = useSelector(state => filterDeleted(state.categories));

    const [customInterest, setCustomInterest] = useState(0);
    const [customAmount, setCustomAmount] = useState(0);
    const [customCharges, setCustomCharges] = useState(0);
    let yearlyInterest = customAmount * (customInterest/100);
    const monthlyInterest = (yearlyInterest / 12) - customCharges;
    yearlyInterest = monthlyInterest * 12;

    const accountSummary = getAccountSummary(transactions, accounts, categories);
    const { totalYearly, totalMonthly } = addExtras(accountSummary, accounts);

    const onChangeCustomInterest = (e) => {
        setCustomInterest(e.target.value);
    }

    const onChangeCustomAmount = (e) => {
        setCustomAmount(e.target.value);
    }

    const onChangeCustomCharges = (e) => {
        setCustomCharges(e.target.value);
    }
    
    return (
        <div>
            <Container>
                <h4>Interest Calculator</h4>
                <p>This will show you the estimated amount of interest you should be receiving based on the interest rates provided, taking into account any extra charges (such as bank fees). You can change these rates on the Accounts page by using the 'Edit Accounts' button.</p>
                <Table>
                    <thead>
                        <tr>
                            <td>Account</td>
                            <td>Interest Rate</td>
                            <td>Amount</td>
                            <td>Extra Charges</td>
                            <td>Yearly Interest</td>
                            <td>Monthly Interest</td>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        accountSummary.map(account => {
                            let yearlyInterestBase = account.total * (account.interestRate/100);
                            let monthlyInterestBase = yearlyInterestBase / 12;
                            let monthlyInterest = monthlyInterestBase - account.extraCharges;
                            let yearlyInterest = monthlyInterest * 12;
                            return <tr key={'account-'+account.id}>
                                <td>{account.name}</td>
                                <td>{account.interestRate}%</td>
                                <td>{parseCurrency(account.total)}</td>
                                <td>{parseCurrency(account.extraCharges)}</td>
                                <td>{parseCurrency(yearlyInterest)}</td>
                                <td>{parseCurrency(monthlyInterest)}</td>
                            </tr>;
                        })
                    }
                        <tr>
                            <th colSpan='4' style={{textAlign: 'right'}}>Totals</th>
                            <td>{parseCurrency(totalYearly)}</td>
                            <td>{parseCurrency(totalMonthly)}</td>
                        </tr>
                    </tbody>
                </Table>
                <h4>Custom</h4>
                <p>Use this to check how much interest you'll get with different amounts and interest rates etc.</p>
                <Table>
                    <thead>
                        <tr>
                            <td>Interest Rate</td>
                            <td>Amount</td>
                            <td>Extra Charges</td>
                            <td>Yearly Interest</td>
                            <td>Monthly Interest</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="input"><Input type="number" width="120px" value={customInterest} onChange={onChangeCustomInterest}/></td>
                            <td className="input"><Input type="number" width="120px" value={customAmount} onChange={onChangeCustomAmount}/></td>
                            <td className="input"><Input type="number" width="130px" value={customCharges} onChange={onChangeCustomCharges}/></td>
                            <td>{parseCurrency(yearlyInterest)}</td>
                            <td>{parseCurrency(monthlyInterest)}</td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

const addExtras = (accountSummary, accounts) => {
    let totalYearly = 0;
    let totalMonthly = 0;

    accountSummary.forEach(account => {
        let extras = getExtraDetails(account.id, accounts);
        let yearlyInterestBase = account.total * (extras.interestRate/100);
        let monthlyInterestBase = yearlyInterestBase / 12;
        let monthlyInterest = monthlyInterestBase - extras.extraCharges;
        let yearlyInterest = monthlyInterest * 12;
        totalYearly += yearlyInterest;
        totalMonthly += monthlyInterest;

        account.extraCharges = extras.extraCharges;
        account.interestRate = extras.interestRate;
    });

    return {totalYearly, totalMonthly};
}

const getExtraDetails = (id, accounts) => {
    let account = accounts.find(obj => obj.id === id);
    if (account === undefined) return null;
    return {
        interestRate: account.interestRate,
        extraCharges: account.extraCharges
    };
}

export default InterestCalc;