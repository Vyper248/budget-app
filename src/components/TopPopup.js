import React, { useState } from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';

const StyledComp = styled.div`
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
`;

const StyledInnerComp = styled.div.attrs(props => ({
    style: {
        top: props.y,
        left: props.x
    }
}))`
    position: absolute;
    width: max-content;

    & > div:first-child {
        position: absolute;
        width: 100%;
        opacity: 0;
        cursor: move;
        height: 35px;
    }

    & > svg {
        position: absolute;
        right: 5px;
        top: 5px;
        font-size: 1.5em;
        cursor: pointer;
        color: var(--text-color);
    }

    & > svg:hover {
        filter: brightness(0.8);
    }

    & > div:last-child {
        border: 1px solid var(--menu-border-color);
        width: 300px;
        margin: auto;
        padding: 10px;
        background-color: var(--bg-color);
    }
`;

const TopPopup = ({children}) => {
    const dispatch = useDispatch();

    const [dragging, setDragging] = useState(false);
    const [startClientX, setStartClientX] = useState(0);
    const [startClientY, setStartClientY] = useState(0);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(100);
    const [x, setX] = useState(300);
    const [y, setY] = useState(28);

    const onMouseDown = (e) => {
        setStartClientX(e.clientX);
        setStartClientY(e.clientY);
        setStartX(x);
        setStartY(y);
        setDragging(true);
    }

    const onMouseUp = () => {
        setDragging(false);
    }

    const onMouseMove = (e) => {
        if (dragging) {
            let xDiff = e.clientX - startClientX;
            let yDiff = e.clientY - startClientY;
            let newX = startX + xDiff;
            let newY = startY + yDiff;
            if (newY < 28) newY = 28;
            if (newY > window.innerHeight-285) newY = window.innerHeight-285;
            if (newX < 0) newX = 0;
            if (newX > window.innerWidth-300) newX = window.innerWidth-300;
            setX(newX);
            setY(newY);
        }
    }

    const onClose = () => {
        dispatch({type: 'SET_ADD_TRANSACTION', payload: false});
    }

    return (
        <StyledComp onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
            <StyledInnerComp x={x} y={y}>
                <div onMouseDown={onMouseDown}></div>
                <MdClose onClick={onClose}/>
                {children}
            </StyledInnerComp>
        </StyledComp>
    );
}

export default TopPopup;