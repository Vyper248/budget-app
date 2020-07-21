import styled from 'styled-components';

const Table = styled.table`
    margin: 5px auto;
    ${'' /* border-collapse: collapse; */}
    border-spacing: 0px;
    overflow: hidden;

    & thead td {
        background-color: #555;
    }

    & thead td.income {
        background-color: green;
    }

    & thead td.expense {
        background-color: darkorange;
        color: black;
    }

    & thead td.fund {
        background-color: lightsteelblue;
        color: black;
    }

    & thead td.remaining {
        background-color: deepskyblue;
        color: black;
    }

    & tr td.corner-top-left {
        border-top: none !important;
        border-left: none !important;
        background-color: transparent;
    }

    & td {
        padding: 10px;
        border-right: 1px solid gray;
        border-bottom: 1px solid gray;
    }

    & thead tr:first-child td {
        border-top: 1px solid gray;
    }

    & tr td:first-child {
        border-left: 1px solid gray;
    }
`;

export default Table;