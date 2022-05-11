import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { filterDeleted, filterTransactions } from '../functions';

import ListContainer from '../components/ListContainer';
import List from '../components/List';
import Transactions from '../components/Transactions';
import Container from '../components/Container';
import EditList from './EditList';

const Accounts = () => {
    const isMobile = useMediaQuery({ maxWidth: 700 });

    const dispatch = useDispatch();
    const editMode = useSelector(state => state.editMode);
    const allAccounts = useSelector(state => filterDeleted(state.accounts));
    const accounts = allAccounts.filter(account => !account.closed);
    const firstAccount = accounts[0];
    let firstAccountId = firstAccount !== undefined ? firstAccount.id : undefined;
    let firstAccountName = firstAccount !== undefined ? firstAccount.name : '';
    
    const transactions = useSelector(state => filterDeleted(state.transactions));
    const [account, setAccount] = useState(firstAccountId);
    const [accountName, setAccountName] = useState(firstAccountName);

    const [filter, setFilter] = useState('');

    const setSelectedAccount = (id) => dispatch({type: 'SET_SELECTED_ACCOUNT', payload: id});

    React.useEffect(() => {
        //If there's no object in the array, then go straight to edit mode
        if (allAccounts.length === 0 && !editMode) {
            dispatch({type: 'SET_EDIT_MODE', payload: true});
        } else {
            setSelectedAccount(firstAccountId);
        }
    }, []);

    const onClickObj = (id) => () => {
        let account = allAccounts.find(obj => obj.id === id);
        setAccount(id);
        setSelectedAccount(id);
        setAccountName(account.name);
        dispatch({type: 'SET_EDIT_MODE', payload: false});
    }

    const onChangeFilter = (e) => {
        setFilter(e.target.value);
    }    

    //filter transactions based on user selected filter
    let filteredTransactions = filterTransactions(transactions, filter);

    //Search for accounts with filteredTransactions and add number to name for displaying
    const searchedAccounts = allAccounts.map(account => {
        if (filter.length === 0) return account;

        let transactionArr = filteredTransactions.filter(obj => obj.account === account.id);
        return {...account, name: account.name + ' - ' + transactionArr.length};
    });

    //filter transactions based on selected account
    filteredTransactions = filteredTransactions.filter(obj => {
        if (obj.from !== undefined && obj.to !== undefined && (obj.from === account || obj.to === account)) return true; 
        return obj.account !== undefined && obj.account === account ? true : false;
    });   

    return (
        <div>  
            <Container>
                <ListContainer>
                    { isMobile ? null : <List heading={'Accounts'} array={searchedAccounts} onClickObj={onClickObj} selected={account}/> }
                    { editMode 
                        ? <EditList array={allAccounts} vertical={true} onClickDropdown={onClickObj} id={account}/>
                        : <Transactions transactions={filteredTransactions} heading={accountName} id={account} onClickDropdown={onClickObj} objArray={allAccounts} filter={filter} onChangeFilter={onChangeFilter}/> 
                    }
                </ListContainer>
            </Container>
        </div>
    );
}

export default Accounts;