import React from 'react';
import styled from 'styled-components';

const StyledComp = styled.div`
    background-color: var(--bg-color);
    border: 1px solid var(--text-color);
    border-radius: 5px;
    height: var(--input-height);
    display: ${props => props.inline ? 'inline flex' : 'flex'};
    justify-content: center;
    align-items: center;
    width: ${props => props.width};
    margin: auto;

    :hover {
        cursor: pointer;
        background-color: #555;
    }
`;

const Button = ({value, onClick, width='100%', inline=false}) => {
    return (
        <StyledComp width={width} onClick={onClick} inline={inline}>{value}</StyledComp>
    );
}

export default Button;