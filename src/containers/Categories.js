import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { filterDeleted } from '../functions';

import ListContainer from '../components/ListContainer';
import List from '../components/List';
import Transactions from '../components/Transactions';
import Container from '../components/Container';
import EditList from './EditList';

const Categories = () => {
    const isMobile = useMediaQuery({ maxWidth: 700 });

    const dispatch = useDispatch();
    const editMode = useSelector(state => state.editMode);
    const allCategories = useSelector(state => filterDeleted(state.categories));
    const categories = allCategories.filter(cat => !cat.hidden);
    const hiddenCategories = allCategories.filter(cat => cat.hidden);
    const firstCategory = categories[0];
    let firstCategoryId = firstCategory !== undefined ? firstCategory.id : undefined;
    let firstCategoryName = firstCategory !== undefined ? firstCategory.name : '';
    
    const transactions = useSelector(state => filterDeleted(state.transactions));
    const [category, setCategory] = useState(firstCategoryId);
    const [categoryName, setCategoryName] = useState(firstCategoryName);

    React.useEffect(() => {
        //If there's no object in the array, then go straight to edit mode
        if (categories.length === 0 && !editMode) {
            dispatch({type: 'SET_EDIT_MODE', payload: true});
        }
    });

    const onClickObj = (id) => () => {
        let category = allCategories.find(obj => obj.id === id);
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
                    { isMobile ? null : <List heading={'Categories'} array={categories} hiddenArray={hiddenCategories} onClickObj={onClickObj} selected={category}/> }
                    { editMode 
                        ? <EditList array={allCategories} onClickDropdown={onClickObj} id={category}/>
                        : <Transactions transactions={filteredTransactions} heading={categoryName} onClickDropdown={onClickObj} objArray={allCategories} id={category}/> 
                    }
                </ListContainer>
            </Container>
        </div>
    );
}

export default Categories;