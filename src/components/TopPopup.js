import React, { useState } from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';

const StyledComp = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 400px;
    height: 385px;
`;

const StyledInnerComp = styled.div`
    position: absolute;
    width: max-content;
    top: 50px;
    left: 50px;

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
    const [x, setX] = useState(250);
    const [y, setY] = useState(-23);

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

            //prevent going off the side
            if (newY < -23) newY = -23;
            if (newY > window.innerHeight-336) newY = window.innerHeight-336;
            if (newX < -50) newX = -50;
            if (newX > window.innerWidth-351) newX = window.innerWidth-351;
            
            setX(newX);
            setY(newY);
        }
    }

    const onClose = () => {
        dispatch({type: 'SET_ADD_TRANSACTION', payload: false});
    }

    return (
        <StyledComp onMouseUp={onMouseUp} onMouseMove={onMouseMove} style={{top: y, left: x}}>
            <StyledInnerComp>
                <div onMouseDown={onMouseDown}></div>
                <MdClose onClick={onClose}/>
                {children}
            </StyledInnerComp>
        </StyledComp>
    );
}

export default TopPopup;