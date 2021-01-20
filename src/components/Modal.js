import React from 'react';
import styled from 'styled-components';

const StyledComp = styled.div`
    width: ${props => props.width+'px'};
    border: 1px solid white;
    position: fixed;
    top: 50px;
    background-color: var(--bg-color);
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    opacity: 0;
    transition: 0.4s;
    pointer-events: none;

    &.visible {
        opacity: 1;
        transition: 0.4s;
        pointer-events: all;
    }
`;

const Modal = ({children, width=350, visible=false}) => {
    return (
        <StyledComp width={width} className={visible ? 'visible' : ''}>{children}</StyledComp>
    );
}

export default Modal;