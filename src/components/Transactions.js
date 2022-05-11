import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { format, parseISO, parse, compareAsc } from 'date-fns';
import { useMediaQuery } from 'react-responsive';

import { getAmount, filterDeleted } from '../functions';

import HeaderDropdown from './HeaderDropdown';
import TotalsDisplay from './TotalsDisplay';
import Modal from './Modal';
import TransactionDetails from './TransactionDetails';
import TransactionGroup from './TransactionGroup';
import Input from './Input';
import Grid from './Grid';

const StyledComp = styled.div`
    border: 1px solid var(--menu-border-color);
    margin: 5px 5px 5px 0px;
    overflow: scroll;
    position: relative;

    @media screen and (max-width: 700px) {
        margin: 0px;
        border: none;
        padding-bottom: 40px;
    }
`;

const Transactions = ({transactions=[], heading='', id, onClickDropdown=()=>{}, objArray=[], filter='', onChangeFilter=()=>{}}) => {
    const isMobile = useMediaQuery({ maxWidth: 700 });

    const categories = useSelector(state => filterDeleted(state.categories));
    const currentPage = useSelector(state => state.currentPage);

    const [details, setDetails] = useState({});
    const [showDetails, setShowDetails] = useState(false);

    let currentObj = objArray.find(obj => obj.id === id);

    //organise by month/year
    let organisedObj = {};
    transactions.forEach(obj => {
        let date = obj.date;
        let formatted = format(parseISO(date), 'MMMM yyyy');
        if (organisedObj[formatted] === undefined) organisedObj[formatted] = [];
        organisedObj[formatted].push(obj);
    });

    //put into an array and sort by date so newest first
    let organisedArr = Object.keys(organisedObj).map(key => {
        let sortedTransactions = organisedObj[key].sort((a,b) => {
            return compareAsc(parseISO(b.date), parseISO(a.date));
        });
        return {month: key, transactions: sortedTransactions};
    }).sort((a,b) => {
        let first = parse(a.month, 'MMMM yyyy', new Date());
        let second = parse(b.month, 'MMMM yyyy', new Date());
        return compareAsc(second, first);
    });

    const onChangePage = (id) => {
        onClickDropdown(Number(id))();
    }

    const onToggleDetails = (obj) => () => {
        setDetails(obj);
        setShowDetails(true);
    }

    const onEditTransaction = (obj) => {
        setDetails(obj);
    }

    const onCloseDetails = () => {
        setShowDetails(false);
    }

    let total = transactions.reduce((t,c) => {
        t += getAmount(c, categories, id, false);
        return t;
    }, 0);        

    let negative = false;
    if (currentObj && currentObj.startingBalance !== undefined) {
        if (currentObj.type === 'expense') {
            total -= parseFloat(currentObj.startingBalance);
            negative = true;
        } else total += parseFloat(currentObj.startingBalance);

        //add opening balance
        organisedArr.push({
            month: 'Opening Balance',
            transactions: [
                {
                    date: currentObj.dateOpened,
                    amount: negative ? -currentObj.startingBalance : currentObj.startingBalance,
                    description: ''
                }
            ],
        });
    }
    
    let categoryType = 'Expense';
    if (currentPage === 'Categories') {
        if (currentObj !== undefined) categoryType = currentObj.type;
    }

    let fundInfo = {};
    if (currentPage === 'Funds') {
        if (currentObj !== undefined) {
            fundInfo = {
                target: currentObj.targetAmount,
                remaining: currentObj.targetAmount - total
            }
        }
    }

    let headerOptions = objArray.map(obj => {
        let hidden = obj.hidden || obj.complete || obj.closed;
        return {display: obj.name, value: obj.id, hidden: hidden};
    });

    const getTotalsDisplay = () => {
        if (currentPage === 'Accounts') return <TotalsDisplay label='Balance' value={total}/>;
        if (currentPage === 'Categories' && categoryType === 'expense') return <TotalsDisplay label="Total Spent" value={-total}/>;
        if (currentPage === 'Categories' && categoryType === 'income') return <TotalsDisplay label="Total Earned" value={total}/>;
        if (currentPage === 'Funds') return <TotalsDisplay value={total} fundObj={fundInfo}/>;
        return null;
    }

    return (
        <StyledComp>
            { isMobile ? null : <h4>{heading}</h4> }
            { isMobile ? <HeaderDropdown value={id} options={headerOptions} onChange={onChangePage} /> : null }
            <Modal visible={showDetails}><TransactionDetails obj={details} onClose={onCloseDetails} onEdit={onEditTransaction}/></Modal>
            <Grid template={isMobile ? '1fr' : '120px 1fr 120px'}>
                <div></div>
                <div>{ getTotalsDisplay() }</div>
                <div style={{display: 'flex', alignItems: 'center'}}><Input value={filter} placeholder='Search' onChange={onChangeFilter} width='100%'/></div>
            </Grid>
            { organisedArr.length === 0 && objArray.length > 0 ? <div style={{margin: '10px'}}>No Transactions to Display</div> : null }
            { organisedArr.map(group => <TransactionGroup key={'transactionGroup-'+group.month+id+group.transactions.length} id={id} group={group} onToggleDetails={onToggleDetails}/>) }
        </StyledComp>
    );
}

export default Transactions;