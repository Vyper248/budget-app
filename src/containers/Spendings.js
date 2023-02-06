import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { today, filterDeleted, parseCurrency, getSpendingsTableObjs } from '../functions';

import Container from '../components/Container';
import Grid from '../components/Grid';
import LabelledInput from '../components/LabelledInput';
import Table from '../components/Table';

const Spendings = ({}) => {
    const categories = useSelector(state => filterDeleted(state.categories));
    const funds = useSelector(state => filterDeleted(state.funds));
    const accounts = useSelector(state => filterDeleted(state.accounts));
    const transactions = useSelector(state => filterDeleted(state.transactions));
    const startDate = useSelector(state => state.general.startDate);

    const [fromDate, setFromDate] = useState(startDate);
    const [toDate, setToDate] = useState(today());
    
    if (accounts.length === 0) return <div>Please add an account to use this feature.</div>;
    if (transactions.length === 0) return <div>There are no transactions to display.</div>;

    const { tableObj, 
            accountTotals, 
            incomeTableObj, 
            incomeAccountTotals, 
            totalAmount, 
            totalIncomeAmount } = getSpendingsTableObjs(accounts, categories, funds, transactions, fromDate, toDate);

    const onChangeFrom = (e) => {
        setFromDate(e.target.value);
    }

    const onChangeTo = (e) => {
        setToDate(e.target.value);
    }

    const checkAccountTotal = (accountName) => {
        if (accountTotals[accountName] === 0 && incomeAccountTotals[accountName] === 0) return false;
        return true;
    }

    const getTableRow = (dataObj, key) => {
        let obj = dataObj[key];
        let total = dataObj.totals[key];

        if (total === 0) return null;

        return <tr key={'row-'+key}>
            <td>{key}</td>
            <td>{parseCurrency(total)}</td>
            {
                accounts.map(account => checkAccountTotal(account.name) ? <td key={`data-${key}-${account.name}`}>{parseCurrency(obj[account.name])}</td> : null)
            }
        </tr>;
    }

    const getExpenseTableRow = (key) => getTableRow(tableObj, key);
    const getIncomeTableRow = (key) => getTableRow(incomeTableObj, key);

    return (
        <div>
            <Container>
                <h4>Income/Spendings</h4>
                <Grid width="600px">
                    <LabelledInput label="From" type="date" value={fromDate} onChange={onChangeFrom} min={startDate} max={toDate}/>
                    <LabelledInput label="To" type="date" value={toDate} onChange={onChangeTo} min={fromDate}/>
                </Grid>
                <Table>
                    <thead>
                        <tr>
                            <td></td>
                            <td>Total</td>
                            { 
                                accounts.map(obj => checkAccountTotal(obj.name) 
                                    ? <td key={'account-'+obj.id}>{obj.name}</td> 
                                    : null) 
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            categories.map(obj => obj.type === 'income' ? getIncomeTableRow(obj.name) : null)
                        }
                        <tr>
                            <th></th>
                            <th>{parseCurrency(totalIncomeAmount)}</th>
                            {
                                accounts.map(obj => checkAccountTotal(obj.name) 
                                    ? <th key={'totals-'+obj.name}>{parseCurrency(incomeAccountTotals[obj.name])}</th> 
                                    : null )
                            }
                        </tr>

                        <tr className='spacer'>
                            <td></td>
                            <td></td>
                            { accounts.map(obj => checkAccountTotal(obj.name) ? <td key={'empty-'+obj.id}></td> : null) }
                        </tr>
                        {
                            categories.map(obj => obj.type === 'expense' ? getExpenseTableRow(obj.name) : null)
                        }
                        {
                            funds.map(obj => getExpenseTableRow(obj.name))
                        }
                        <tr>
                            <th></th>
                            <th>{parseCurrency(totalAmount)}</th>
                            {
                                accounts.map(obj => checkAccountTotal(obj.name) 
                                    ? <th key={'totals-'+obj.name}>{parseCurrency(accountTotals[obj.name])}</th> 
                                    : null)
                            }
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default Spendings;