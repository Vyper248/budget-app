import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { sync } from '../redux/store';

import Container from '../components/Container';
import LabelledInput from '../components/LabelledInput';
import Button from '../components/Button';

const Settings = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

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

    return (
        <div>
            <Container>
                <h4>Settings</h4>

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