import React from 'react';
import styled from 'styled-components';

const StyledComp = styled.div`
    text-align: center;
    border-radius: 5px;
    box-shadow: 0px 1px 4px gray;
    width: 100%;
    overflow: hidden;

    &.fullRow {
        grid-column-start: 1;
        grid-column-end: 3;
    }

    & > div:first-of-type {
        font-size: 1.2em;
        font-weight: bold;
        padding: 2px;
        margin-bottom: 4px;
        ${props => props.type === 'income' ? 'background-color: green' : ''};
        ${props => props.type === 'expense' ? 'background-color: darkorange; color: black;' : ''};
        ${props => props.type === 'fund' ? 'background-color: lightsteelblue; color: black;' : ''};
        ${props => props.type === 'remaining' ? 'background-color: deepskyblue; color: black;' : ''};
    }

    & > div:last-of-type {
        font-size: 1em;
        margin-bottom: 5px;
    }
`;

const AmountGroup = ({title, amount, type}) => {
    return (
        <StyledComp type={type} className={title === 'Earnings' || title === 'Remaining' ? 'fullRow' : ''}>
            <div>{title}</div>
            <div>{amount}</div>
        </StyledComp>
    );
}

export default AmountGroup;