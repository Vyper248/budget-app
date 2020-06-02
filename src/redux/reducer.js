const initialState = {

};

export const reducer = (state = initialState, action) => {
    let value = action.payload;
    switch(action.type) {
        case 'SET_SOMETHING': return {...state, something: value};
        default: return state;
    }
}