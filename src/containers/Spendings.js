import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { parseISO, compareAsc } from 'date-fns';

import { today, filterDeleted, parseCurrency, parseTransaction } from '../functions';

import Container from '../components/Container';
import Grid from '../components/Grid';
import LabelledInput from '../components/LabelledInput';
import Table from '../components/Table';

const Spendings = () => {
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

    const setupTableObj = (obj) => {
        if (obj.type === 'income') return;
        let itemObj = {};
        accounts.forEach(account => itemObj[account.name] = 0);
        tableObj[obj.name] = itemObj;
        tableObj.totals[obj.name] = 0;
    };

    categories.forEach(setupTableObj);
    funds.forEach(setupTableObj);
    accounts.forEach(account => accountTotals[account.name] = 0);
    
    //add transaction data to table object
    transactions.forEach(tr => {
        if (tr.type !== 'spend') return;
        if (compareAsc(parseISO(tr.date), parseISO(fromDate)) === -1) return; //if before fromDate, ignore
        if (compareAsc(parseISO(tr.date), parseISO(toDate)) === 1) return; //if after toDate, ignore

        let category = categories.find(obj => obj.id === tr.category);
        if (category !== undefined && category.type === 'income') return; //ignore income categories

        let parsed = parseTransaction(tr);
        let key = parsed.category !== undefined ? parsed.category : parsed.fund;

        tableObj[key][parsed.account] += parsed.amount;
        tableObj.totals[key] += parsed.amount;
        accountTotals[parsed.account] += parsed.amount;
    });

    let totalAmount = Object.values(tableObj.totals).reduce((a,c) => a+c, 0);

    const onChangeFrom = (e) => {
        setFromDate(e.target.value);
    }

    const onChangeTo = (e) => {
        setToDate(e.target.value);
    }

    const getTableRow = (key) => {
        let obj = tableObj[key];
        if (tableObj.totals[key] === 0) return null;

        return <tr key={'row-'+key}>
            <td>{key}</td>
            <td>{parseCurrency(tableObj.totals[key])}</td>
            {
                accounts.map(account => <td key={`data-${key}-${account.name}`}>{parseCurrency(obj[account.name])}</td>)
            }
        </tr>;
    }

    return (
        <div>
            <Container>
                <h4>Spendings</h4>
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
                                if (obj.type === 'income') return null;
                                return getTableRow(obj.name);
                            })
                        }
                        {
                            funds.map(obj => {
                                return getTableRow(obj.name);
                            })
                        }
                        <tr>
                            <th>Totals</th>
                            <td>{parseCurrency(totalAmount)}</td>
                            {
                                accounts.map(obj => <td key={'totals-'+obj.name}>{parseCurrency(accountTotals[obj.name])}</td>)
                            }
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default Spendings;