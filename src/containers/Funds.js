import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { filterDeleted } from '../functions';

import ListContainer from '../components/ListContainer';
import List from '../components/List';
import Transactions from '../components/Transactions';
import Container from '../components/Container';
import EditList from './EditList';

const Funds = () => {
    const isMobile = useMediaQuery({ maxWidth: 700 });

    const dispatch = useDispatch();
    const editMode = useSelector(state => state.editMode);
    const allFunds = useSelector(state => filterDeleted(state.funds));
    const funds = allFunds.filter(fund => !fund.complete);
    const firstFund = funds[0];
    let firstFundId = firstFund !== undefined ? firstFund.id : undefined;
    let firstFundName = firstFund !== undefined ? firstFund.name : '';
    
    const transactions = useSelector(state => filterDeleted(state.transactions));
    const fundAdditions = useSelector(state => filterDeleted(state.fundAdditions));
    const [fund, setFund] = useState(firstFundId);
    const [fundName, setFundName] = useState(firstFundName);


    React.useEffect(() => {
        //If there's no object in the array, then go straight to edit mode
        if (funds.length === 0 && !editMode) {
            dispatch({type: 'SET_EDIT_MODE', payload: true});
        }
    });

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
                    { isMobile ? null : <List heading={'Funds'} array={funds} onClickObj={onClickObj} selected={fund}/> }
                    { editMode 
                        ? <EditList array={allFunds} onClickDropdown={onClickObj} id={fund}/>
                        : <Transactions transactions={combined} heading={fundName} onClickDropdown={onClickObj} objArray={funds} id={fund}/> 
                    }
                </ListContainer>
            </Container>
        </div>
    );
}

export default Funds;