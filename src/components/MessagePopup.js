import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { IoMdClose } from 'react-icons/io';

const StyledComp = styled.div`
    width: 95%;
    max-width: 1200px;
    border: 2px solid white;
    ${props => props.type === 'error' ? 'border: 2px solid red' : ''};
    ${props => props.type === 'success' ? 'border: 2px solid #0F0' : ''};
    margin: auto;
    margin-top: 5px;
    padding: 5px;
    position: relative;

    & > div:last-child {
        position: absolute;
        right: -1px;
        top: -2px;
        font-size: 2em;
    }

    & > div:last-child:hover {
        color: red;
        cursor: pointer;
    }
`;

const MessagePopup = () => {
    const dispatch = useDispatch();
    const message = useSelector(state => state.message);
    const clearMessage = () => dispatch({type: 'SET_MESSAGE', payload: {text: '', type: ''}});

    if (message.text.length === 0) return null;

    return (
        <StyledComp type={message.type}>
            <div>{message.text}</div>
            <div onClick={clearMessage}><IoMdClose/></div>
        </StyledComp>
    );
}

export default MessagePopup;