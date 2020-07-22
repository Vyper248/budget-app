import React from 'react';
import { useSelector } from 'react-redux';

import Input from './Input';

import { capitalize } from '../functions';

const EditInput = ({label, defaultValue, value, onChange, width=undefined}) => {
    const categories = useSelector(state => state.categories);

    let itemWidth = '100px';
    if (width === undefined && label === 'description') itemWidth = '300px';
    else if (width !== undefined) itemWidth = width;

    if (label === 'category') return <Input type="dropdown" onChange={onChange} value={value !== undefined ? value : defaultValue} placeholder={label} options={categories.map(obj => ({value: obj.id, display: obj.name}))} width={itemWidth}/>;
    if (typeof defaultValue === 'number') return <Input type="number" onChange={onChange} value={value !== undefined ? value : defaultValue} placeholder={label} width={itemWidth}/>;
    if (typeof defaultValue === 'string' && defaultValue === 'date') return <Input type="date" onChange={onChange} value={value !== undefined ? value : defaultValue} placeholder={label} width={itemWidth}/>;
    if (typeof defaultValue === 'string' && defaultValue.includes(',') > 0) return <Input type="dropdown" onChange={onChange} value={value !== undefined ? value : defaultValue} placeholder={label} options={defaultValue.split(',').map(obj => ({value: obj, display: capitalize(obj)}))} width={itemWidth}/>;
    if (typeof defaultValue === 'string') return <Input onChange={onChange} value={value !== undefined ? value : defaultValue} placeholder={label} width={itemWidth}/>;
    if (typeof defaultValue === 'boolean') return <Input type="dropdown" onChange={onChange} value={value !== undefined ? value : defaultValue} placeholder={label} options={[{display: 'Yes', value: true}, {display: 'No', value: false}]} width={itemWidth}/>;
}

export default EditInput;