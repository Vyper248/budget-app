import React from 'react';
import styled from 'styled-components';

const StyledComp = styled.div`
    color: ${props => props.color};
    display: inline-block;
    font-size: ${props => props.size};
    ${props => props.bordered ? 'border: 1px solid white' : ''};
    width: ${props => props.width ? props.width : 'auto'};
    padding: ${props => props.bordered ? '5px' : '0px'};
    border-radius: 5px;
    
    :hover {
        cursor: pointer;
    }

    & > svg {
        position: relative;
        top: ${props => props.topAdjust};
    }
`;

const IconButton = ({Icon, onClick, color='var(--icon-color)', topAdjust='3px', size='1em', width='auto', bordered=false}) => {
    return (
        <StyledComp color={color} topAdjust={topAdjust} size={size} width={width} bordered={bordered}>
            <Icon onClick={onClick}/>
        </StyledComp>
    );
}

export default IconButton;