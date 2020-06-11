import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { useSelector, useDispatch } from 'react-redux';

import LabelledInput from '../components/LabelledInput';
import Button from '../components/Button';

const StyledComp = styled.div`
    position: fixed;
    top: 28px;
    width: 100%;

    & > div {
        border: 1px solid white;
        width: 300px;
        margin: auto;
        padding: 10px;
        background-color: black;
    }
`;

const AddTransaction = () => {
    const dispatch = useDispatch();

    const accounts = useSelector(state => state.accounts);
    const funds = useSelector(state => state.funds);
    const categories = useSelector(state => state.categories);
    let defaultAccount = accounts.length > 0 ? accounts[0].id : undefined;

    const [type, setType] = useState('spend');
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [account, setAccount] = useState(defaultAccount);
    const [fund, setFund] = useState(undefined);
    const [category, setCategory] = useState(undefined);
    const [from, setFrom] = useState(undefined);
    const [to, setTo] = useState(undefined);


    const addTransaction = () => {
        //make sure transaction is valid
        if (amount === 0) return;
        if (date.length === 0) return;
        if (account === undefined) return;
        if (type === 'spend' && fund === undefined && category === undefined) return;
        if (type === 'transfer' && from === undefined && to === undefined) return;

        let transaction;
        if (type === 'spend') {
            transaction = {type, amount, description, date, account, fund, category};
        } else if (type === 'transfer') {
            transaction = {type, amount, date, from, to};
        }        

        dispatch({type: 'ADD_TRANSACTION', payload: transaction});
    }

    const addFundAddition = () => {
        //make sure transaction is valid
        if (amount === 0) return;
        if (date.length === 0) return;
        if (fund === undefined) return;

        let fundAddition = {amount, date, fund};        
        dispatch({type: 'ADD_FUND_ADDITION', payload: fundAddition});
    }

    const onChangeGroup = (e) => {
        let value = e.target.value;
        let [id, name] = value.split(':');
        id = Number(id);
        
        let fund = funds.find(obj => obj.id === id && obj.name === name);
        
        if (fund !== undefined) {
            setFund(id);
            setCategory(undefined);
        } else {
            let category = categories.find(obj => obj.id === id && obj.name === name);
            if (category !== undefined) {
                setCategory(id);
                setFund(undefined);
            }
        }
    }

    let types = [
        {value: 'spend', display: 'Spend/Receive'},
        {value: 'fundAddition', display: 'Add to Fund'},
    ];

    if (accounts.length > 1) types.push({value: 'transfer', display: 'Transfer'});

    if (type === 'fundAddition') {
        return (
            <StyledComp>
                <div>
                    <strong>Add Transaction</strong>
                    <LabelledInput label={'Type'} type='dropdown' value={type} onChange={(e) => setType(e.target.value)} options={types}/>
                    <LabelledInput label={'Amount'} type='number' value={amount} onChange={(e) => setAmount(Number(e.target.value))}/>
                    <LabelledInput label={'Date'} type='date' value={date} onChange={(e) => setDate(e.target.value)}/>
                    <LabelledInput label={'Fund'} type='dropdown' value={fund} onChange={(e) => setFund(Number(e.target.value))} options={funds.map(obj => ({value: obj.id, display: obj.name}))}/>
                    <Button value="Add Transaction" onClick={addFundAddition} width="140px"/>
                </div>
            </StyledComp>
        );
    }

    return (
        <StyledComp>
            <div>
                <strong>Add Transaction</strong>
                <LabelledInput label={'Type'} type='dropdown' value={type} onChange={(e) => setType(e.target.value)} options={types}/>
                <LabelledInput label={'Amount'} type='number' value={amount} onChange={(e) => setAmount(Number(e.target.value))}/>
                { type === 'transfer' ? null : <LabelledInput label={'Description'} value={description} onChange={(e) => setDescription(e.target.value)}/> }
                <LabelledInput label={'Date'} type='date' value={date} onChange={(e) => setDate(e.target.value)}/>
                { type === 'transfer' ? null : <LabelledInput label={'Account'} type='dropdown' value={account} onChange={(e) => setAccount(Number(e.target.value))} options={accounts.map(obj => ({value: obj.id, display: obj.name}))}/> }
                { type === 'transfer' ? <LabelledInput label={'From'} type='dropdown' value={from} onChange={(e) => setFrom(Number(e.target.value))} options={accounts.map(obj => ({value: obj.id, display: obj.name}))}/> : null }
                { type === 'transfer' ? <LabelledInput label={'To'} type='dropdown' value={to} onChange={(e) => setTo(Number(e.target.value))} options={accounts.map(obj => ({value: obj.id, display: obj.name}))}/> : null }
                { type === 'transfer' ? null : <LabelledInput label={'Group'} type='dropdown' value={undefined} onChange={onChangeGroup} groups={[ 
                                                                        {label: 'Funds', options: funds.map(obj => ({value: obj.id+':'+obj.name, display: obj.name}) )} , 
                                                                        {label: 'Categories', options: categories.map(obj => ({value: obj.id+':'+obj.name, display: obj.name}) )}  ]}/> }
                <Button value="Add Transaction" onClick={addTransaction} width="140px"/>
            </div>
        </StyledComp>
    );
}

export default AddTransaction;