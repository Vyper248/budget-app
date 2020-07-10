import styled from 'styled-components';

const Grid = styled.div`
    display: grid;
    grid-template-columns: ${props => props.template ? props.template : '1fr 1fr'};
    grid-gap: 10px;
    margin: 10px;
`;

export default Grid;