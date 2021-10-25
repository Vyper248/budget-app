import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { formatDate, parseTransaction, parseCurrency } from '../functions';

import Button from './Button';
import IconButton from './IconButton';
import Grid from './Grid';
import TransactionForm from './TransactionForm';

const StyledComp = styled.div`    
    padding: 10px;

    & > table {
        width: 100%;
        border-collapse: collapse;
    }

    & > table td {
        border: 1px solid var(--menu-border-color);
        padding: 5px;
        text-transform: capitalize;
        word-break: break-word;
    }

    & > table tr > td:first-child {
        width: 110px;
    }

    & strong {
        font-size: 1.3em;
    }
`;

const getTableRow = (heading, value) => {
    if (value === undefined) return null;
    if (value.length === 0) return null;

    return <tr><td>{heading}</td><td>{value}</td></tr>
}

const getTable = (parsedObj) => {
    if (parsedObj.type === undefined) parsedObj.type = 'Add to Fund';
    return <table>
                <tbody>
                    { getTableRow('Type', parsedObj.type) }
                    { getTableRow('From', parsedObj.from) }
                    { getTableRow('To', parsedObj.to) }
                    { getTableRow('Category', parsedObj.category) }
                    { getTableRow('Account', parsedObj.account) }
                    { getTableRow('Fund', parsedObj.fund) }
                    { getTableRow('Date', formatDate(parsedObj.date)) }
                    { getTableRow('Description', parsedObj.description) }
                    { getTableRow('Amount', parseCurrency(parsedObj.amount)) }
                </tbody>
            </table>
}

const TransactionDetails = ({obj, onClose, onDelete, onEdit=()=>{}}) => {
    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);

    if (obj === null) return null;
    let parsedObj = parseTransaction(obj);

    const edit = () => {
        setEditMode(!editMode);
    }

    const remove = () => {     
        if (parsedObj.type === undefined) dispatch({type: 'REMOVE_FUND_ADDITION', payload: parsedObj.id});
        else dispatch({type: 'REMOVE_TRANSACTION', payload: parsedObj.id});
        onClose();
    }

    const onChangeTransaction = (newObj) => {
        if (newObj.type === undefined) dispatch({type: 'UPDATE_FUND_ADDITION', payload: newObj});
        else dispatch({type: 'UPDATE_TRANSACTION', payload: newObj});
        onEdit(newObj);
        setEditMode(false);
    }

    const onClickClose = () => {
        setTimeout(() => {
            setEditMode(false);
        }, 400);
        onClose();
    }

    return (
        <StyledComp>
            <Grid template="50px auto 50px">
                <div style={{textAlign: 'left'}}><IconButton Icon={FaTrashAlt} onClick={remove} color='red' topAdjust='1px' size="1.3em"/></div>
                <strong>Transaction Details</strong>
                <div style={{textAlign: 'right'}}><IconButton Icon={FaEdit} onClick={edit} topAdjust='1px' size="1.3em"/></div>
            </Grid>

            { editMode ? <TransactionForm obj={obj} onChange={onChangeTransaction}/> : getTable(parsedObj) }

            <br/>

            <Button onClick={onClickClose} value="Close"/>
        </StyledComp>
    );
}

export default TransactionDetails;