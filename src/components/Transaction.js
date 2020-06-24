import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrashAlt } from 'react-icons/fa';

import { parseCurrency, getAmount } from '../functions';

import IconButton from '../components/IconButton';

const StyledComp = styled.div`
    & > table {
        max-width: 650px;
        margin: auto;
    }

    & td {
        ${'' /* border: 1px solid white; */}
    }

    & td:nth-child(1) {
        width: 110px;
        text-align: left;
    }

    & td:nth-child(2) {
        width: 200px;
        text-align: center;
    }

    & td:nth-child(3) {
        width: 100px;
        text-align: right;
    }

    & td:nth-child(4) {
        width: 50px;
        text-align: right;
    }
`;

const Transaction = ({obj, accountId, showDelete=false}) => {
    const dispatch = useDispatch();
    const categories = useSelector(state => state.categories);
    const funds = useSelector(state => state.funds);
    const accounts = useSelector(state => state.accounts);

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
                        <td style={{width: accountId !== undefined ? '200px' : '100px'}}>{getType(obj, accountId, categories, funds, accounts)}</td>
                        <td>{getAmount(obj, categories, accountId)}</td>
                        { showDelete ? <td><IconButton Icon={FaTrashAlt} onClick={remove} color='red' topAdjust='1px'/></td> : null }
                    </tr>
                </tbody>
            </table>
        </StyledComp>
    );
}

const getType = (transaction, accountId, categories, funds, accounts) => {
    if (accountId === undefined) return '';

    //get category name
    if (transaction.category !== undefined) {
        let category = categories.find(obj => obj.id === transaction.category);
        if (category !== undefined) return category.name;
    }

    //get fund name
    if (transaction.fund !== undefined) {
        let fund = funds.find(obj => obj.id === transaction.fund);
        if (fund !== undefined) return `${fund.name} Fund`;
    }

    //get transfer details
    if (transaction.from !== undefined) {
        if (transaction.from === accountId) {
            let account = accounts.find(obj => obj.id === transaction.to);
            if (account !== undefined) return `Transfered to ${account.name}`;
        } else {
            let account = accounts.find(obj => obj.id === transaction.from);
            if (account !== undefined) return `Transfered from ${account.name}`;
        }
    }

    return '';
}

export default Transaction;