import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

const StyledComp = styled.div`
    border: 1px solid var(--menu-border-color);
    width: 200px;
    margin: 5px;
    padding: 0px 5px;
    overflow: scroll;
    position: relative;

    & > div {
        border: 1px solid var(--menu-border-color);
        padding: 5px;
        width: 100%;
        margin-bottom: 5px;
        background-color: var(--menu-bg-color);
        color: var(--menu-text-color);
    }

    & > div:hover {
        background-color: var(--menu-selected-bg-color);
        color: var(--menu-selected-text-color);
        cursor: pointer;
    }

    & > div.selected {
        background-color: var(--menu-selected-bg-color);
        color: var(--menu-selected-text-color);
    }

    & > div:last-child {
        position: absolute;
        bottom: 0px;
        left: 5px;
        width: calc(100% - 10px);
    }
`;

const List = ({heading='', array=[], onClickObj, selected}) => {
    const dispatch = useDispatch();
    const editMode = useSelector(state => state.editMode);

    const toggleEditMode = () => {
        dispatch({type: 'SET_EDIT_MODE', payload: !editMode});
    }

    return (
        <StyledComp>
            <h4>{heading}</h4>
            {
                array.map(obj => {
                    if (obj.name.length === 0) return null;
                    return (
                        <div key={'objList-'+obj.id} onClick={onClickObj(obj.id)} className={selected === obj.id && editMode === false ? 'selected': ''}>{obj.name}</div>
                    );
                })
            }
            <div onClick={toggleEditMode} className={editMode ? 'selected' : ''}>Edit {heading}</div>
        </StyledComp>
    );
}

export default List;