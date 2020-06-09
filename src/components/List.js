import React from 'react';
import styled from 'styled-components';

const StyledComp = styled.div`
    border: 1px solid white;
    width: 200px;
    margin: 5px;
    padding: 0px 5px;
    overflow: scroll;

    & > div {
        border: 1px solid white;
        padding: 5px;
        width: 100%;
        margin-bottom: 5px;
    }

    & > div:hover {
        background-color: #555;
        cursor: pointer;
    }

    & > div.selected {
        background-color: #555;
    }
`;

const List = ({heading='', array=[], onClickObj, onClickEdit, selected}) => {
    return (
        <StyledComp>
            <h4>{heading}</h4>
            {
                array.map(obj => {
                    return (
                        <div onClick={onClickObj(obj.id)} className={selected === obj.id ? 'selected': ''}>{obj.name}</div>
                    );
                })
            }
        </StyledComp>
    );
}

export default List;