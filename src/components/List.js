import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

const StyledButton = styled.div`
    border: 1px solid var(--menu-border-color);
    padding: 5px;
    width: 100%;
    margin-bottom: 5px;
    background-color: var(--menu-bg-color);
    color: var(--menu-text-color);

    &:hover {
        background-color: var(--menu-selected-bg-color);
        color: var(--menu-selected-text-color);
        cursor: pointer;
    }

    &.selected {
        background-color: var(--menu-selected-bg-color);
        color: var(--menu-selected-text-color);
    }

    &.hidden {
        background-color: #999;
        color: white;
    }

    &.hidden.selected {
        background-color: #777;
        color: white;
    }

    &.hidden:hover {
        background-color: #777;
        color: white;
    }
`;

const StyledComp = styled.div`
    border: 1px solid var(--menu-border-color);
    width: 200px;
    min-width: 200px;
    margin: 5px;
    padding: 0px 5px;
    overflow: scroll;
    position: relative;

    & > div:first-of-type {
        height: calc(100% - 102px);
        overflow: scroll;
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

    const activeArray = array.filter(obj => !obj.complete && !obj.hidden && !obj.closed);
    const hiddenArray = array.filter(obj => obj.complete || obj.hidden || obj.closed);

    return (
        <StyledComp>
            <h4>{heading}</h4>
            <div>
                {
                    activeArray.map(obj => {
                        if (obj.name.length === 0) return null;
                        return (
                            <StyledButton key={'objList-'+obj.id} onClick={onClickObj(obj.id)} className={selected === obj.id && editMode === false ? 'selected': ''}>{obj.name}</StyledButton>
                        );
                    })
                }
                {   hiddenArray.length > 0 ? <hr/> : null   }
                {
                    hiddenArray.map(obj => {
                        if (obj.name.length === 0) return null;
                        return (
                            <StyledButton key={'objList-'+obj.id} onClick={onClickObj(obj.id)} className={selected === obj.id && editMode === false ? 'selected hidden': 'hidden'}>{obj.name}</StyledButton>
                        );
                    })
                }
            </div>
            <StyledButton onClick={toggleEditMode} className={editMode ? 'selected' : ''}>Edit {heading}</StyledButton>
        </StyledComp>
    );
}

export default List;