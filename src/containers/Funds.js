import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { filterDeleted, filterTransactions } from '../functions';

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

    const [filter, setFilter] = useState('');

    React.useEffect(() => {
        //If there's no object in the array, then go straight to edit mode
        if (allFunds.length === 0 && !editMode) {
            dispatch({type: 'SET_EDIT_MODE', payload: true});
        }
    });

    const onClickObj = (id) => () => {
        let fund = allFunds.find(obj => obj.id === id);
        setFund(id);
        setFundName(fund.name);
        dispatch({type: 'SET_EDIT_MODE', payload: false});
    }

    const onChangeFilter = (e) => {
        setFilter(e.target.value);
    }    

    //filter transactions based on user selected filter
    let filteredTransactions = filterTransactions(transactions, filter);

    //Search for funds with filteredTransactions and add number to name for displaying
    const searchedFunds = allFunds.map(fund => {
        if (filter.length === 0) return fund;
        let transactionArr = filteredTransactions.filter(obj => obj.fund === fund.id);
        return {...fund, name: fund.name + ' - ' + transactionArr.length};
    });

    //filter transactions based on selected fund
    filteredTransactions = filteredTransactions.filter(obj => {
        return obj.fund !== undefined && obj.fund === fund ? true : false;
    }); 

    //filter fund additions based on selected fund
    const filteredFundAdditions = fundAdditions.filter(obj => {
        if (filter.length > 0) return false;
        return obj.fund !== undefined && obj.fund === fund ? true : false;
    });

    const combined = [...filteredTransactions, ...filteredFundAdditions];

    return (
        <div>  
            <Container>
                <ListContainer>
                    { isMobile ? null : <List heading={'Funds'} array={searchedFunds} onClickObj={onClickObj} selected={fund}/> }
                    { editMode 
                        ? <EditList array={allFunds} onClickDropdown={onClickObj} id={fund}/>
                        : <Transactions transactions={combined} heading={fundName} onClickDropdown={onClickObj} objArray={allFunds} id={fund} filter={filter} onChangeFilter={onChangeFilter}/> 
                    }
                </ListContainer>
            </Container>
        </div>
    );
}

export default Funds;