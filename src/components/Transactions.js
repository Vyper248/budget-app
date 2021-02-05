import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { format, parseISO, parse, compareAsc } from 'date-fns';
import { useMediaQuery } from 'react-responsive';

import { getAmount, filterDeleted } from '../functions';

import Transaction from './Transaction';
import HeaderDropdown from './HeaderDropdown';
import TotalsDisplay from './TotalsDisplay';
import Modal from './Modal';
import TransactionDetails from './TransactionDetails';

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

const StyledGroup = styled.div`
    margin: 0px 10px;

    & > div > div {
        border-bottom: 1px solid gray;
        padding: 3px;
    }

    & > div > div:first-of-type {
        margin-top: 0px;
        border-top: none;
    }

    & > div > div:last-of-type {
        border-bottom: none;
    }

    & > div {
        border-bottom: ${props => props.open === false ? '1px solid var(--menu-border-color)' : '1px solid var(--bg-color)'};
        ${props => props.open === false ? 'height: 0px' : `height: ${props.qty*51}px`};
        overflow: hidden;
        transition: 0.3s;
    }

    & > strong {
        display: block;
        width: 100%;
        background-color: var(--menu-bg-color);
        padding: 10px;
        color: var(--menu-text-color);
    }

    & > strong:hover {
        cursor: pointer;
    }

    @media screen and (max-width: 700px) {
        margin: 0px;

        & > div > div {
            padding: 0px;
        }

        & > div {
            border-bottom: ${props => props.open === false ? '1px solid var(--menu-border-color)' : '1px solid var(--bg-color)'};
            ${props => props.open === false ? 'height: 0px' : `height: ${props.qty*45}px`};
            overflow: hidden;
            transition: 0.3s;
        }
    }
`;

const Transactions = ({transactions=[], heading='', id, onClickDropdown=()=>{}, objArray=[]}) => {
    const isMobile = useMediaQuery({ maxWidth: 700 });

    const categories = useSelector(state => filterDeleted(state.categories));
    const currentPage = useSelector(state => state.currentPage);
    const [closed, setClosed] = useState({});

    const [details, setDetails] = useState({});
    const [showDetails, setShowDetails] = useState(false);

    let accountId = currentPage === 'Accounts' ? id : undefined;    
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

    const onToggleGroup = (month) => () => {
        let closedObj = {...closed};
        closedObj[month] === undefined ? closedObj[month] = true : closedObj[month] = !closedObj[month];
        setClosed(closedObj);
    }

    const onToggleDetails = (obj) => () => {
        setDetails(obj);
        setShowDetails(true);
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

    return (
        <StyledComp>
            { isMobile ? null : <h4>{heading}</h4> }
            { isMobile ? <HeaderDropdown value={id} options={objArray.map(obj => ({display: obj.name, value: obj.id}))} onChange={onChangePage} /> : null }
            <Modal visible={showDetails}><TransactionDetails obj={details} onClose={onCloseDetails}/></Modal>
            {/* <EditButton><IconButton Icon={FaEdit} onClick={toggleDelete}/></EditButton> */}
            { currentPage === 'Accounts' ? <TotalsDisplay label="Balance" value={total}/> : null }
            { currentPage === 'Categories' && categoryType === 'expense' ? <TotalsDisplay label="Total Spent" value={-total}/> : null }
            { currentPage === 'Categories' && categoryType === 'income' ? <TotalsDisplay label="Total Earned" value={total}/> : null }
            { currentPage === 'Funds' ? <TotalsDisplay value={total} fundObj={fundInfo}/> : null }
            {
                organisedArr.length === 0 && objArray.length > 0 ? <div style={{margin: '10px'}}>No Transactions to Display</div> : null
            }
            {
                organisedArr.map(group => {
                    return (
                        <StyledGroup key={'transactionGroup-'+group.month+id} open={closed[group.month] !== true} qty={group.transactions.length}>
                            <strong onClick={onToggleGroup(group.month)}>{group.month}</strong>
                            <div>
                                { group.transactions.map(obj => <Transaction key={'transaction-'+obj.id} obj={obj} accountId={accountId} showDelete={false} onClick={onToggleDetails}/>) }
                            </div>
                        </StyledGroup>
                    )

                })
            }
            {
                currentObj && currentObj.startingBalance !== undefined ? (
                    <StyledGroup>
                        <strong>Opening Balance</strong>
                        <Transaction obj={{date: currentObj.dateOpened, amount: negative ? -currentObj.startingBalance : currentObj.startingBalance, description: ''}} accountId={accountId}/>
                    </StyledGroup>
                ) : null
            }
        </StyledComp>
    );
}

export default Transactions;