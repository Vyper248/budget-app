import React, { useState } from 'react';
import styled from 'styled-components';

import Table from './Table';
import Button from './Button';
import EditInput from './EditInput';

import { fromCamelCase, checkIfCanDelete } from '../functions';

const StyledComp = styled.div`
    border: 1px solid var(--menu-border-color);
    display: inline-block;
    margin: 10px;
    border-radius: 5px;
    width: 40%;

    & > div:first-child {
        padding: 10px;
        border-bottom: 1px solid var(--menu-border-color);
        font-weight: bold;
    }

    & > div:last-child {
        display: flex;
    }

    & > div:last-child > div {
        padding: 10px;
        width: 50%;
    }

    & > div:last-child > div:first-child {
        border-right: 1px solid white;
    }

    & > div.popup {
        background-color: rgba(0,0,0,0.5);
        position: absolute;
        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: scale(${props => props.open ? '1.0' : '0.0'});
        transition: 0.3s;
    }

    & > div.popup > div {
        width: 100%;
        padding: 10px;
    }
`;

const MobileEditGroup = ({modal, obj, onChange, onDelete}) => {
    const [open, setOpen] = useState(obj.name.length === 0 ? true : false);
    const [editing, setEditing] = useState(false);

    const onEdit = () => {
        setOpen(true);
        setEditing(true);
    }

    const onCancel = () => {
        onDelete(obj.id)();
    }

    const close = () => {
        if (obj.name.length === 0) return;
        setOpen(false);
        setEditing(false);
    }

    return (
        <StyledComp open={open}>
            <div>{obj.name}</div>
            <div className="popup">
                <div>
                    <Table key={'EditListTable-'+obj.id} style={{marginBottom: '10px', width: '100%', borderTop: '1px solid #555'}} padding='2px'>
                        <tbody>
                        {
                            Object.keys(modal).map(key => {
                                return (
                                    <tr key={'EditListRow-'+key}>
                                        <td style={{backgroundColor: '#222', fontWeight: 'bold'}}>{fromCamelCase(key)}</td>
                                        <td><EditInput label={key} defaultValue={modal[key]} value={obj[key]} onChange={onChange(obj, key)} width='100%'/></td>
                                    </tr>
                                );
                            })
                        }
                        </tbody>
                    </Table>
                    { !editing ? <Button value="Cancel" onClick={onCancel} width="150px" inline={true} style={{marginRight: '5px'}}/> : null }
                    <Button value="Close" onClick={close} width="150px" inline={true}/>
                </div>
            </div>
            <div>
                <div onClick={onEdit}>Edit</div>
                { checkIfCanDelete(obj) ? <div onClick={onDelete(obj.id)}>Delete</div> : <div style={{color: 'grey'}}>Delete</div>}
            </div>
        </StyledComp>
    );
}

export default MobileEditGroup;