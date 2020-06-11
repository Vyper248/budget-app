import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ListContainer from '../components/ListContainer';
import List from '../components/List';
import Transactions from '../components/Transactions';
import Container from '../components/Container';
import EditList from './EditList';

const Funds = () => {
    const dispatch = useDispatch();
    const editMode = useSelector(state => state.editMode);
    const funds = useSelector(state => state.funds);
    const firstFund = funds[0];
    let firstFundId = firstFund !== undefined ? firstFund.id : undefined;
    let firstFundName = firstFund !== undefined ? firstFund.name : '';
    
    const transactions = useSelector(state => state.transactions);
    const fundAdditions = useSelector(state => state.fundAdditions);
    const [fund, setFund] = useState(firstFundId);
    const [fundName, setFundName] = useState(firstFundName);

    const onClickObj = (id) => () => {
        let fund = funds.find(obj => obj.id === id);
        setFund(id);
        setFundName(fund.name);
        dispatch({type: 'SET_EDIT_MODE', payload: false});
    }

    const filteredTransactions = transactions.filter(obj => {
        return obj.fund !== undefined && obj.fund === fund ? true : false;
    }); 

    const filteredFundAdditions = fundAdditions.filter(obj => {
        return obj.fund !== undefined && obj.fund === fund ? true : false;
    });

    const combined = [...filteredTransactions, ...filteredFundAdditions];

    return (
        <div>  
            <Container>
                <ListContainer>
                    <List heading={'Funds'} array={funds} onClickObj={onClickObj} selected={fund}/>
                    { editMode 
                        ? <EditList array={funds}/>
                        : <Transactions transactions={combined} heading={fundName}/> 
                    }
                </ListContainer>
            </Container>
        </div>
    );
}

export default Funds;