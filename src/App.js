import React from 'react';
import './App.css';

import { useSelector } from 'react-redux';

import Header from './components/Header';
import TopPopup from './components/TopPopup';

import SummaryTables from './containers/SummaryTables';
import AddTransaction from './containers/AddTransaction';
import Categories from './containers/Categories';
import Funds from './containers/Funds';
import Accounts from './containers/Accounts';
import Footer from './containers/Footer';

function App() {
    const page = useSelector(state => state.currentPage);
    const addTransaction = useSelector(state => state.addTransaction);

    const test = () => {
        fetch('http://localhost:3001/api/backup', {credentials: 'include'}).then(res => res.json()).then(data => {
            console.log(data);
        });

        fetch('http://localhost:3001/api/backup', {
            method: 'POST', 
            headers: {'content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({data: 'test'})
        });
    }

    const login = () => {
        fetch('http://localhost:3001/api/login', {
            method: 'POST', 
            headers: {'content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({username: 'test', password: 'test'})
        }).then(res => res.json()).then(data => {
            console.log(data);
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
        });
    }

    const logout = () => {
        fetch('http://localhost:3001/api/logout', {credentials: 'include'}).then(res => res.json()).then(data => {
            console.log(data);
        });
    }

    return (
        <div className="App">
            <button onClick={test}>Test</button>
            <button onClick={login}>Login</button>
            <button onClick={register}>Register</button>
            <button onClick={logout}>Logout</button>
            <Header/>
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
