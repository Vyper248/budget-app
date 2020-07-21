import React from 'react';
import styled from 'styled-components';

const StyledComp = styled.div`
    color: ${props => props.color};
    display: inline-block;
    font-size: ${props => props.size};
    
    :hover {
        cursor: pointer;
    }

    & > svg {
        position: relative;
        top: ${props => props.topAdjust};
    }
`;

const IconButton = ({Icon, onClick, color='white', topAdjust='3px', size='1em'}) => {
    return (
        <StyledComp color={color} topAdjust={topAdjust} size={size}>
            <Icon onClick={onClick}/>
        </StyledComp>
    );
}

export default IconButton;