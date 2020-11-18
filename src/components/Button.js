import React from 'react';
import styled from 'styled-components';

const StyledComp = styled.div`
    background-color: var(--menu-bg-color);
    border: 1px solid var(--text-color);
    ${props => props.color ? `border-color: ${props.color}` : ''};
    border-radius: 5px;
    height: var(--input-height);
    display: ${props => props.inline ? 'inline flex' : 'flex'};
    justify-content: center;
    align-items: center;
    width: ${props => props.width};
    margin: auto;

    :hover {
        cursor: pointer;
        background-color: var(--menu-selected-bg-color);
        color: var(--menu-selected-text-color);
    }
`;

const Button = ({value, onClick, width='100%', inline=false, color=undefined, style={}}) => {
    return (
        <StyledComp width={width} onClick={onClick} inline={inline} color={color} style={style}>{value}</StyledComp>
    );
}

export default Button;