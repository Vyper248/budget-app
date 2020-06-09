import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ListContainer from '../components/ListContainer';
import List from '../components/List';
import Transactions from '../components/Transactions';
import Container from '../components/Container';

const Categories = () => {
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
    }

    const onClickEdit = () => {
        
    }

    const filteredTransactions = transactions.filter(obj => {
        return obj.category !== undefined && obj.category === category ? true : false;
    });

    return (
        <div>  
            <Container>
                <ListContainer>
                    <List heading={'Categories'} array={categories} onClickObj={onClickObj} onClickEdit={onClickEdit} selected={category}/>
                    <Transactions transactions={filteredTransactions} heading={categoryName}/>
                </ListContainer>
            </Container>
        </div>
    );
}

export default Categories;