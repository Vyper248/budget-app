import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { changeColourScheme, formatDate } from '../functions';
import { sync } from '../redux/store';

import Container from '../components/Container';
import LabelledInput from '../components/LabelledInput';
import Button from '../components/Button';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:8888/.netlify/functions/' : 'https://budget-app-serverless.netlify.app/.netlify/functions/';

const Settings = () => {
    const isMobile = useMediaQuery({ maxWidth: 700 });

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const lastSync = useSelector(state => state.lastSync);
    const fetching = useSelector(state => state.fetching);

    const payPeriodType = useSelector(state => state.general.payPeriodType);
    const currencySymbol = useSelector(state => state.general.currencySymbol);
    const showDecimals = useSelector(state => state.general.showDecimals);
    const startDate = useSelector(state => state.general.startDate);
    const colourScheme = useSelector(state => state.general.colourScheme);
    const swapSummaries = useSelector(state => state.general.swapSummaries);
    const periodsToDisplay = useSelector(state => state.general.periodsToDisplay);
    const reverseSummaryTable = useSelector(state => state.general.reverseSummaryTable);
    const displayMonths = useSelector(state => state.general.displayMonths);
    const displayIncomeTotal = useSelector(state => state.general.displayIncomeTotal);
    const displayExpenseTotal = useSelector(state => state.general.displayExpenseTotal);
    const showChart = useSelector(state => state.general.showChart);

    const setPayPeriodType = (e) => dispatch({type: 'SET_PAY_PERIOD_TYPE', payload: e.target.value});
    const setCurrencySymbol = (e) => dispatch({type: 'SET_CURRENCY_SYMBOL', payload: e.target.value});
    const setShowDecimals = (e) => {
        let value = e.target.value === 'false' ? false : true;
        dispatch({type: 'SET_SHOW_DECIMALS', payload: value});
    }
    const setStartDate = (e) => dispatch({type: 'SET_START_DATE', payload: e.target.value});
    const setColourScheme = (value) => dispatch({type: 'SET_COLOUR_SCHEME', payload: value});
    const setSwapSummaries = (e) => dispatch({type: 'SET_SWAP_SUMMARIES', payload: e.target.value === 'false' ? false : true});
    const setPeriodsToDisplay = (e) => dispatch({type: 'SET_PERIODS_TO_DISPLAY', payload: parseInt(e.target.value)});
    const setReverseSummaryTable = (e) => dispatch({type: 'SET_REVERSE_SUMMARY_TABLE', payload: e.target.value === 'false' ? false : true});
    const setDisplayMonths = (e) => dispatch({type: 'SET_DISPLAY_MONTHS', payload: e.target.value === 'false' ? false : true});
    const setDisplayIncomeTotal = (e) => dispatch({type: 'SET_DISPLAY_INCOME_TOTAL', payload: e.target.value === 'false' ? false : true});
    const setDisplayExpenseTotal = (e) => dispatch({type: 'SET_DISPLAY_EXPENSE_TOTAL', payload: e.target.value === 'false' ? false : true});
    const setShowChart = (e) => dispatch({type: 'SET_SHOW_CHART', payload: e.target.value === 'false' ? false : true});

    const setUser = (value) => dispatch({type: 'SET_USER', payload: value});
    const setMessage = (value) => dispatch({type: 'SET_MESSAGE', payload: value});
    const setFetching = (value) => dispatch({type: 'SET_FETCHING', payload: value});
    const importBackup = (value) => dispatch({type: 'IMPORT_BACKUP', payload: value});

    const [importData, setImportData] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [restoreMessage, setRestoreMessage] = useState('');
    const fileInput = useRef(null);


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

    const downloadJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));

        const link = document.createElement("a");
        link.setAttribute("href", dataStr);
        link.setAttribute("download", `Budget Backup - ${formatDate(new Date(),'yyyy-MM-dd')}.json`);
        link.click();
    }

    const onFileChange = (e) => {
        const file = e.target.files[0];
        if (file === undefined) return;

        if (file.type.match('application/json')) {
            const reader = new FileReader();

            reader.onload = (e) => {
                let text = reader.result;
                let obj = JSON.parse(text);

                let newObj = {};

                if (obj.general !== undefined) newObj.general = obj.general;
                if (obj.accounts !== undefined) newObj.accounts = obj.accounts;
                if (obj.categories !== undefined) newObj.categories = obj.categories;
                if (obj.budgets !== undefined) newObj.budgets = obj.budgets;
                if (obj.funds !== undefined) newObj.funds = obj.funds;
                if (obj.fundAdditions !== undefined) newObj.fundAdditions = obj.fundAdditions;
                if (obj.transactions !== undefined) newObj.transactions = obj.transactions;
                
                setImportData(newObj);
            }

            reader.readAsText(file);
        } else {
            setImportData(null);
        }
    }

    const onImportBackup = () => {
        importBackup(importData);
        setImportData(null);
        setRestoreMessage('Data Restored.')
        fileInput.current.value = '';
    }

    const onChangeColorScheme = (e) => {
        let value = e.target.value;
        changeColourScheme(value);
        setColourScheme(value);
    }

    const manualSync = () => {
        const currentState = {...backupData, user};
        sync(currentState, dispatch, true);
    }

    const login = () => {
        dispatch({type: 'SET_MESSAGE', payload: {text: '', type: ''}});
        setFetching(true);
        fetch(url+'login', {
            method: 'POST', 
            headers: {'content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({username, password})
        }).then(res => res.json()).then(data => {
            setFetching(false);
            if (data.status === 'success') {
                setUsername('');
                setPassword('');
                setUser(data.user);
            } else {
                if (data.type === 'logout') setUser(null);
                setMessage({text: data.message, type: 'error'});
            }
        }).catch(err => {
            console.log(err.message);
            setMessage({text: 'Failed to contact server.', type: 'error'});
            setFetching(false);
        });
    }

    const register = () => {
        if (username.length < 3) {
            setMessage({text: 'Username should be 3 or more characters', type: 'error'});
            return;
        }

        if (password.length < 5) {
            setMessage({text: 'Password should be 5 or more characters', type: 'error'});
            return;
        }

        setMessage({text: '', type: ''});
        setFetching(true);
        fetch(url+'register', {
            method: 'POST', 
            headers: {'content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({username, password})
        }).then(res => res.json()).then(data => {
            setUsername('');
            setPassword('');
            setFetching(false);
            if (data.status === 'success') dispatch({type: 'SET_USER', payload: data.user});
            else setMessage({text: data.message, type: 'error'});
        }).catch(err => {
            console.log(err.message);
            setUser(null);
            setMessage({text: 'Failed to contact server. Please try again.', type: 'error'});
            setFetching(false);
        });
    }

    const logout = () => {
        setUser(null);
    }

    const onChangeUsername = (e) => setUsername(e.target.value);
    const onChangePassword = (e) => setPassword(e.target.value);

    let lastSyncDate = lastSync.toFixed(0);
    let lastSyncDisplay = `${lastSyncDate.slice(6,8)}/${lastSyncDate.slice(4,6)}/${lastSyncDate.slice(0,4)} at ${lastSyncDate.slice(8,10)}:${lastSyncDate.slice(10,12)}`;
    if (lastSync === 0 || lastSync === undefined) lastSyncDisplay = 'Never';

    const labelWidth = '200px';

    return (
        <div>
            <Container paddingBottom='100px'>
                <h4>Settings</h4>

                <LabelledInput label="Start Date" type="date" value={startDate} onChange={setStartDate} labelWidth={labelWidth}/>
                <LabelledInput label="Currency Symbol" value={currencySymbol} onChange={setCurrencySymbol} labelWidth={labelWidth}/>
                <LabelledInput label="Show Decimals" type="dropdown" value={showDecimals} options={[{value: true, display: 'Yes'}, {value: false, display: 'No'}]} onChange={setShowDecimals} labelWidth={labelWidth}/>
                <LabelledInput label="Pay Period" type="dropdown" value={payPeriodType} onChange={setPayPeriodType} labelWidth={labelWidth} options={[
                    {value: 'monthly', display: 'Monthly'}, 
                    {value: 'fourWeekly', display: '4-Weekly'}, 
                    {value: 'twoWeekly', display: '2-Weekly'}, 
                    {value: 'weekly', display: 'Weekly'}
                ]}/>
                <LabelledInput label="Periods to Display" type="number" value={periodsToDisplay} onChange={setPeriodsToDisplay} labelWidth={labelWidth}/>
                { isMobile ? null : <LabelledInput label="Swap Summaries" type="dropdown" value={swapSummaries} options={[{value: true, display: 'Yes'}, {value: false, display: 'No'}]} onChange={setSwapSummaries} labelWidth={labelWidth}/> }
                { isMobile ? null : <LabelledInput label="Reverse Summary Table" type="dropdown" value={reverseSummaryTable} options={[{value: true, display: 'Yes'}, {value: false, display: 'No'}]} onChange={setReverseSummaryTable} labelWidth={labelWidth}/> }
                { isMobile ? null : <LabelledInput label="Display Months" type="dropdown" value={displayMonths} options={[{value: true, display: 'Yes'}, {value: false, display: 'No'}]} onChange={setDisplayMonths} labelWidth={labelWidth}/> }
                { isMobile ? null : <LabelledInput label="Show Income Total" type="dropdown" value={displayIncomeTotal} options={[{value: true, display: 'Yes'}, {value: false, display: 'No'}]} onChange={setDisplayIncomeTotal} labelWidth={labelWidth}/> }
                { isMobile ? null : <LabelledInput label="Show Expense Total" type="dropdown" value={displayExpenseTotal} options={[{value: true, display: 'Yes'}, {value: false, display: 'No'}]} onChange={setDisplayExpenseTotal} labelWidth={labelWidth}/> }
                { isMobile ? null : <LabelledInput label="Show Summary Chart" type="dropdown" value={showChart} options={[{value: true, display: 'Yes'}, {value: false, display: 'No'}]} onChange={setShowChart} labelWidth={labelWidth}/> }
                <LabelledInput label="Background Colour" type="dropdown" value={colourScheme} options={[{value: 'dark', display: 'Dark'}, {value: 'black', display: 'Black'}, {value: 'light', display: 'Light'}]} onChange={onChangeColorScheme} labelWidth={labelWidth}/>

                <h4>Backup</h4>
                <p>This will download a backup of all data as a JSON file, and allow you to restore from a backup if needed.</p>
                <Button value="Backup" width="120px" inline={true} onClick={downloadJson}/>

                <h4>Restore</h4>
                <p>Use this to restore from a previously taken backup JSON file. This will overwrite any current data and replace it with the backup data, including on the server if logged in.</p>
                <p style={{color: '#0F0'}}>{restoreMessage}</p>
                <input type="file" onChange={onFileChange} ref={fileInput}/>
                { importData !== null ? <Button value="Import" width="120px" inline={true} onClick={onImportBackup}/> : null }

                <h4>Syncing</h4>
                <p>This will allow you to upload your data to a server for backup and to sync with other devices.</p>
                <p>Last synced on: {lastSyncDisplay}</p>
                { user === null 
                ?   <div>
                        <LabelledInput label="Username" value={username} onChange={onChangeUsername}/>
                        <LabelledInput label="Password" value={password} onChange={onChangePassword} type="password"/>
                        <Button value="Login" width="120px" inline={true} onClick={login} loading={fetching}/> 
                        <Button value="Register" width="120px" inline={true} onClick={register} loading={fetching}/>
                    </div>

                :   <div>
                        <Button value="Sync Now" width="120px" inline={true} onClick={manualSync} loading={fetching}/> 
                        <Button value="Logout" width="120px" inline={true} onClick={logout}/>
                    </div>
                }
            </Container>
        </div>
    );
}

export default Settings;