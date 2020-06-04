import React from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

const StyledComp = styled.div`
    display: flex;
    border-bottom: 1px solid var(--text-color);

    & > div {
        padding: 5px 10px;
        border-right: 1px solid var(--text-color);
    }

    & > div:hover {
        background-color: #555;
        cursor: pointer;
    }
`;

const Header = () => {
    const dispatch = useDispatch();

    return (
        <StyledComp>
            <div onClick={() => dispatch({type: 'SET_CURRENT_PAGE', payload: 'Home'})}>Home</div>
            <div onClick={() => dispatch({type: 'SET_CURRENT_PAGE', payload: 'Categories'})}>Categories</div>
            <div onClick={() => dispatch({type: 'SET_CURRENT_PAGE', payload: 'Goals'})}>Goals</div>
            <div onClick={() => dispatch({type: 'SET_CURRENT_PAGE', payload: 'Accounts'})}>Accounts</div>
        </StyledComp>
    )
}

export default Header;