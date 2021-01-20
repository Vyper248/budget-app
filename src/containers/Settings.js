import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { changeColourScheme } from '../functions';
import { sync } from '../redux/store';

import Container from '../components/Container';
import LabelledInput from '../components/LabelledInput';
import Button from '../components/Button';

const Settings = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const lastSync = useSelector(state => state.lastSync);

    const payPeriodType = useSelector(state => state.general.payPeriodType);
    const currencySymbol = useSelector(state => state.general.currencySymbol);
    const showDecimals = useSelector(state => state.general.showDecimals);
    const startDate = useSelector(state => state.general.startDate);
    const colourScheme = useSelector(state => state.general.colourScheme);

    const setPayPeriodType = (e) => dispatch({type: 'SET_PAY_PERIOD_TYPE', payload: e.target.value});
    const setCurrencySymbol = (e) => dispatch({type: 'SET_CURRENCY_SYMBOL', payload: e.target.value});
    const setShowDecimals = (e) => {
        let value = e.target.value === 'false' ? false : true;
        dispatch({type: 'SET_SHOW_DECIMALS', payload: value});
    }
    const setStartDate = (e) => dispatch({type: 'SET_START_DATE', payload: e.target.value});
    const setColourScheme = (value) => dispatch({type: 'SET_COLOUR_SCHEME', payload: value});

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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

    const onChangeColorScheme = (e) => {
        let value = e.target.value;
        changeColourScheme(value);
        setColourScheme(value);
    }

    const manualSync = () => {
        sync(backupData, dispatch);
    }

    const login = () => {
        fetch('http://localhost:3001/api/login', {
            method: 'POST', 
            headers: {'content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({username, password})
        }).then(res => res.json()).then(data => {
            if (data.status === 'success') {
                setUsername('');
                setPassword('');
                dispatch({type: 'SET_USER', payload: data.user});
            } else {
                console.log(data);
            }
        }).catch(err => {
            console.log(err.message);
        });
    }

    const register = () => {
        if (username.length < 3 || password.length < 5) return;

        fetch('http://localhost:3001/api/register', {
            method: 'POST', 
            headers: {'content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({username, password})
        }).then(res => res.json()).then(data => {
            console.log(data);
            setUsername('');
            setPassword('');
            if (data.status === 'success') dispatch({type: 'SET_USER', payload: data.user});
        }).catch(err => {
            console.log(err.message);
            dispatch({type: 'SET_USER', payload: null});
        });
    }

    const logout = () => {
        fetch('http://localhost:3001/api/logout', {credentials: 'include'}).then(res => res.json()).then(data => {
            console.log(data);
            dispatch({type: 'SET_USER', payload: null});
        }).catch(err => {
            console.log(err.message);
            dispatch({type: 'SET_USER', payload: null});
        });
    }

    const onChangeUsername = (e) => setUsername(e.target.value);
    const onChangePassword = (e) => setPassword(e.target.value);

    let lastSyncDate = lastSync.toFixed(0);
    let lastSyncDisplay = `${lastSyncDate.slice(6,8)}/${lastSyncDate.slice(4,6)}/${lastSyncDate.slice(0,4)} at ${lastSyncDate.slice(8,10)}:${lastSyncDate.slice(10,12)}`;

    return (
        <div>
            <Container>
                <h4>Settings</h4>

                <LabelledInput label="Start Date" type="date" value={startDate} onChange={setStartDate} labelWidth='150px'/>
                <LabelledInput label="Currency Symbol" value={currencySymbol} onChange={setCurrencySymbol} labelWidth='150px'/>
                <LabelledInput label="Show Decimals" type="dropdown" value={showDecimals} options={[{value: true, display: 'Yes'}, {value: false, display: 'No'}]} onChange={setShowDecimals} labelWidth='150px'/>
                <LabelledInput label="Pay Period" type="dropdown" value={payPeriodType} onChange={setPayPeriodType} labelWidth='150px' options={[
                    {value: 'monthly', display: 'Monthly'}, 
                    {value: 'fourWeekly', display: '4-Weekly'}, 
                    {value: 'twoWeekly', display: '2-Weekly'}, 
                    {value: 'weekly', display: 'Weekly'}
                ]}/>
                <LabelledInput label="Colour Scheme" type="dropdown" value={colourScheme} options={[{value: 'dark', display: 'Dark'}, {value: 'black', display: 'Black'}, {value: 'light', display: 'Light'}]} onChange={onChangeColorScheme} labelWidth='150px'/>

                <h4>Syncing</h4>
                <p>This will allow you to upload your data to a server for backup and to sync with other devices.</p>
                <p>Last synced on: {lastSyncDisplay}</p>
                { user === null 
                ?   <div>
                        <LabelledInput label="Username" value={username} onChange={onChangeUsername}/>
                        <LabelledInput label="Password" value={password} onChange={onChangePassword} type="password"/>
                        <Button value="Login" width="120px"inline={true} onClick={login}/> <Button value="Register" width="120px"inline={true} onClick={register}/>
                    </div>

                :   <div>
                        <Button value="Sync Now" width="120px"inline={true} onClick={manualSync}/> <Button value="Logout" width="120px"inline={true} onClick={logout}/>
                    </div>
                }
            </Container>
        </div>
    );
}

export default Settings;