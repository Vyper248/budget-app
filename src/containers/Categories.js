import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ListContainer from '../components/ListContainer';
import List from '../components/List';
import Transactions from '../components/Transactions';
import Container from '../components/Container';
import EditList from './EditList';

const Categories = () => {
    const dispatch = useDispatch();
    const editMode = useSelector(state => state.editMode);
    const categories = useSelector(state => state.categories);
    const firstCategory = categories[0];
    let firstCategoryId = firstCategory !== undefined ? firstCategory.id : undefined;
    let firstCategoryName = firstCategory !== undefined ? firstCategory.name : '';
    
    const transactions = useSelector(state => state.transactions);
    const [category, setCategory] = useState(firstCategoryId);
    const [categoryName, setCategoryName] = useState(firstCategoryName);

    const onClickObj = (id) => () => {
        let category = categories.find(obj => obj.id === id);
        setCategory(id);
        setCategoryName(category.name);
        dispatch({type: 'SET_EDIT_MODE', payload: false});
    }

    const filteredTransactions = transactions.filter(obj => {
        return obj.category !== undefined && obj.category === category ? true : false;
    });    

    return (
        <div>  
            <Container>
                <ListContainer>
                    <List heading={'Categories'} array={categories} onClickObj={onClickObj} selected={category}/>
                    { editMode 
                        ? <EditList array={categories}/>
                        : <Transactions transactions={filteredTransactions} heading={categoryName}/> 
                    }
                </ListContainer>
            </Container>
        </div>
    );
}

export default Categories;