import styled from 'styled-components';

const Container = styled.div`
    width: 90%;
    max-width: 1100px;
    margin: 10px auto;

    @media screen and (max-width: 700px) {
        width: 100%;
        margin: 0px;
    }
`;

export default Container;