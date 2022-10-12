import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import TransactionForm from '../components/TransactionForm';

const StyledComp = styled.div`
    & > div:first-child {
        font-weight: bold;
        padding: 5px;
        margin-top: -9px;
    }
`;

const AddTransaction = ({onAdd=()=>{}}) => {
    const dispatch = useDispatch();

    const onClickAdd = (obj) => {
        if (obj.type === undefined) addFundAddition(obj);
        else addTransaction(obj);
        onAdd();
    }

    const addTransaction = (transaction) => {
        dispatch({type: 'ADD_TRANSACTION', payload: transaction});
    }

    const addFundAddition = (fundAddition) => {
        dispatch({type: 'ADD_FUND_ADDITION', payload: fundAddition});
    }

    return (
        <StyledComp id='addTransactionPopup'>
            <div>Add Transaction</div>
            <TransactionForm onChange={onClickAdd}/>
        </StyledComp>
    );
}

export default AddTransaction;