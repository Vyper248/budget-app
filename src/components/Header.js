import React from 'react';
import { useMediaQuery } from 'react-responsive'
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

const StyledComp = styled.div`
    display: flex;
    border-bottom: 1px solid var(--text-color);
    width: 100%;

    & > div {
        padding: 5px 10px;
        border-right: 1px solid var(--text-color);
        ${props => props.isMobile ? 'flex-grow: 1;' : ''};
        ${props => props.isMobile ? 'padding: 10px' : ''};
    }

    & > div:last-of-type {
        ${props => props.isMobile ? 'border-right: none;' : ''};
    }

    & > div.selected {
        background-color: #555;
    }

    & > div:hover {
        background-color: #555;
        cursor: pointer;
    }
`;

const Header = () => {
    const isMobile = useMediaQuery({ maxWidth: 700 });

    const dispatch = useDispatch();
    const addTransaction = useSelector(state => state.addTransaction);
    const currentPage = useSelector(state => state.currentPage);

    return (
        <StyledComp isMobile={isMobile}>
            <div onClick={() => dispatch({type: 'SET_CURRENT_PAGE', payload: 'Home'})} className={currentPage === 'Home' ? 'selected' : ''}>Home</div>
            <div onClick={() => dispatch({type: 'SET_CURRENT_PAGE', payload: 'Categories'})} className={currentPage === 'Categories' ? 'selected' : ''}>Categories</div>
            <div onClick={() => dispatch({type: 'SET_CURRENT_PAGE', payload: 'Funds'})} className={currentPage === 'Funds' ? 'selected' : ''}>Funds</div>
            <div onClick={() => dispatch({type: 'SET_CURRENT_PAGE', payload: 'Accounts'})} className={currentPage === 'Accounts' ? 'selected' : ''}>Accounts</div>
            { !isMobile ? <div onClick={() => dispatch({type: 'SET_ADD_TRANSACTION', payload: !addTransaction})}>Add Transaction</div> : null }
        </StyledComp>
    )
}

export default Header;