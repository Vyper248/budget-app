import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { filterDeleted, filterTransactions } from '../functions';

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
    const firstCategory = categories[0];
    let firstCategoryId = firstCategory !== undefined ? firstCategory.id : undefined;
    let firstCategoryName = firstCategory !== undefined ? firstCategory.name : '';
    
    const transactions = useSelector(state => filterDeleted(state.transactions));
    const [category, setCategory] = useState(firstCategoryId);
    const [categoryName, setCategoryName] = useState(firstCategoryName);

    const [filter, setFilter] = useState('');

    React.useEffect(() => {
        //If there's no object in the array, then go straight to edit mode
        if (allCategories.length === 0 && !editMode) {
            dispatch({type: 'SET_EDIT_MODE', payload: true});
        }
    });

    const onClickObj = (id) => () => {
        let category = allCategories.find(obj => obj.id === id);
        setCategory(id);
        setCategoryName(category.name);
        dispatch({type: 'SET_EDIT_MODE', payload: false});
    }

    const onChangeFilter = (e) => {
        setFilter(e.target.value);
    }    

    //filter transactions based on user selected filter
    let filteredTransactions = filterTransactions(transactions, filter);

    //Search for categories with filteredTransactions and add number to name for displaying
    const searchedCategories = allCategories.map(category => {
        if (filter.length === 0) return category;
        let transactionArr = filteredTransactions.filter(obj => obj.category === category.id);
        return {...category, name: category.name + ' - ' + transactionArr.length};
    });

    //filter transactions based on selected category
    filteredTransactions = filteredTransactions.filter(obj => {
        return obj.category !== undefined && obj.category === category ? true : false;
    });

    return (
        <div>  
            <Container>
                <ListContainer>
                    { isMobile ? null : <List heading={'Categories'} array={searchedCategories} onClickObj={onClickObj} selected={category}/> }
                    { editMode 
                        ? <EditList array={allCategories} onClickDropdown={onClickObj} id={category}/>
                        : <Transactions transactions={filteredTransactions} heading={categoryName} onClickDropdown={onClickObj} objArray={allCategories} id={category} filter={filter} onChangeFilter={onChangeFilter}/> 
                    }
                </ListContainer>
            </Container>
        </div>
    );
}

export default Categories;