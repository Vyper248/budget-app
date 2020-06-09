import React from 'react';
import styled from 'styled-components';

import Input from './Input';

const StyledComp = styled.div`
    display: flex;
    justify-content: center;
    margin: 5px;

    & > label {
        width: 120px;
        display: inline-flex;
        justify-content: flex-end;
        align-items: center;
        height: var(--input-height);
        padding: 0px 10px;
        border-left: 1px solid white;
        border-top: 1px solid white;
        border-bottom: 1px solid white;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        background-color: #333;
    }

    & > input, & > select {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border: 1px solid white;
        width: 150px;
    }
`;

const LabelledInput = ({label, type='text', value, placeholder='', onChange, options=[], groups=[]}) => {
    return (
        <StyledComp>
            <label>{label}</label>
            <Input value={value} type={type} onChange={onChange} placeholder={placeholder} options={options} groups={groups}/>
        </StyledComp>
    );
}

export default LabelledInput;