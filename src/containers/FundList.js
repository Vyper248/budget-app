import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { parseISO, compareAsc } from 'date-fns';

import { today, getAllDates, getPeriodOfTransaction, filterDeleted, parseCurrency, formatDate } from '../functions';

import Container from '../components/Container';
import Grid from '../components/Grid';
import LabelledInput from '../components/LabelledInput';
import Table from '../components/Table';

const FundList = () => {
    const funds = useSelector(state => filterDeleted(state.funds));
    const transactions = useSelector(state => filterDeleted(state.transactions));
    const startDate = useSelector(state => state.general.startDate);
    const payPeriodType = useSelector(state => state.general.payPeriodType);

    const firstFund = funds.length > 0 ? funds[0].id : 0;
    const [fund, setFund] = useState(firstFund);

    const [fromDate, setFromDate] = useState(startDate);
    const [toDate, setToDate] = useState(today());
    
    if (funds.length === 0) return <div>Please add a fund to use this feature.</div>;
    
    //get an array of dates that apply to this period
    let dates = getAllDates(startDate, payPeriodType);
    let firstPeriod = getPeriodOfTransaction(dates, fromDate);
    let index = dates.indexOf(firstPeriod);
    if (index > 0) dates = dates.slice(index);

    //setup the table object ready for data
    let total = 0;

    //filter transactions and add to total
    let filteredTransactions = transactions.filter(tr => {
        if (tr.type !== "spend") return false;
        if (compareAsc(parseISO(tr.date), parseISO(fromDate)) === -1) return false; //if before fromDate, ignore
        if (compareAsc(parseISO(tr.date), parseISO(toDate)) === 1) return false; //if after toDate, ignore
        if (tr.fund === undefined || tr.fund !== fund) return false; //if not selected category
        total += tr.amount;
        return true;
    });

    //sort to display oldest first
    filteredTransactions.sort((a,b) => compareAsc(parseISO(a.date), parseISO(b.date)));

    const onChangeFund = (e) => {
        setFund(Number(e.target.value));
    }

    const onChangeFrom = (e) => {
        setFromDate(e.target.value);
    }

    const onChangeTo = (e) => {
        setToDate(e.target.value);
    }

    return (
        <div>
            <Container>
                <h4>Fund Breakdown</h4>
                <LabelledInput label="Category" type="dropdown" value={fund} options={funds.map(obj => ({value: obj.id, display: obj.name}))} onChange={onChangeFund}/>
                <Grid width="600px">
                    <LabelledInput label="From" type="date" value={fromDate} onChange={onChangeFrom} min={startDate} max={toDate}/>
                    <LabelledInput label="To" type="date" value={toDate} onChange={onChangeTo} min={fromDate}/>
                </Grid>
                { filteredTransactions.length > 0 ? <Table>
                    <thead>
                        <tr>
                            <td>Date</td>
                            <td>Description</td>
                            <td>Cost</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredTransactions.map(obj => {
                                return <tr key={'fund-transaction-'+obj.id}>
                                    <td>{formatDate(obj.date)}</td>
                                    <td>{obj.description}</td>
                                    <td>{parseCurrency(obj.amount)}</td>
                                </tr>
                            })
                        }
                        <tr>
                            <th colSpan='2' style={{textAlign: 'right'}}>Total</th>
                            <td>{parseCurrency(total)}</td>
                        </tr>
                    </tbody>
                </Table> : <p>No transactions to display.</p> }
            </Container>
        </div>
    );
}

export default FundList;