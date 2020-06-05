import React from 'react';
import styled from 'styled-components';

const StyledComp = styled.div`
    background-color: var(--bg-color);
    border: 1px solid var(--text-color);
    border-radius: 5px;
    height: var(--input-height);
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${props => props.width};
    margin: auto;

    :hover {
        cursor: pointer;
        background-color: #555;
    }
`;

const Button = ({value, onClick, width='100%'}) => {
    return (
        <StyledComp width={width} onClick={onClick}>{value}</StyledComp>
    );
}

export default Button;