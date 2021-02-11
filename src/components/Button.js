import React from 'react';
import styled from 'styled-components';

const StyledComp = styled.div`
    background-color: var(--menu-bg-color);
    color: var(--menu-text-color);
    border: 1px solid var(--menu-border-color);
    ${props => props.color ? `border-color: ${props.color}` : ''};
    border-radius: 5px;
    height: var(--input-height);
    display: ${props => props.inline ? 'inline flex' : 'flex'};
    justify-content: center;
    align-items: center;
    width: ${props => props.width};
    margin: auto;
    ${props => props.inline ? 'margin: 3px' : ''};
    position: relative;

    &:hover {
        cursor: pointer;
        background-color: var(--menu-selected-bg-color);
        color: var(--menu-selected-text-color);
    }

    &.selected {
        background-color: var(--menu-selected-bg-color);
        color: var(--menu-selected-text-color);
    }
`;

const Loader = styled.div`
    position: absolute;
    left: 0px;
    right: 0px;
    top: 0px;
    bottom: 0px;

    background-color: rgba(0,0,0,0.6);
    border-radius: 5px;
    cursor: default;

    :after {
        content: ' ';
        position: relative;
        top: 2px;
        border: 3px solid black;
        border-radius: 50%;
        border-top: none;
        border-left: none;
        width: 20px;
        height: 20px;
        display: block;
        margin: auto;
        animation-name: spin;
        animation-duration: 0.9s;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
    }

    @keyframes spin {
        from {transform: rotate(0deg);}
        to {transform: rotate(360deg);}
    }
`;

const Button = ({value, onClick, width='100%', inline=false, color=undefined, style={}, loading=false, selected=false}) => {
    if (loading) return <StyledComp width={width} inline={inline} color={color} style={style} className={selected ? 'selected' : ''}><Loader/>{value}</StyledComp>

    return <StyledComp width={width} onClick={onClick} inline={inline} color={color} style={style} className={selected ? 'selected' : ''}>{value}</StyledComp>
}

export default Button;