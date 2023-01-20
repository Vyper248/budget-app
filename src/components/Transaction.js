import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { getAmount, filterDeleted, formatDate, parseCurrency } from '../functions';

const StyledComp = styled.div`
    & > table {
        width: 100%;
        max-width: 700px;
        margin: auto;
    }

    & td {
        ${'' /* border: 1px solid white; */}
        height: 39px;
    }

    & td:nth-child(1) {
        text-align: left;
    }

    & td:nth-child(2) {
        width: 100px;
        text-align: right;
    }

    & td:nth-child(3) {
        width: 100px;
        text-align: right;
        color: var(--light-text-color);
    }

    & div.description {
        max-width: ${props => props.maxDescWidth};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    & td span.date {
        font-size: 0.8em;
        color: var(--light-text-color);
    }

    &:hover {
        ${props => props.hover ? 'cursor: pointer;' : ''};
        ${props => props.hover ? 'background-color: var(--table-heading-bg-color);' : ''};
    }

    @media screen and (max-width: 700px) {        
        & > table {
            width: 100%;
        }

        & div.description {
            max-width: 250px;
        }

        & td {
            height: 40px;
        }

        & tr > td:first-child {
            padding-left: 15px;
        }

        & tr > td:last-child {
            padding-right: 15px;
        }
    }
`;

const Transaction = ({obj, accountId, hover=true, maxDescWidth='540px', onClick=()=>{}}) => {
    const isMobile = useMediaQuery({ maxWidth: 700 });
    const categories = useSelector(state => filterDeleted(state.categories));
    const funds = useSelector(state => filterDeleted(state.funds));
    const accounts = useSelector(state => filterDeleted(state.accounts));
    const currentPage = useSelector(state => state.currentPage);

    let date = obj.date !== undefined ? formatDate(obj.date, 'MMM d, yyyy') : '';
    let description = getType(obj, accountId, categories, funds, accounts, currentPage);

    return (
        <StyledComp onClick={onClick(obj)} hover={hover} maxDescWidth={maxDescWidth}>
            <table>
                <tbody>
                    <tr>
                        <td>
                            { description.length > 0 ? <div className='description'>{ description }</div> : null }
                            { description.length > 0 ? <span className='date'>{ date }</span> : <div className='description'>{ date }</div>}
                        </td>
                        <td>{getAmount(obj, categories, accountId)}</td>
                        { currentPage === 'Accounts' && !isMobile ? <td>{parseCurrency(obj.runningBalance)}</td> : null }
                    </tr>
                </tbody>
            </table>
        </StyledComp>
    );
}

const getType = (transaction, accountId, categories, funds, accounts, page) => {
    if (page === 'Categories' || page === 'Home') {
        let id = transaction.account;
        let account = accounts.find(obj => obj.id === id);
        if (account !== undefined) {
            if (transaction.description && transaction.description.length > 0) return account.name + ' - ' + transaction.description;
            return account.name;
        } else {
            if (transaction.description && transaction.description.length > 0) return transaction.description;
        }
    }

    if (page === 'Funds') {
        if (transaction.description && transaction.description.length > 0) return transaction.description;
        else return '';
    }

    if (accountId === undefined) return '';

    //get category name
    if (transaction.category !== undefined) {
        let category = categories.find(obj => obj.id === transaction.category);
        if (category !== undefined) {
            if (transaction.description.length > 0) return category.name + ' - ' + transaction.description;
            return category.name;
        } else {
            if (transaction.description.length > 0) return transaction.description;
        }
    }

    //get fund name
    if (transaction.fund !== undefined) {
        let fund = funds.find(obj => obj.id === transaction.fund);
        if (fund !== undefined) {
            if (transaction.description.length > 0) return `${fund.name} Fund - ${transaction.description}`;
            return `${fund.name} Fund`;
        }
    }

    //get transfer details
    if (transaction.from !== undefined) {
        if (transaction.from === accountId) {
            let account = accounts.find(obj => obj.id === transaction.to);
            if (account !== undefined) return `Transfered to ${account.name}`;
        } else {
            let account = accounts.find(obj => obj.id === transaction.from);
            if (account !== undefined) return `Transfered from ${account.name}`;
        }
    }

    return '';
}

export default Transaction;