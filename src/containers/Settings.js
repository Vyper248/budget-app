import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { changeColourScheme } from '../functions';
import { sync } from '../redux/store';

import Container from '../components/Container';
import LabelledInput from '../components/LabelledInput';
import Button from '../components/Button';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3001/' : 'https://budget-app-ap1.herokuapp.com/';

const Settings = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const lastSync = useSelector(state => state.lastSync);
    const fetching = useSelector(state => state.fetching);

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
    const setUser = (value) => dispatch({type: 'SET_USER', payload: value});
    const setMessage = (value) => dispatch({type: 'SET_MESSAGE', payload: value});
    const setFetching = (value) => dispatch({type: 'SET_FETCHING', payload: value});

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
            transactions: state.transactions,
            user: state.user
        };
    });

    const onChangeColorScheme = (e) => {
        let value = e.target.value;
        changeColourScheme(value);
        setColourScheme(value);
    }

    const manualSync = () => {
        sync(backupData, dispatch, true);
    }

    const login = () => {
        dispatch({type: 'SET_MESSAGE', payload: {text: '', type: ''}});
        setFetching(true);
        fetch(url+'api/login', {
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
        fetch(url+'api/register', {
            method: 'POST', 
            headers: {'content-type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({username, password})
        }).then(res => res.json()).then(data => {
            console.log(data);
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

    return (
        <div>
            <Container>
                <h4>Settings</h4>

                <LabelledInput label="Start Date" type="date" value={startDate} onChange={setStartDate} labelWidth='170px'/>
                <LabelledInput label="Currency Symbol" value={currencySymbol} onChange={setCurrencySymbol} labelWidth='170px'/>
                <LabelledInput label="Show Decimals" type="dropdown" value={showDecimals} options={[{value: true, display: 'Yes'}, {value: false, display: 'No'}]} onChange={setShowDecimals} labelWidth='170px'/>
                <LabelledInput label="Pay Period" type="dropdown" value={payPeriodType} onChange={setPayPeriodType} labelWidth='170px' options={[
                    {value: 'monthly', display: 'Monthly'}, 
                    {value: 'fourWeekly', display: '4-Weekly'}, 
                    {value: 'twoWeekly', display: '2-Weekly'}, 
                    {value: 'weekly', display: 'Weekly'}
                ]}/>
                <LabelledInput label="Background Colour" type="dropdown" value={colourScheme} options={[{value: 'dark', display: 'Dark'}, {value: 'black', display: 'Black'}, {value: 'light', display: 'Light'}]} onChange={onChangeColorScheme} labelWidth='170px'/>

                <h4>Syncing</h4>
                <p>This will allow you to upload your data to a server for backup and to sync with other devices.</p>
                <p>Last synced on: {lastSyncDisplay}</p>
                { user === null 
                ?   <div>
                        <LabelledInput label="Username" value={username} onChange={onChangeUsername}/>
                        <LabelledInput label="Password" value={password} onChange={onChangePassword} type="password"/>
                        <Button value="Login" width="120px"inline={true} onClick={login} loading={fetching}/> <Button value="Register" width="120px"inline={true} onClick={register} loading={fetching}/>
                    </div>

                :   <div>
                        <Button value="Sync Now" width="120px"inline={true} onClick={manualSync} loading={fetching}/> <Button value="Logout" width="120px"inline={true} onClick={logout}/>
                    </div>
                }
            </Container>
        </div>
    );
}

export default Settings;