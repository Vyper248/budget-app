import React, { useState } from 'react';

import Container from '../components/Container';
import Button from '../components/Button';

import InterestCalc from './InterestCalc';

const Tools = () => {
    const [subPage, setSubPage] = useState('Interest');

    const onClickSubMenu = (page) => () => {
        setSubPage(page);
    }

    return (
        <div>
            <Container>
                <h4>Tools</h4>
                <Button value='Stats' width='100px' inline={true} onClick={onClickSubMenu('Stats')} selected={subPage === 'Stats' ? true : false}/>&nbsp;
                <Button value='Interest' width='100px' inline={true} onClick={onClickSubMenu('Interest')} selected={subPage === 'Interest' ? true : false}/>
            </Container>
            { subPage === 'Interest' ? <InterestCalc/> : null }
        </div> 
    );
}

export default Tools;