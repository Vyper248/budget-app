import React from 'react';
import './App.css';

import { useSelector } from 'react-redux';

import Header from './components/Header';
import SummaryTables from './containers/SummaryTables';


function App() {
    const page = useSelector(state => state.currentPage);

    return (
        <div className="App">
            <Header/>
            { page === 'Home' ? <SummaryTables/> : null }
        </div>
    );
}



export default App;
