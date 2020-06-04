import React from 'react';
import styled from 'styled-components';

const Table = styled.table`
    margin: 5px auto;
    border-collapse: collapse;
    border: 1px solid gray;

    & thead td {
        background-color: #555;
    }

    & td {
        padding: 5px;
        border-right: 1px solid gray;
        border-bottom: 1px solid gray;
    }
`;

export default Table;