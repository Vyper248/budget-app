import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';

const StyledComp = styled.div`
    position: absolute;
    width: ${props => props.width};
    height: 385px;
`;

const StyledInnerComp = styled.div`
    position: absolute;
    width: max-content;
    top: 50px;
    left: 50px;
    z-index: 5;

    & > div:first-child {
        position: absolute;
        width: 100%;
        opacity: 0;
        cursor: move;
        height: 40px;
    }

    & > svg {
        position: absolute;
        right: 8px;
        top: 8px;
        font-size: 1.5em;
        cursor: pointer;
        color: var(--text-color);
        background-color: var(--bg-color);
        width: 35px;
        height: 35px;
    }

    & > svg:hover {
        filter: brightness(0.8);
    }

    & > div:last-child {
        border: 2px solid var(--menu-border-color);
        width: calc(${props => props.width} - 100px);
        margin: auto;
        padding: 10px;
        background-color: var(--bg-color);
    }
`;

const TopPopup = ({children, onClose, posX=250, posY=-23, width='400px'}) => {
    const dispatch = useDispatch();

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
        if (newPos < -23) newPos = -23; //if it then goes off the top, move to 0
        else if (newPos + height + 50 > window.innerHeight) newPos = -23; //if it goes off the bottom after moving up, move to 0
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
            let objHeight = e.target.offsetHeight;
            let xDiff = e.clientX - startClientX;
            let yDiff = e.clientY - startClientY;
            let newX = startX + xDiff;
            let newY = startY + yDiff;

            //prevent going off the side
            if (newY < -23) newY = -23;
            if (newY > window.innerHeight-336) newY = window.innerHeight-336;
            if (newX < -50) newX = -50;
            if (newX > window.innerWidth-objWidth-51) newX = window.innerWidth-objWidth-51;
            
            setX(newX);
            setY(newY);
        }
    }

    return (
        <StyledComp width={width} onMouseUp={onMouseUp} onMouseMove={onMouseMove} style={{top: y, left: x}}>
            <StyledInnerComp width={width} ref={ref}>
                <div onMouseDown={onMouseDown}></div>
                <MdClose onClick={onClose}/>
                {children}
            </StyledInnerComp>
        </StyledComp>
    );
}

export default TopPopup;