import React, { useState } from 'react';

import Container from '../components/Container';
import Button from '../components/Button';

import InterestCalc from './InterestCalc';
import Breakdown from './Breakdown';
import FundList from './FundList';
import SavingGoal from './SavingGoal';
import VisaTool from './VisaTool';

const Tools = () => {
    const [subPage, setSubPage] = useState('VisaTool');

    const onClickSubMenu = (page) => () => {
        setSubPage(page);
    }

    return (
        <div>
            <Container>
                <h4>Tools</h4>
                <Button value='Fund List' width='100px' inline={true} onClick={onClickSubMenu('FundList')} selected={subPage === 'FundList' ? true : false}/>
                <Button value='Category Breakdown' width='180px' inline={true} onClick={onClickSubMenu('Breakdown')} selected={subPage === 'Breakdown' ? true : false}/>
                <Button value='Interest' width='100px' inline={true} onClick={onClickSubMenu('Interest')} selected={subPage === 'Interest' ? true : false}/>
                <Button value='Savings Goal' width='120px' inline={true} onClick={onClickSubMenu('SavingsGoal')} selected={subPage === 'SavingsGoal' ? true : false}/>
                <Button value='Visa Tool' width='120px' inline={true} onClick={onClickSubMenu('VisaTool')} selected={subPage === 'VisaTool' ? true : false}/>
            </Container>
            { subPage === 'Interest' ? <InterestCalc/> : null }
            { subPage === 'Breakdown' ? <Breakdown/> : null }
            { subPage === 'FundList' ? <FundList/> : null }
            { subPage === 'SavingsGoal' ? <SavingGoal/> : null }
            { subPage === 'VisaTool' ? <VisaTool/> : null }
        </div> 
    );
}

export default Tools;