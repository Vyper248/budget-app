import React from 'react';
import './App.css';

import { useSelector } from 'react-redux';

import Header from './components/Header';
import SummaryTables from './containers/SummaryTables';
import AddTransaction from './containers/AddTransaction';


function App() {
    const page = useSelector(state => state.currentPage);
    const addTransaction = useSelector(state => state.addTransaction);

    return (
        <div className="App">
            <Header/>
            { page === 'Home' ? <SummaryTables/> : null }
            { addTransaction ? <AddTransaction/> : null }
        </div>
    );
}



export default App;
