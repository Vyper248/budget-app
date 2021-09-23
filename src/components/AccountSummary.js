import React from 'react';

import { parseCurrency } from '../functions';

import AmountGroup from './AmountGroup';
import Grid from './Grid';

const AccountSummary = ({arr, total}) => {
    return (
        <div>
            <Grid template='repeat(4, 1fr)' width='800px'>
            {
                arr.map(obj => <AmountGroup key={obj.id} title={obj.name} amount={parseCurrency(obj.total)} type='account'/>)
            }
                <AmountGroup title='Total' amount={parseCurrency(total)} type='account'/>
            </Grid>
        </div>
    );
}

export default AccountSummary;