import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { FaTrashAlt } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import { format } from 'date-fns';

import Table from '../components/Table';
import Button from '../components/Button';
import IconButton from '../components/IconButton';
import HeaderDropdown from '../components/HeaderDropdown';
import EditInput from '../components/EditInput';
import MobileEditGroup from '../components/MobileEditGroup';

import { modals } from '../modals';
import { fromCamelCase, checkIfCanDelete} from '../functions';

const StyledComp = styled.div`
    border: 1px solid white;
    margin: 5px 5px 5px 0px;
    overflow: scroll;

    @media screen and (max-width: 700px) {
        margin: 0px;
        border: none;
    }
`;

const EditList = ({array=[], vertical=false, onClickDropdown=()=>{}, id}) => {
    const isMobile = useMediaQuery({ maxWidth: 700 });

    const dispatch = useDispatch();
    const currentPage = useSelector(state => state.currentPage);

    const modalKey = currentPage.toLowerCase();
    const modalObj = {...modals[modalKey]};
    const modal = {...modalObj.modal};
    const add = 'ADD'+modalObj.editString;
    const update = 'UPDATE'+modalObj.editString;
    const remove = 'REMOVE'+modalObj.editString; 

    const onChange = (obj, key) => (e) => {
        let value = e.target.value;
        if (typeof modal[key] === 'number') value = parseFloat(value);

        obj[key] = value;
        //make sure false and true are boolean not string
        if (obj[key] === 'false') obj[key] = false;
        if (obj[key] === 'true') obj[key] = true;
        dispatch({type: update, payload: obj});
    }

    const onDelete = (id) => () => {
        dispatch({type: remove, payload: id});
    }

    const onAdd = () => {      
        let newObj = {...modal};
        Object.keys(newObj).forEach(key => {
            if (typeof newObj[key] === 'string' && newObj[key].includes(',')) newObj[key] = newObj[key].split(',')[0];
            if (typeof newObj[key] === 'string' && newObj[key] === 'date') newObj[key] = format(new Date(), 'yyyy-MM-dd');
        });  
        dispatch({type: add, payload: newObj});
    }

    const onChangePage = (id) => {
        onClickDropdown(Number(id))();
    }

    if (isMobile) return (
        <StyledComp>
            <HeaderDropdown value={'Edit'} options={array.map(obj => ({display: obj.name, value: obj.id}))} onChange={onChangePage} />
            {
                array.map(obj => {
                    return (
                        <MobileEditGroup key={'MobileEditGroup-'+obj.id} modal={modal} obj={obj} onChange={onChange} onDelete={onDelete}/>
                    );
                })
            }
            <Button value="Add New" width="150px" onClick={onAdd} color='#0F0'/>
        </StyledComp>
    );

    if (true || isMobile) return (
        <StyledComp>
            <h4>Edit {currentPage}</h4>
            {
                array.map(obj => {
                    return (
                        <Table key={'EditListTable-'+obj.id} style={{display: 'inline-block', margin: '10px'}} padding='2px 5px'>
                            <tbody>
                                {
                                    Object.keys(modal).map(key => {
                                        return (
                                            <tr key={'EditListRow-'+key}>
                                                <th>{fromCamelCase(key)}</th>
                                                <td><EditInput label={key} defaultValue={modal[key]} value={obj[key]} onChange={onChange(obj, key)} width='140px'/></td>
                                            </tr>
                                        );
                                    })
                                }
                                <tr>
                                    <td colSpan='2'>
                                    { checkIfCanDelete(obj) 
                                        ? <Button value="Delete" onClick={onDelete(obj.id)} width='50%' color='red'/> 
                                        : <div style={{height: 'var(--input-height)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Being Used</div> }
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    );
                })
            }
            <Button value="Add New" width="150px" onClick={onAdd} color='#0F0'/>
        </StyledComp>
    );

    return (
        <StyledComp>
            <h4>Edit {currentPage}</h4>
            <Table padding='2px'>
                <thead>
                    <tr>
                    {
                        Object.keys(modal).map(key => {
                            return <td key={"EditListHeading-"+key}>{fromCamelCase(key)}</td>
                        })
                    }
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                {
                    array.map((obj, i) => {
                        return (
                            <tr key={"EditListRow-"+i}>
                            {
                                Object.keys(modal).map((key,j) => {
                                    return (
                                        <td key={"EditListData-"+key+i}><EditInput label={key} defaultValue={modal[key]} value={obj[key]} onChange={onChange(obj, key)}/></td>
                                    );
                                })
                            }
                                { checkIfCanDelete(obj) ? <td><IconButton Icon={FaTrashAlt} onClick={onDelete(obj.id)} color='red'/></td> : <td></td> }
                            </tr>
                        );
                    })
                }
                </tbody>
            </Table>

            <Button value="Add New" width="150px" onClick={onAdd} color='#0F0'/>
        </StyledComp>
    );
}

export default EditList;