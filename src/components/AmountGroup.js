import React, { useState } from 'react';
import styled from 'styled-components';
import { FaPiggyBank } from 'react-icons/fa';

import { parseCurrency } from '../functions';

import BudgetInput from './BudgetInput';

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
        font-size: 1.2em;
        font-weight: bold;
        padding: 2px;
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
`;

const AmountGroup = ({title, amount, type, budget=0, editBudget=false, id, date}) => {
    const [editMode, setEditMode] = useState(false);

    const toggleEditMode = () => {
        setEditMode(!editMode);
    }

    return (
        <StyledComp type={type} className={title === 'Earnings' || title === 'Remaining' ? 'fullRow' : ''}>
            <div>
                { title }
                { editBudget ? <div className="budgetIcon" onClick={toggleEditMode}><FaPiggyBank/></div> : null }
            </div>
            <div>
                { amount }
                { !editMode && budget > 0 ? ` / ${parseCurrency(budget)}` : '' }
                { editMode ? <span> / <BudgetInput value={budget} category={id} date={date}/></span> : null }
            </div>
        </StyledComp>
    );
}

export default AmountGroup;