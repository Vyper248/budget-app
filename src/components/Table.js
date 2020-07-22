import styled from 'styled-components';

const Table = styled.table`
    margin: 5px auto;
    ${'' /* border-collapse: collapse; */}
    border-spacing: 0px;
    overflow: hidden;
    border-radius: 5px;

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
        padding: ${props => props.padding ? props.padding : '10px 15px'};
        border-right: 1px solid #444;
        border-bottom: 1px solid #444;
    }

    & thead tr:first-child td {
        border-top: 1px solid #444;
    }

    & tr td:first-child {
        border-left: 1px solid #444;
    }

    & thead tr:first-child td:first-child {
        border-top-left-radius: 5px;
    }

    & thead tr:first-child td:last-child {
        border-top-right-radius: 5px;
    }

    & tbody tr:last-child td:first-child {
        border-bottom-left-radius: 5px;
    }

    & tbody tr:last-child td:last-child {
        border-bottom-right-radius: 5px;
    }
`;

export default Table;