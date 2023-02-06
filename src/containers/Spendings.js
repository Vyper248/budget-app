import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { parseISO, compareAsc } from 'date-fns';

import { today, filterDeleted, parseCurrency, parseTransaction } from '../functions';

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

    //Setup table object
    const tableObj = {totals: {}};
    const accountTotals = {};

    //Setup income table object
    const incomeTableObj = {totals: {}};
    const incomeAccountTotals = {};

    const setupTableObj = (obj) => {
        let itemObj = {};
        accounts.forEach(account => itemObj[account.name] = 0);

        incomeTableObj[obj.name] = itemObj;
        incomeTableObj.totals[obj.name] = 0;
        tableObj[obj.name] = itemObj;
        tableObj.totals[obj.name] = 0;
    };

    categories.forEach(setupTableObj);
    funds.forEach(setupTableObj);
    accounts.forEach(account => {
        accountTotals[account.name] = 0;
        incomeAccountTotals[account.name] = 0;
    });
    
    //add transaction data to table object
    transactions.forEach(tr => {
        if (tr.type !== 'spend') return;

        if (compareAsc(parseISO(tr.date), parseISO(fromDate)) === -1) return; //if before fromDate, ignore
        if (compareAsc(parseISO(tr.date), parseISO(toDate)) === 1) return; //if after toDate, ignore

        let category = categories.find(obj => obj.id === tr.category);
        
        let parsed = parseTransaction(tr);
        let key = parsed.category !== undefined ? parsed.category : parsed.fund;

        if (category?.type === 'income') {
            incomeTableObj[key][parsed.account] += parsed.amount;
            incomeTableObj.totals[key] += parsed.amount;
            incomeAccountTotals[parsed.account] += parsed.amount;
        } else {
            tableObj[key][parsed.account] += parsed.amount;
            tableObj.totals[key] += parsed.amount;
            accountTotals[parsed.account] += parsed.amount;
        }
    });

    let totalAmount = Object.values(tableObj.totals).reduce((a,c) => a+c, 0);
    let totalIncomeAmount = Object.values(incomeTableObj.totals).reduce((a,c) => a+c, 0);

    const onChangeFrom = (e) => {
        setFromDate(e.target.value);
    }

    const onChangeTo = (e) => {
        setToDate(e.target.value);
    }

    const getTableRow = (dataObj, key) => {
        let obj = dataObj[key];
        let total = dataObj.totals[key];

        if (total === 0) return null;

        return <tr key={'row-'+key}>
            <td>{key}</td>
            <td>{parseCurrency(total)}</td>
            {
                accounts.map(account => <td key={`data-${key}-${account.name}`}>{parseCurrency(obj[account.name])}</td>)
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
                            { accounts.map(obj => <td key={'account-'+obj.id}>{obj.name}</td>) }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            categories.map(obj => {
                                if (obj.type === 'expense') return null;
                                return getIncomeTableRow(obj.name);
                            })
                        }
                        <tr>
                            <th></th>
                            <th>{parseCurrency(totalIncomeAmount)}</th>
                            {
                                accounts.map(obj => <th key={'totals-'+obj.name}>{parseCurrency(incomeAccountTotals[obj.name])}</th>)
                            }
                        </tr>

                        <tr className='spacer'>
                            <td></td>
                            <td></td>
                            { accounts.map(obj => <td key={'empty-'+obj.id}></td>) }
                        </tr>

                        {
                            categories.map(obj => {
                                if (obj.type === 'income') return null;
                                return getExpenseTableRow(obj.name);
                            })
                        }
                        {
                            funds.map(obj => {
                                return getExpenseTableRow(obj.name);
                            })
                        }
                        <tr>
                            <th></th>
                            <th>{parseCurrency(totalAmount)}</th>
                            {
                                accounts.map(obj => <th key={'totals-'+obj.name}>{parseCurrency(accountTotals[obj.name])}</th>)
                            }
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default Spendings;