import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { filterDeleted } from '../functions';

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

    React.useEffect(() => {
        //If there's no object in the array, then go straight to edit mode
        if (accounts.length === 0 && !editMode) {
            dispatch({type: 'SET_EDIT_MODE', payload: true});
        }
    });

    const onClickObj = (id) => () => {
        let account = accounts.find(obj => obj.id === id);
        setAccount(id);
        setAccountName(account.name);
        dispatch({type: 'SET_EDIT_MODE', payload: false});
    }

    const filteredTransactions = transactions.filter(obj => {
        if (obj.from !== undefined && obj.to !== undefined && (obj.from === account || obj.to === account)) return true; 
        return obj.account !== undefined && obj.account === account ? true : false;
    });   

    return (
        <div>  
            <Container>
                <ListContainer>
                    { isMobile ? null : <List heading={'Accounts'} array={accounts} onClickObj={onClickObj} selected={account}/> }
                    { editMode 
                        ? <EditList array={allAccounts} vertical={true} onClickDropdown={onClickObj} id={account}/>
                        : <Transactions transactions={filteredTransactions} heading={accountName} id={account} onClickDropdown={onClickObj} objArray={accounts}/> 
                    }
                </ListContainer>
            </Container>
        </div>
    );
}

export default Accounts;