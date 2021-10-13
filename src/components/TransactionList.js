import React from 'react';
import styled from 'styled-components';
import { compareDesc, parseISO } from 'date-fns';

import Table from './Table';
import Transaction from './Transaction';

const StyledComp = styled.div`
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
`

const TransactionList = ({heading, transactions, type}) => {
    let sortedTransactions = transactions.sort((a,b) => {
        return compareDesc(parseISO(b.date), parseISO(a.date));
    });

    return (
        <StyledComp>
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