import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive'
import styled from 'styled-components';
import { IoIosAdd, IoIosRemove } from 'react-icons/io';

import AddTransaction from './AddTransaction';

const BottomArea = styled.div`
    position: fixed;
    bottom: -275px;
    transition: 0.3s;
    width: 100%;
    height: 288px;
    background-color: black;
    padding: 10px;
    border: 2px solid black;
    z-index: 3;
    ${props => props.open ? 'transform: translateY(-275px);' : ''};

    & > div {
        margin: auto;
    }
`;

const MobileAddButton = styled.div`
    & > * {
        transition: 0.3s;
    }

    & > svg {
        background-color: black;
        border: 3px solid white;
        border-radius: 100%;
        font-size: 51px;
        position: fixed;
        bottom: 5px;
        left: 50%;
        transform: translate(-50%,${props => props.open ? '-275px' : '0px'});
        z-index: 4;
    }

    & > div.left, & > div.right {
        border-bottom: 3px solid white;
        position: fixed;
        bottom: 11px;
        width: calc(50% - 22px);
        height: 20px;
        z-index: 4;
        ${props => props.open ? 'transform: translateY(-275px);' : ''};
    }

    & > div.right {
        border-left: 3px solid white;
        right: 0px;
        border-radius: 0px 0px 0px 20px;
    }

    & > div.left {
        border-right: 3px solid white;
        left: 0px;
        border-radius: 0px 0px 20px 0px;
    }

    & > div.middle {
        background-color: black;
        position: fixed;
        z-index: 1;
        width: 55px;
        height: 55px;
        left: 50%;
        transform: translate(-50%,${props => props.open ? '-275px' : '0px'}) rotate(-45deg);
        bottom: -16px;
        border-radius: 0px 51px 0px 100%;
    }
`;

const Footer = () => {
    const isMobile = useMediaQuery({ maxWidth: 700 });
    const [isOpen, setOpen] = useState(false);
    const [isFullyOpen, setFullyOpen] = useState(false);

    if (!isMobile) return null;

    const toggle = () => {
        setOpen(!isOpen);

        setTimeout(() => {
            setFullyOpen(!isFullyOpen);
        }, 300);
    }

    const onAddTransaction = () => {
        setOpen(false);
        setTimeout(() => {
            setFullyOpen(false);
        }, 300);
    }

    return (
        <div>
            <MobileAddButton open={isOpen}>
                { isFullyOpen ? <IoIosRemove onClick={toggle}/> : <IoIosAdd onClick={toggle}/> }
                <div className="right"></div>
                <div className="left"></div>
                <div className="middle"></div>
            </MobileAddButton>
            <BottomArea open={isOpen}>
                { isOpen ? <AddTransaction onAdd={onAddTransaction}/> : isFullyOpen ? <AddTransaction onAdd={onAddTransaction}/> : null }
            </BottomArea>
        </div>
    );
}

export default Footer;