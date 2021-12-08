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
        position: relative;
        font-size: 1em;
        font-weight: bold;
        padding: 5px;
        margin-bottom: 4px;
        ${props => props.type === 'income' ? 'background-color: green; color: white;' : ''};
        ${props => props.type === 'expense' ? 'background-color: darkorange; color: black;' : ''};
        ${props => props.type === 'fund' ? 'background-color: lightsteelblue; color: black;' : ''};
        ${props => props.type === 'remaining' ? 'background-color: deepskyblue; color: black;' : ''};
        ${props => props.type === 'account' ? 'background-color: deepskyblue; color: black;' : ''};
    }

    & > div:last-of-type {
        font-size: 1em;
        margin-bottom: 5px;
    }

    & .budgetIcon {
        position: absolute;
        right: 5px;
        top: 5px;
    }

    & .budgetIcon:hover {
        cursor: pointer;
    }

    @media only screen and (min-width: 701px) {
        &.fullRow {
            grid-column-start: 1;
            grid-column-end: 5;
        }
    }
`;

const AmountGroup = ({title, amount, type}) => {
    return (
        <StyledComp type={type} className={title === 'Earnings' || title === 'Remaining' || title === 'Total' ? 'fullRow' : ''}>
            <div>
                { title }
            </div>
            <div>
                { amount }
            </div>
        </StyledComp>
    );
}

export default AmountGroup;