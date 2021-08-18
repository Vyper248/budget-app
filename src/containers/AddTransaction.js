import React from 'react';
import { useDispatch } from 'react-redux';

import TransactionForm from '../components/TransactionForm';

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
        <div>
            <strong>Add Transaction</strong>
            <TransactionForm onChange={onClickAdd} obj={{}}/>
        </div>
    );
}

export default AddTransaction;