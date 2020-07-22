import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { TiArrowSortedDown } from 'react-icons/ti';

const StyledComp = styled.div`
    width: 250px;
    margin: 5px auto;
    position: relative;

    & > div.dropdownDisplay {
        font-size: 1.5em;
        font-weight: bold;
        border-bottom: 1px solid white;
        padding: 5px;
        position: relative;
        padding-right: 30px;
        padding-left: 30px;
        overflow: hidden;
    }

    & > div.dropdownDisplay > svg {
        position: absolute;
        right: 0px;
        top: 2px;
        font-size: 1.5em;
    }

    & > div.dropdownGroup {
        border-left: 1px solid gray;
        border-bottom: ${props => props.open ? '1px solid gray' : 'none'};
        border-right: 1px solid gray;
        position: absolute;
        top: 100%;
        left: 0px;
        right: 0px;
        background-color: black;
        max-height: ${props => props.open ? props.maxHeight : '0px'};
        overflow: scroll;
        transition: 0.3s;
    }

    & div.dropdownItem {
        padding: 10px;
        border-bottom: 1px solid gray;
    }

    & div.dropdownItem:last-child {
        border-bottom: none;
    }
`;

const HeaderDropdown = ({value, options=[], onChange}) => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    let currentValue = options.find(obj => obj.value === value);
    if (value === 'Edit') currentValue = {display: 'Edit'};

    const toggleOpen = () => {
        setOpen(!open);
    }

    const onClickItem = (itemValue) => () => {
        onChange(itemValue);
        setOpen(false);
    }

    const onClickEdit = () => {
        dispatch({type: 'SET_EDIT_MODE', payload: true});
    }

    let maxHeight = (options.length * 40) + 40;
    if (maxHeight > 300) maxHeight = 300;
    
    return (
        <StyledComp open={open} maxHeight={maxHeight+'px'}>
            <div className='dropdownDisplay' onClick={toggleOpen}>{currentValue.display}<TiArrowSortedDown/></div>
            <div className='dropdownGroup'>
            {
                options.map(obj => <div key={'headerDropdown-'+obj.value} className='dropdownItem' onClick={onClickItem(obj.value)}>{obj.display}</div>)
            }
                <div className='dropdownItem' onClick={onClickEdit}>Edit</div>
            </div>
        </StyledComp>
    );
}

export default HeaderDropdown;