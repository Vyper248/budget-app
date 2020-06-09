import React from 'react';
import styled from 'styled-components';
import { format, parseISO, parse, compareAsc } from 'date-fns';
import { parseCurrency } from '../functions';

const StyledComp = styled.div`
    border: 1px solid white;
    margin: 5px 5px 5px 0px;
    overflow: scroll;
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

const StyledTransaction = styled.div`
    & > div {
        display: flex;
        max-width: 300px;
        margin: auto;
        justify-content: space-between;
    }
`;

const Transactions = ({transactions=[], heading=''}) => {
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

    return (
        <StyledComp>
            <h4>{heading} - Transactions</h4>
            {
                organisedArr.map(group => {
                    return (
                        <StyledGroup>
                            <strong>{group.month}</strong>
                            {
                                group.transactions.map(obj => {
                                    return (
                                        <StyledTransaction>
                                            <div>
                                                <span>{obj.date}</span> 
                                                <span>{parseCurrency(obj.amount)}</span>
                                            </div>
                                        </StyledTransaction>
                                    );
                                })
                            }
                        </StyledGroup>
                    )

                })
            }
        </StyledComp>
    );
}

export default Transactions;