import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { format, parseISO, parse, compareAsc } from 'date-fns';
import { FaEdit } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';

import { getAmount } from '../functions';

import Transaction from './Transaction';
import IconButton from './IconButton';
import HeaderDropdown from './HeaderDropdown';

const StyledComp = styled.div`
    border: 1px solid white;
    margin: 5px 5px 5px 0px;
    overflow: scroll;
    position: relative;

    @media screen and (max-width: 700px) {
        margin: 0px;
        border: none;
    }
`;

const StyledGroup = styled.div`
    margin: 10px;

    & > div {
        border-bottom: 1px solid gray;
        padding: 3px;
    }

    & > div:first-of-type {
        margin-top: 5px;
        border-top: 1px solid gray;
    }

    @media screen and (max-width: 700px) {
        margin: 0px;

        & > div {
            padding: 0px;
        }

        & > div:first-of-type {
            margin-top: 0px;
            border-top: none;
        }

        & > strong {
            display: block;
            width: 100%;
            background-color: gray;
            padding: 10px;
        }
    }
`;

const EditButton = styled.div`
    position: absolute;
    right: 12px;
    top: 10px;
    font-size: 1.5em;

    @media screen and (max-width: 700px) {
        top: 15px;
    }
`;

const Transactions = ({transactions=[], heading='', id, onClickDropdown=()=>{}, objArray=[]}) => {
    const isMobile = useMediaQuery({ maxWidth: 700 });

    const accounts = useSelector(state => state.accounts);
    const categories = useSelector(state => state.categories);
    const currentPage = useSelector(state => state.currentPage);
    const [showDelete, setShowDelete] = useState(false);

    let accountId = currentPage === 'Accounts' ? id : undefined;    

    let account = null;
    if (accountId !== undefined) account = accounts.find(obj => obj.id === accountId);

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

    const toggleDelete = () => {
        setShowDelete(!showDelete);
    }

    const onChangePage = (id) => {
        onClickDropdown(Number(id))();
    }

    let total = transactions.reduce((t,c) => {
        t += getAmount(c, categories, accountId, false);
        return t;
    }, 0);        

    if (accountId !== undefined) total += account.startingBalance;
    console.log(total);

    return (
        <StyledComp>
            { isMobile ? null : <h4>{heading} - Transactions</h4> }
            { isMobile ? <HeaderDropdown value={id} options={objArray.map(obj => ({display: obj.name, value: obj.id}))} onChange={onChangePage} /> : null }
            <EditButton><IconButton Icon={FaEdit} color='white' onClick={toggleDelete}/></EditButton>
            {
                organisedArr.length === 0 && objArray.length > 0 ? <div style={{margin: '10px'}}>No Transactions to Display</div> : null
            }
            {
                organisedArr.map(group => {
                    return (
                        <StyledGroup key={'transactionGroup-'+group.month}>
                            <strong>{group.month}</strong>
                            { group.transactions.map(obj => <Transaction key={'transaction-'+obj.id} obj={obj} accountId={accountId} showDelete={showDelete}/>) }
                        </StyledGroup>
                    )

                })
            }
            {
                accountId !== undefined ? (
                    <StyledGroup>
                        <strong>Opening Balance</strong>
                        <Transaction obj={{date: account.dateOpened, amount: account.startingBalance}} accountId={accountId}/>
                    </StyledGroup>
                ) : null
            }
        </StyledComp>
    );
}

export default Transactions;