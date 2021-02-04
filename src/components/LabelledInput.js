import React from 'react';
import styled from 'styled-components';

import Input from './Input';

const StyledComp = styled.div`
    display: flex;
    justify-content: center;
    margin: 5px;

    & > label {
        width: ${props => props.labelWidth};
        display: inline-flex;
        justify-content: flex-end;
        align-items: center;
        height: var(--input-height);
        padding: 0px 10px;
        border-left: 1px solid var(--menu-border-color);
        border-top: 1px solid var(--menu-border-color);
        border-bottom: 1px solid var(--menu-border-color);
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        background-color: var(--table-heading-bg-color);
    }

    & > input, & > select {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        width: 150px;
    }
`;

const LabelledInput = ({label, type='text', value, options=[], groups=[], labelWidth='120px', ...others}) => {
    let inputValue = value;
    if (isNaN(inputValue) && type === 'number') inputValue = '';

    return (
        <StyledComp labelWidth={labelWidth}>
            <label>{label}</label>
            <Input value={inputValue} type={type} options={options} groups={groups} {...others}/>
        </StyledComp>
    );
}

export default LabelledInput;