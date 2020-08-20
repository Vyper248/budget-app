import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const StyledComp = styled.input`
    width: 60px;
    border: 1px solid var(--text-color);
    background-color: var(--bg-color);
    color: var(--text-color);
`;

const BudgetInput = ({value, category, date}) => {
    const dispatch = useDispatch();
    const updateBudget = (val) => dispatch({type: 'UPDATE_BUDGET', payload: val});

    const onChangeBudget = (e) => {
        let amount = parseFloat(e.target.value);

        let newBudget = {
            category: category,
            amount: amount,
            startDate: date,
            carryOver: false,
        };

        updateBudget(newBudget);
    }

    return (
        <StyledComp type="number" value={isNaN(value) || value === null ? '' : value} onChange={onChangeBudget}/>
    );
}

export default BudgetInput;