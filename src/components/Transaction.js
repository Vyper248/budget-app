import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { FaTrashAlt } from 'react-icons/fa';

import { parseCurrency } from '../functions';

import IconButton from '../components/IconButton';

const StyledComp = styled.div`
    & > table {
        max-width: 300px;
        margin: auto;
    }

    & td:nth-child(1) {
        width: 200px;
        text-align: left;
    }

    & td:nth-child(2) {
        width: 200px;
        text-align: right;
    }

    & td:nth-child(3) {
        width: 50px;
        text-align: right;
    }
`;

const Transaction = ({obj, categories, accountId, showDelete=false}) => {
    const dispatch = useDispatch();

    const remove = () => {     
        if (obj.type === undefined) dispatch({type: 'REMOVE_FUND_ADDITION', payload: obj.id});
        else dispatch({type: 'REMOVE_TRANSACTION', payload: obj.id});
    }

    return (
        <StyledComp>
            <table>
                <tbody>
                    <tr>
                        <td>{obj.date}</td>
                        <td>{getAmount(obj, categories, accountId)}</td>
                        { showDelete ? <td><IconButton Icon={FaTrashAlt} onClick={remove} color='red' topAdjust='1px'/></td> : null }
                    </tr>
                </tbody>
            </table>
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

export default Transaction;