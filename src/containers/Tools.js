import React, { useState } from 'react';

import Container from '../components/Container';
import Button from '../components/Button';

import InterestCalc from './InterestCalc';
import Breakdown from './Breakdown';
import FundList from './FundList';
import SavingGoal from './SavingGoal';

const Tools = () => {
    const [subPage, setSubPage] = useState('Interest');

    const onClickSubMenu = (page) => () => {
        setSubPage(page);
    }

    return (
        <div>
            <Container>
                <h4>Tools</h4>
                <Button value='Fund List' width='100px' inline={true} onClick={onClickSubMenu('FundList')} selected={subPage === 'FundList' ? true : false}/>&nbsp;
                <Button value='Category Breakdown' width='180px' inline={true} onClick={onClickSubMenu('Breakdown')} selected={subPage === 'Breakdown' ? true : false}/>&nbsp;
                <Button value='Interest' width='100px' inline={true} onClick={onClickSubMenu('Interest')} selected={subPage === 'Interest' ? true : false}/>&nbsp;
                <Button value='Savings Goal' width='120px' inline={true} onClick={onClickSubMenu('SavingsGoal')} selected={subPage === 'SavingsGoal' ? true : false}/>
            </Container>
            { subPage === 'Interest' ? <InterestCalc/> : null }
            { subPage === 'Breakdown' ? <Breakdown/> : null }
            { subPage === 'FundList' ? <FundList/> : null }
            { subPage === 'SavingsGoal' ? <SavingGoal/> : null }
        </div> 
    );
}

export default Tools;