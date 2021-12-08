import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import Transaction from './Transaction';

const StyledComp = styled.div`
    margin: 0px 10px;

    & > div > div > div {
        border-bottom: 1px solid gray;
        padding: 3px;
    }

    & > div > div > div:first-of-type {
        margin-top: 0px;
        border-top: none;
    }

    & > div > div > div:last-of-type {
        border-bottom: none;
    }

    & > div {
        margin: 0px;
        padding: 0px;
        height: ${props => props.open ? props.height+'px' : '0px'};
        ${props => props.open && props.height === 0 ? 'height: auto;' : ''}
        border-bottom: ${props => props.open === false ? '1px solid var(--menu-border-color)' : '1px solid var(--bg-color)'};
        overflow: hidden;
        transition: 0.3s;
    }

    & > strong {
        display: block;
        width: 100%;
        background-color: var(--menu-bg-color);
        padding: 10px;
        color: var(--menu-text-color);
    }

    & > strong:hover {
        cursor: pointer;
    }

    @media screen and (max-width: 700px) {
        margin: 0px;

        & > div > div > div {
            padding: 0px;
        }

        & > div {
            border-bottom: ${props => props.open === false ? '1px solid var(--menu-border-color)' : '1px solid var(--bg-color)'};
            height: ${props => props.open ? props.height+'px' : '0px'};
            overflow: hidden;
            transition: 0.3s;
        }
    }
`

const TransactionGroup = ({id, group, onToggleDetails}) => {
    const [isOpen, setOpen] = useState(true);
    const [height, setHeight] = useState(0);
    const ref = useRef(null);

    const currentPage = useSelector(state => state.currentPage);
    let accountId = currentPage === 'Accounts' ? id : undefined; 

    useEffect(() => {
        if (ref.current) {
            let rect = ref.current.getBoundingClientRect();
            let height = rect.height;
            setHeight(height);
        }
    }, [ref]);

    const getHeight = () => {
        if (ref.current) {
            let rect = ref.current.getBoundingClientRect();
            let height = rect.height;
            return height;
        }
        return 100;
    }

    const onClick = () => {
        let height = getHeight();
        setHeight(height);
        setOpen(!isOpen);
    }

    return (
        <StyledComp height={height} open={isOpen} qty={group.transactions.length}>
            <strong onClick={onClick}>{group.month}</strong>
            <div>
                <div ref={ref}>
                    { group.transactions.map(obj => <Transaction key={'transaction-'+obj.id} obj={obj} accountId={accountId} showDelete={false} onClick={onToggleDetails}/>) }
                </div>
            </div>
        </StyledComp>
    );
}

export default TransactionGroup;