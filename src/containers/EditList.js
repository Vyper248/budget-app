import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FaTrashAlt } from 'react-icons/fa';

import Table from '../components/Table';
import Input from '../components/Input';
import Button from '../components/Button';
import IconButton from '../components/IconButton';

import { modals } from '../modals';
import { capitalize } from '../functions';

const StyledComp = styled.div`
    border: 1px solid white;
    margin: 5px 5px 5px 0px;
    overflow: scroll;
`;

const EditInput = ({label, defaultValue, value, onChange}) => {
    const categories = useSelector(state => state.categories);

    if (label === 'category') return <Input type="dropdown" onChange={onChange} value={value !== undefined ? value : defaultValue} placeholder={label} options={categories.map(obj => ({value: obj.id, display: obj.name}))}/>;
    if (typeof defaultValue === 'number') return <Input type="number" onChange={onChange} value={value !== undefined ? value : defaultValue} placeholder={label}/>;
    if (typeof defaultValue === 'string' && defaultValue === 'date') return <Input type="date" onChange={onChange} value={value !== undefined ? value : defaultValue} placeholder={label}/>;
    if (typeof defaultValue === 'string' && defaultValue.includes(',') > 0) return <Input type="dropdown" onChange={onChange} value={value !== undefined ? value : defaultValue} placeholder={label} options={defaultValue.split(',').map(obj => ({value: obj, display: capitalize(obj)}))}/>;
    if (typeof defaultValue === 'string') return <Input onChange={onChange} value={value !== undefined ? value : defaultValue} placeholder={label} width={label === 'description' ? '300px' : '100px'}/>;
    if (typeof defaultValue === 'boolean') return <Input type="dropdown" onChange={onChange} value={value !== undefined ? value : defaultValue} placeholder={label} options={[{display: 'Yes', value: true}, {display: 'No', value: false}]}/>;
}

const EditList = ({array=[]}) => {
    const dispatch = useDispatch();
    const currentPage = useSelector(state => state.currentPage);

    const modalKey = currentPage.toLowerCase();
    const modalObj = modals[modalKey];
    const modal = modalObj.modal;
    const add = 'ADD'+modalObj.editString;
    const update = 'UPDATE'+modalObj.editString;
    const remove = 'REMOVE'+modalObj.editString; 

    const onChange = (obj, key) => (e) => {
        obj[key] = e.target.value;
        dispatch({type: update, payload: obj});
    }

    const onDelete = (id) => () => {
        dispatch({type: remove, payload: id});
    }

    const onAdd = () => {
        dispatch({type: add, payload: modalObj});
    }

    return (
        <StyledComp>
            <h4>Edit {currentPage}</h4>
            <Table>
                <thead>
                    <tr>
                    {
                        Object.keys(modal).map(key => {
                            return <td>{key}</td>
                        })
                    }
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                {
                    array.map(obj => {
                        return (
                            <tr>
                            {
                                Object.keys(modal).map(key => {
                                    return (
                                        <td><EditInput label={key} defaultValue={modal[key]} value={obj[key]} onChange={onChange(obj, key)}/></td>
                                    );
                                })
                            }
                                <td><IconButton Icon={FaTrashAlt} onClick={onDelete(obj.id)} color='red'/></td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </Table>

            <Button value="Add New" width="150px" onClick={onAdd}/>
        </StyledComp>
    );
}

export default EditList;