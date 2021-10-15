import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';

const StyledComp = styled.div`
    position: absolute;
    width: calc(${props => props.width} + 200px);
    height: 300px;
    z-index: 5;
    ${props => props.dragging ? 'pointer-events: all' : 'pointer-events: none'};
`;

const StyledInnerComp = styled.div`
    position: absolute;
    width: max-content;
    top: 100px;
    left: 100px;
    z-index: 5;
    pointer-events: all;

    & > div:first-child {
        position: absolute;
        width: 100%;
        opacity: 0;
        cursor: move;
        height: 40px;
    }

    & > svg {
        position: absolute;
        right: 2px;
        top: 2px;
        font-size: 1.5em;
        cursor: pointer;
        color: var(--text-color);
        background-color: var(--bg-color);
        width: 26px;
        height: 26px;
        border-radius: 50%;
        ${props => props.dragging ? 'pointer-events: none' : 'pointer-events: all'};
    }

    & > svg:hover {
        // filter: brightness(0.8);
        color: var(--light-text-color);
    }

    & > div:last-child {
        border: 2px solid var(--menu-border-color);
        width: ${props => props.width};
        margin: auto;
        padding: 10px;
        background-color: var(--bg-color);
    }
`;

const TopPopup = ({children, onClose, posX=200, posY=-73, width='300px'}) => {
    const [dragging, setDragging] = useState(false);
    const [startClientX, setStartClientX] = useState(0);
    const [startClientY, setStartClientY] = useState(0);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(100);
    const [x, setX] = useState(posX);
    const [y, setY] = useState(posY);
    const ref = useRef(null);

    useEffect(() => {
        setX(posX);
        setY(posY);
        checkYPos();
    }, [posX, posY]);

    useEffect(() => {
        checkYPos();
    }, [ref]);

    const checkYPos = () => {
        let height = ref.current.offsetHeight;
        let newPos = (posY - height/2) + 20; //move to a centered position
        if (newPos < -73) newPos = -73; //if it then goes off the top, move to 0
        else if (newPos + height + 50 > window.innerHeight) newPos = -73; //if it goes off the bottom after moving up, move to 0
        setY(newPos);
    }

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
            let objWidth = e.target.offsetWidth;
            let xDiff = e.clientX - startClientX;
            let yDiff = e.clientY - startClientY;
            let newX = startX + xDiff;
            let newY = startY + yDiff;

            //prevent going off the side
            if (newY < -73) newY = -73;
            if (newY > window.innerHeight-396) newY = window.innerHeight-396;
            if (newX < -100) newX = -100;
            if (newX > window.innerWidth-objWidth-100) newX = window.innerWidth-objWidth-100;
            
            setX(newX);
            setY(newY);
        }
    }

    return (
        <StyledComp dragging={dragging} width={width} onMouseUp={onMouseUp} onMouseMove={onMouseMove} style={{top: y, left: x}}>
            <StyledInnerComp width={width} ref={ref} dragging={dragging}>
                <div onMouseDown={onMouseDown}></div>
                <MdClose onClick={onClose}/>
                {children}
            </StyledInnerComp>
        </StyledComp>
    );
}

export default TopPopup;