import React from 'react';
import styled from 'styled-components';

const StyledComp = styled.div`
    position: fixed;
    top: 28px;
    width: 100%;

    & > div {
        border: 1px solid white;
        width: 300px;
        margin: auto;
        padding: 10px;
        background-color: black;
    }
`;

const TopPopup = ({children}) => {
    return (
        <StyledComp>{children}</StyledComp>
    );
}

export default TopPopup;