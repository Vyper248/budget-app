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

    const manualSync = () => {
        sync(backupData, dispatch);
    }

    const login = () => {
        fetch('http://localhost:3001/api/login', {
            method: 'POST', 
            headers: {'content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({username: 'test', password: 'test'})
        }).then(res => res.json()).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err.message);
        });
    }

    const register = () => {
        fetch('http://localhost:3001/api/register', {
            method: 'POST', 
            headers: {'content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({username: 'test', password: 'test'})
        }).then(res => res.json()).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err.message);
        });
    }

    const logout = () => {
        fetch('http://localhost:3001/api/logout', {credentials: 'include'}).then(res => res.json()).then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err.message);
        });
    }

    return (
        <div className="App">
            <Header/>
            <button onClick={manualSync}>Sync</button>
            <button onClick={login}>Login</button>
            <button onClick={register}>Register</button>
            <button onClick={logout}>Logout</button>
            { page === 'Home' ? <SummaryTables/> : null }
            { page === 'Categories' ? <Categories/> : null }
            { page === 'Funds' ? <Funds/> : null }
            { page === 'Accounts' ? <Accounts/> : null }
            { addTransaction ? <TopPopup><AddTransaction/></TopPopup> : null }
            <Footer/>
        </div>
    );
}



export default App;
