import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { format, parseISO, parse, compareAsc } from 'date-fns';
import { FaEdit } from 'react-icons/fa';

import Transaction from './Transaction';
import IconButton from './IconButton';

const StyledComp = styled.div`
    border: 1px solid white;
    margin: 5px 5px 5px 0px;
    overflow: scroll;
    position: relative;
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
`;

const EditButton = styled.div`
    position: absolute;
    right: 12px;
    top: 10px;
    font-size: 1.5em;
`;

const Transactions = ({transactions=[], heading='', accountId}) => {
    const categories = useSelector(state => state.categories);
    const [showDelete, setShowDelete] = useState(false);

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

    return (
        <StyledComp>
            <h4>{heading} - Transactions</h4>
            <EditButton><IconButton Icon={FaEdit} color='white' onClick={toggleDelete}/></EditButton>
            {
                organisedArr.map(group => {
                    return (
                        <StyledGroup>
                            <strong>{group.month}</strong>
                            { group.transactions.map(obj => <Transaction obj={obj} categories={categories} accountId={accountId} showDelete={showDelete}/>) }
                        </StyledGroup>
                    )

                })
            }
        </StyledComp>
    );
}

export default Transactions;