import styled from 'styled-components';

const Table = styled.table`
    margin: 5px auto;
    ${'' /* border-collapse: collapse; */}
    border-spacing: 0px;
    overflow: hidden;
    border-radius: 5px;
    background-color: var(--bg-color);
    color: var(--text-color);

    & thead td {
        background-color: var(--table-heading-bg-color);
        color: var(--table-heading-text-color);
    }

    & thead td.income {
        background-color: green;
        color: white;
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

    & tbody th {
        background-color: var(--table-heading-bg-color);
        color: var(--table-heading-text-color);
        font-weight: normal;
    }

    & tr td.corner-top-left {
        border-top: none !important;
        border-left: none !important;
        background-color: transparent;
    }

    & td, & th {
        padding: ${props => props.padding ? props.padding : '10px 15px'};
        border-right: 1px solid var(--menu-border-color);
        border-bottom: 1px solid var(--menu-border-color);
    }
    
    & > *:first-child tr:first-child > * {
        border-top: 1px solid var(--menu-border-color);
    }

    & tr td:first-child, & tr th:first-child {
        border-left: 1px solid var(--menu-border-color);
    }

    & > *:first-child tr:first-child > *:first-child {
        border-top-left-radius: 5px;
    }

    & > *:first-child tr:first-child > *:last-child {
        border-top-right-radius: 5px;
    }

    & tbody tr:last-child td:first-child {
        border-bottom-left-radius: 5px;
    }

    & tbody tr:last-child td:last-child {
        border-bottom-right-radius: 5px;
    }

    & td {
        position: relative;
    }

    & .budgetIcon {
        ${'' /* position: absolute; */}
        float: right;
        margin-left: 5px;
    }

    & .budgetIcon:hover {
        cursor: pointer;
    }

    & td.input {
        padding: 2px;
    }
`;

export default Table;