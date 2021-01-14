import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const StyledComp = styled.input`
    width: 60px;
    border: 1px solid var(--text-color);
    background-color: var(--bg-color);
    color: var(--text-color);
`;

const BudgetInput = ({value, category, date}) => {
    const [oldValue, setOldValue] = useState(value);
    const [currentValue, setCurrentValue] = useState(value);
    const dispatch = useDispatch();
    const updateBudget = (val) => dispatch({type: 'UPDATE_BUDGET', payload: val});

    //use local state for editing object, but change if global state changes (don't want to sync with server for every keystroke)
    if (value !== oldValue) {
        setOldValue(value);
        setCurrentValue(value);
    }

    const onChangeBudget = (e) => {
        let amount = parseFloat(e.target.value);
        setCurrentValue(amount);
    }

    const onBlurBudget = (e) => {
        let newBudget = {
            category: category,
            amount: currentValue,
            startDate: date,
            carryOver: false,
        };

        updateBudget(newBudget);
    }

    return (
        <StyledComp type="number" value={isNaN(currentValue) || currentValue === null ? '' : currentValue} onChange={onChangeBudget} onBlur={onBlurBudget}/>
    );
}

export default BudgetInput;