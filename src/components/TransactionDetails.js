import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FaTrashAlt } from 'react-icons/fa';
import { formatDate, parseTransaction, parseCurrency } from '../functions';

import Button from './Button';
import IconButton from './IconButton';
import Grid from './Grid';

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

const TransactionDetails = ({obj, onClose, onDelete}) => {
    const dispatch = useDispatch();

    if (obj === null) return null;
    let parsedObj = parseTransaction(obj);

    const remove = () => {     
        if (parsedObj.type === undefined) dispatch({type: 'REMOVE_FUND_ADDITION', payload: parsedObj.id});
        else dispatch({type: 'REMOVE_TRANSACTION', payload: parsedObj.id});
        onClose();
    }

    return (
        <StyledComp>
            <Grid template="50px auto 50px">
                <div style={{textAlign: 'left'}}><IconButton Icon={FaTrashAlt} onClick={remove} color='red' topAdjust='1px' size="1.3em"/></div>
                <strong>Transaction Details</strong>
            </Grid>

            <table>
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

            <br/>

            <Button onClick={onClose} value="Close"/>
        </StyledComp>
    );
}

export default TransactionDetails;