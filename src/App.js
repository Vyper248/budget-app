import React, { useEffect } from 'react';
import './App.css';

import { useSelector, useDispatch } from 'react-redux';

import { sync } from './redux/store';

import Header from './components/Header';
import TopPopup from './components/TopPopup';
import MessagePopup from './components/MessagePopup';

import SummaryTables from './containers/SummaryTables';
import AddTransaction from './containers/AddTransaction';
import Categories from './containers/Categories';
import Funds from './containers/Funds';
import Accounts from './containers/Accounts';
import Settings from './containers/Settings';
import Tools from './containers/Tools';
import Footer from './containers/Footer';

function App() {
    const dispatch = useDispatch();
    const page = useSelector(state => state.currentPage);
    const addTransaction = useSelector(state => state.addTransaction);
    const user = useSelector(state => state.user);
    const backupData = useSelector(state => {
        return {
            general: state.general,
            accounts: state.accounts,
            categories: state.categories,
            budgets: state.budgets,
            funds: state.funds,
            fundAdditions: state.fundAdditions,
            transactions: state.transactions
        };
    });

    //sync with server when starting app
    useEffect(() => {
        if (user !== null) sync(backupData, dispatch);
    }, []);

    return (
        <div className="App">
            <Header/>
            <div style={{height: '40px'}}></div>
            <MessagePopup/>
            { page === 'Home' ? <SummaryTables/> : null }
            { page === 'Categories' ? <Categories/> : null }
            { page === 'Funds' ? <Funds/> : null }
            { page === 'Accounts' ? <Accounts/> : null }
            { page === 'Settings' ? <Settings/> : null }
            { page === 'Tools' ? <Tools/> : null }
            { addTransaction ? <TopPopup><AddTransaction/></TopPopup> : null }
            <Footer/>
        </div>
    );
}



export default App;
