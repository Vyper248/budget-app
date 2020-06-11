import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
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

const Transactions = ({transactions=[], heading='', accountId}) => {
    const categories = useSelector(state => state.categories);

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
                                                <span>{getAmount(obj, categories, accountId)}</span>
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

//determine whether amount should be positive or negative
const getAmount = (transaction, categories, accountId) => {
    //fund addition, so positive
    if (transaction.type === undefined) return parseCurrency(transaction.amount);

    //transaction for a fund, so negative
    if (transaction.fund !== undefined) return parseCurrency(-transaction.amount);

    if (transaction.category !== undefined) {
        let category = categories.find(obj => obj.id === transaction.category);
        if (category !== undefined) {
            //transaction for expense category, so negative
            if (category.type === 'expense') return parseCurrency(-transaction.amount);

            //transaction for income category, so positive
            if (category.type ===  'income') return parseCurrency(transaction.amount);
        } else {
            //has a category, but can't find it, so return 0
            return parseCurrency(0);
        }
    }    

    if (transaction.from !== undefined && accountId !== undefined) {
        //transfer from this account, so negative
        if (transaction.from === accountId) return parseCurrency(-transaction.amount);

        //transfer to this account, so positive
        if (transaction.to === accountId) return parseCurrency(transaction.amount);
    }
}

export default Transactions;