import React, { useEffect } from 'react';
import './App.css';

import { useSelector, useDispatch } from 'react-redux';

import { sync } from './redux/store';

import Header from './components/Header';
import TopPopup from './components/TopPopup';

import SummaryTables from './containers/SummaryTables';
import AddTransaction from './containers/AddTransaction';
import Categories from './containers/Categories';
import Funds from './containers/Funds';
import Accounts from './containers/Accounts';
import Settings from './containers/Settings';
import Footer from './containers/Footer';

function App() {
    const dispatch = useDispatch();
    const page = useSelector(state => state.currentPage);
    const addTransaction = useSelector(state => state.addTransaction);
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
        sync(backupData, dispatch);
    }, []);

    return (
        <div className="App">
            <Header/>
            { page === 'Home' ? <SummaryTables/> : null }
            { page === 'Categories' ? <Categories/> : null }
            { page === 'Funds' ? <Funds/> : null }
            { page === 'Accounts' ? <Accounts/> : null }
            { page === 'Settings' ? <Settings/> : null }
            { addTransaction ? <TopPopup><AddTransaction/></TopPopup> : null }
            <Footer/>
        </div>
    );
}



export default App;
