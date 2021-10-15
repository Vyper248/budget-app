import React from 'react';
import styled from 'styled-components';
import { compareDesc, parseISO } from 'date-fns';

import Table from './Table';
import Transaction from './Transaction';

const StyledComp = styled.div`
    ${props => props.type === 'income' ? 'border-color: green !important' : ''};
    ${props => props.type === 'expense' ? 'border-color: darkorange !important' : ''};
    ${props => props.type === 'fund' ? 'border-color: lightsteelblue !important' : ''};
    box-shadow: 0px 1px 4px gray;
    padding: 0px !important;

    & > div {
        font-weight: bold;
        padding: 5px;
        color: black;
    }

    & > div.income {
        background-color: green;
        color: white;
    }

    & > div.expense {
        background-color: darkorange;
    }

    & > div.fund {
        background-color: lightsteelblue;
    }

    & > span > div {
        margin-left: 5px;
        margin-right: 5px;
    }

    & > span > div:first-child {
        margin-top: 5px;
    }

    & > span > div:last-child {
        margin-bottom: 5px;
    }
`

const TransactionList = ({heading, transactions, type}) => {
    let sortedTransactions = transactions.sort((a,b) => {
        return compareDesc(parseISO(b.date), parseISO(a.date));
    });

    return (
        <StyledComp type={type}>
            <div className={type}>{heading}</div>
            <span>
                {
                    sortedTransactions.map(tr => <Transaction key={tr.id} obj={tr} accountId={tr.account} hover={false} maxDescWidth='350px'/>)
                }
            </span>
        </StyledComp>
    );
}

export default TransactionList;