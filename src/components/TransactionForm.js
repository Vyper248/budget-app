import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { filterDeleted } from '../functions';

import LabelledInput from './LabelledInput';
import Button from './Button';

const StyledComp = styled.div`

`

const TransactionForm = ({onChange, obj=undefined, buttonLabel='Save'}) => {
    const accounts = useSelector(state => filterDeleted(state.accounts));
    const funds = useSelector(state => filterDeleted(state.funds));
    const categories = useSelector(state => filterDeleted(state.categories));
    const selectedAccount = useSelector(state => state.selectedAccount);
    const currentPage = useSelector(state => state.currentPage);

    let defaultAccountObj = accounts.find(obj => obj.defaultAccount === true);
    let defaultAccount = defaultAccountObj !== undefined ? defaultAccountObj.id : accounts.length > 0 ? accounts[0].id : undefined;

    if (currentPage === 'Accounts') {
        defaultAccount = selectedAccount;
        console.log(defaultAccount);
    }

    const [id, setId] = useState(0);
    const [type, setType] = useState('spend');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [account, setAccount] = useState(defaultAccount);
    const [fund, setFund] = useState(undefined);
    const [category, setCategory] = useState(undefined);
    const [from, setFrom] = useState(undefined);
    const [to, setTo] = useState(undefined);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        reset();
    }, [obj]);

    const reset = () => {
        if (obj === undefined) obj = {};
        let type = obj.type || 'spend';
        if (obj.amount !== undefined && obj.type === undefined) type = 'fundAddition';
        if (obj.amount !== undefined) setEditMode(true);
        setId(obj.id || 0);
        setType(type);
        setAmount(obj.amount || '');
        setDescription(obj.description || '');
        setDate(obj.date || format(new Date(), 'yyyy-MM-dd'));
        setAccount(obj.account || defaultAccount);
        setFund(obj.fund || undefined);
        setCategory(obj.category || undefined);
        setFrom(obj.from || undefined);
        setTo(obj.to || undefined);
    }

    const finishTransaction = () => {
        //make sure transaction is valid
        if (amount === 0 || isNaN(amount)) return;
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

        if (id !== 0) transaction.id = id;

        onChange(transaction);
    }

    const finishFundAddition = () => {
        //make sure transaction is valid
        if (amount === 0 || isNaN(amount)) return;
        if (date.length === 0) return;
        if (fund === undefined) return;

        let fundAddition = {amount, date, fund};

        if (id !== 0) fundAddition.id = id;

        onChange(fundAddition);
    }

    const onChangeGroup = (e) => {
        let value = e.target.value;
        let id = Number(value);
        
        let fund = funds.find(obj => obj.id === id);
        
        if (fund !== undefined) {
            setFund(id);
            setCategory(undefined);
        } else {
            let category = categories.find(obj => obj.id === id);
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

    let groupValue = category;
    if (category === undefined) groupValue = fund;

    if (type === 'fundAddition') {
        return (
            <StyledComp>
                { editMode ? null : <LabelledInput label={'Type'} type='dropdown' value={type} onChange={(e) => setType(e.target.value)} options={types}/> }
                <LabelledInput label={'Amount'} type='number' value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))}/>
                <LabelledInput label={'Date'} type='date' value={date} onChange={(e) => setDate(e.target.value)}/>
                <LabelledInput label={'Fund'} type='dropdown' value={fund} onChange={(e) => setFund(Number(e.target.value))} options={funds.map(obj => ({value: obj.id, display: obj.name}))}/>
                <Button value={buttonLabel} onClick={finishFundAddition} width="140px"/>
            </StyledComp>
        );
    }

    return (
        <StyledComp>
            { editMode ? null : <LabelledInput label={'Type'} type='dropdown' value={type} onChange={(e) => setType(e.target.value)} options={types}/> }
            <LabelledInput label={'Amount'} type='number' value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))}/>
            { type === 'transfer' ? null : <LabelledInput label={'Description'} value={description} onChange={(e) => setDescription(e.target.value)}/> }
            <LabelledInput label={'Date'} type='date' value={date} onChange={(e) => setDate(e.target.value)}/>
            { type === 'transfer' ? null : <LabelledInput label={'Account'} type='dropdown' value={account} onChange={(e) => setAccount(Number(e.target.value))} options={accounts.map(obj => ({value: obj.id, display: obj.name}))}/> }
            { type === 'transfer' ? <LabelledInput label={'From'} type='dropdown' value={from} onChange={(e) => setFrom(Number(e.target.value))} options={accounts.map(obj => ({value: obj.id, display: obj.name}))}/> : null }
            { type === 'transfer' ? <LabelledInput label={'To'} type='dropdown' value={to} onChange={(e) => setTo(Number(e.target.value))} options={accounts.map(obj => ({value: obj.id, display: obj.name}))}/> : null }
            { type === 'transfer' ? null : <LabelledInput label={'Group'} type='dropdown' value={groupValue} onChange={onChangeGroup} groups={[ 
                                                                    {label: 'Funds', options: funds.map(obj => ({value: obj.id, display: obj.name}) )} , 
                                                                    {label: 'Categories', options: categories.map(obj => ({value: obj.id, display: obj.name}) )}  ]}/> }
            <Button value={buttonLabel} onClick={finishTransaction} width="140px"/>
        </StyledComp>
    );
}

export default TransactionForm;