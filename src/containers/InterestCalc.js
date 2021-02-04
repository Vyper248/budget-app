import React from 'react';
import { useSelector } from 'react-redux';

import { getAccountSummary, filterDeleted, parseCurrency } from '../functions';

import Container from '../components/Container';
import Table from '../components/Table';

const InterestCalc = () => {
    const transactions = useSelector(state => filterDeleted(state.transactions));
    const accounts = useSelector(state => filterDeleted(state.accounts));
    const categories = useSelector(state => filterDeleted(state.categories));

    const accountSummary = getAccountSummary(transactions, accounts, categories);
    const { totalYearly, totalMonthly } = addExtras(accountSummary, accounts);
    
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
                            <td>Yearly Interst</td>
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