import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { parseISO, compareAsc } from 'date-fns';

import { today, getAllDates, getLatestDates, getPeriodOfTransaction, filterDeleted, parseCurrency, reverseDate } from '../functions';

import Container from '../components/Container';
import Grid from '../components/Grid';
import LabelledInput from '../components/LabelledInput';
import Table from '../components/Table';

const Breakdown = () => {
    const categories = useSelector(state => filterDeleted(state.categories));
    const accounts = useSelector(state => filterDeleted(state.accounts));
    const transactions = useSelector(state => filterDeleted(state.transactions));
    const startDate = useSelector(state => state.general.startDate);
    const payPeriodType = useSelector(state => state.general.payPeriodType);
    const periodsToDisplay = useSelector(state => state.general.periodsToDisplay);

    const firstCategory = categories.length > 0 ? categories[0].id : 0;
    const [category, setCategory] = useState(firstCategory);

    let latestDates = getLatestDates(startDate, payPeriodType, periodsToDisplay);
    const [fromDate, setFromDate] = useState(latestDates[0]);
    const [toDate, setToDate] = useState(today());
    
    if (categories.length === 0) return <div>Please add a category to use this feature.</div>;
    
    //get an array of dates that apply to this period
    let dates = getAllDates(startDate, payPeriodType);
    let firstPeriod = getPeriodOfTransaction(dates, fromDate);
    let index = dates.indexOf(firstPeriod);
    if (index > 0) dates = dates.slice(index);

    //setup the table object ready for data
    let tableObj = {totals: {}};
    dates.forEach(date => {
        let accountObj = {};
        accounts.forEach(account => {
            accountObj[account.id] = 0;
            tableObj.totals[account.id] = 0;
        });
        tableObj[date] = accountObj;
    });

    //add data from transactions
    transactions.forEach(tr => {
        if (tr.type !== "spend") return;
        if (compareAsc(parseISO(tr.date), parseISO(fromDate)) === -1) return; //if before fromDate, ignore
        if (compareAsc(parseISO(tr.date), parseISO(toDate)) === 1) return; //if after toDate, ignore
        if (tr.category === undefined || tr.category !== category) return; //if not selected category

        let period = getPeriodOfTransaction(dates, tr.date);
        tableObj[period][tr.account] += tr.amount;
        tableObj.totals[tr.account] += tr.amount;
    });

    let totalAmount = Object.values(tableObj.totals).reduce((a,c) => a+c, 0);

    const onChangeCategory = (e) => {
        setCategory(Number(e.target.value));
    }

    const onChangeFrom = (e) => {
        setFromDate(e.target.value);
    }

    const onChangeTo = (e) => {
        setToDate(e.target.value);
    }

    const getTableRow = (date) => {
        let dateObj = tableObj[date];
        let total = Object.values(dateObj).reduce((a,c) => a+c, 0);
        return <tr key={'table-row-date-'+date}>
            <td style={{minWidth: '125px'}}>{reverseDate(date)}</td>
            <td>{parseCurrency(total)}</td>
            {
                accounts.map(account => {
                    if (tableObj.totals[account.id] === 0) return null;
                    return <td key={'table-row-data-'+account.id}>{parseCurrency(dateObj[account.id])}</td>
                })
            }
        </tr>;
    }

    return (
        <div>
            <Container>
                <h4>Breakdown</h4>
                <LabelledInput label="Category" type="dropdown" value={category} options={categories.map(obj => ({value: obj.id, display: obj.name}))} onChange={onChangeCategory}/>
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
                                accounts.map(obj => {
                                    if (tableObj.totals[obj.id] === 0) return null;
                                    return <td key={'table-head-'+obj.id}>{obj.name}</td>
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        { 
                            dates.map(date => getTableRow(date)) 
                        }
                        <tr>
                            <th>Totals</th>
                            <td>{parseCurrency(totalAmount)}</td>
                            {
                                accounts.map(account => {
                                    if (tableObj.totals[account.id] === 0) return null;
                                    return <td key={'table-totals-'+account.id}>{parseCurrency(tableObj.totals[account.id])}</td>
                                })
                            }
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default Breakdown;