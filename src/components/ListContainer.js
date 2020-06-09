import styled from 'styled-components';

const ListContainer = styled.div`
    display: flex;
    width: 100%;
    height: calc(100vh - 70px);

    & > div:last-child {
        flex-grow: 1;
    }
`;

export default ListContainer;