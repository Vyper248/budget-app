import React from 'react';
import styled from 'styled-components';

const StyledComp = styled.div`
    color: ${props => props.color};
    
    :hover {
        cursor: pointer;
    }

    & > svg {
        position: relative;
        top: ${props => props.topAdjust};
    }
`;

const IconButton = ({Icon, onClick, color='white', topAdjust='3px'}) => {
    return (
        <StyledComp color={color} topAdjust={topAdjust}>
            <Icon onClick={onClick}/>
        </StyledComp>
    );
}

export default IconButton;