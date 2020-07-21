import styled from 'styled-components';

const Grid = styled.div`
    display: grid;
    grid-template-columns: ${props => props.template ? props.template : '1fr 1fr'};
    grid-gap: 10px;
    margin: 10px;
    ${props => props.start !== undefined ? 'grid-column-start:'+props.start : ''};
    ${props => props.end !== undefined ? 'grid-column-end:'+props.end : ''};
`;

export default Grid;