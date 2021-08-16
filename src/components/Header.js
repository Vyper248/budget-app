import React from 'react';
import { useMediaQuery } from 'react-responsive'
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { FaHome } from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';

const StyledComp = styled.div`
    display: flex;
    position: fixed;
    top: 0px;
    border-bottom: 1px solid var(--menu-border-color);
    width: 100%;
    background-color: var(--menu-bg-color);
    z-index: 10;

    & > div {
        color: var(--menu-text-color);
        padding: 5px 10px;
        border-right: 1px solid var(--menu-border-color);
        ${props => props.isMobile ? 'flex-grow: 1;' : ''};
        ${props => props.isMobile ? 'padding: 10px' : ''};
    }

    & > div:last-of-type {
        ${props => props.isMobile ? 'border-right: none;' : ''};
    }

    & > div.selected {
        background-color: var(--menu-selected-bg-color);
        color: var(--menu-selected-text-color);
    }

    & > div:hover {
        background-color: var(--menu-selected-bg-color);
        cursor: pointer;
        color: var(--menu-selected-text-color);
    }

    & > div.spacer:hover {
        background-color: transparent;
        cursor: default;
    }

    & > div.spacer {
        flex-grow: 1;
        border: none;
    }

    & > div.right {
        border-right: none;
        border-left: 1px solid var(--menu-border-color);
    }

    & > div > svg {
        position: relative;
        top: 3px;
    }
`;

const HeaderButton = ({page, alignment='', icon=null}) => {
    const dispatch = useDispatch();
    const currentPage = useSelector(state => state.currentPage);
    let className = currentPage === page ? 'selected' : '';
    if (alignment.length > 0) className += ` ${alignment}`;

    return  <div onClick={() => dispatch({type: 'SET_CURRENT_PAGE', payload: page})} className={className}>
                { icon === null ? page : icon }
            </div>;
}

const Header = () => {
    const isMobile = useMediaQuery({ maxWidth: 700 });

    const dispatch = useDispatch();
    const addTransaction = useSelector(state => state.addTransaction);

    const onClickAddTransaction = () => {
        dispatch({type: 'SET_ADD_TRANSACTION', payload: !addTransaction});
    }

    return (
        <StyledComp isMobile={isMobile}>
            <HeaderButton page='Home' icon={isMobile ? <FaHome/> : null}/>
            <HeaderButton page='Categories'/>
            <HeaderButton page='Funds'/>
            <HeaderButton page='Accounts'/>
            { !isMobile ? <HeaderButton page='Tools'/> : null }
            { !isMobile ? <div onClick={onClickAddTransaction}>Add Transaction</div> : null }
            { !isMobile ? <div className="spacer"></div> : null }
            <HeaderButton page='Settings' icon={isMobile ? <MdSettings/> : null} alignment='right'/>
        </StyledComp>
    )
}

export default Header;