import React, { useState } from 'react';

import Container from '../components/Container';
import Button from '../components/Button';

import InterestCalc from './InterestCalc';
import Breakdown from './Breakdown';

const Tools = () => {
    const [subPage, setSubPage] = useState('Breakdown');

    const onClickSubMenu = (page) => () => {
        setSubPage(page);
    }

    return (
        <div>
            <Container>
                <h4>Tools</h4>
                <Button value='Breakdown' width='100px' inline={true} onClick={onClickSubMenu('Breakdown')} selected={subPage === 'Breakdown' ? true : false}/>&nbsp;
                <Button value='Interest' width='100px' inline={true} onClick={onClickSubMenu('Interest')} selected={subPage === 'Interest' ? true : false}/>
            </Container>
            { subPage === 'Interest' ? <InterestCalc/> : null }
            { subPage === 'Breakdown' ? <Breakdown/> : null }
        </div> 
    );
}

export default Tools;