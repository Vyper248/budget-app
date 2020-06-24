import React from 'react';
import styled from 'styled-components';

const StyledComp = styled.input`
    border: 1px solid white;
    height: var(--input-height);
    background-color: var(--bg-color);
    color: var(--text-color);
    padding-left: 10px;
    font-size: 1em;
    width: ${props => props.width};
    border-radius: 0px;
    -webkit-appearance: none;

    :focus {
        outline: none;
        border: 1px solid #33C9F9;
    }

    &::-webkit-calendar-picker-indicator {
        filter: invert(100%);
    }
`;

const Input = ({value, type='text', placeholder='', onChange, options=[], groups=[], width="100px"}) => {
    if (type === 'dropdown' && (options.length > 0 || groups.length > 0)) return (
        <StyledComp as='select' onChange={onChange} value={value} width={width}>
            <option hidden value={undefined}>Select an Option</option>
        {
            options.length > 0 
            ? options.map(option => {
                return <option key={'inputOption-'+option.value} value={option.value}>{option.display}</option>
            })
            : groups.map(group => {
                return (
                    <optgroup key={'inputGroup-'+group.label} label={group.label}>
                    {
                        group.options.map(option => {
                            return <option key={'inputGroupOption-'+option.value} value={option.value}>{option.display}</option>
                        })
                    }
                    </optgroup>
                )
            })
        }
        </StyledComp>
    );

    return (
        <StyledComp value={value} type={type} onChange={onChange} placeholder={placeholder} width={width}/>
    );
}

export default Input;