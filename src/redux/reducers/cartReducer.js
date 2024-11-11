import {
    GET_CART_REQUEST,
    GET_CART_SUCCESS,
    GET_CART_FAILURE,
    ADD_TO_CART,
    REMOVE_FROM_CART,
    CLEAR_CART,
    UPDATE_CART_QUANTITY
} from '../constants/cartConstants';

const initialState = {
    loading: false,
    items: [],
    error: null
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CART_REQUEST:
            return { ...state, loading: true };
        case GET_CART_SUCCESS:
            return { ...state, loading: false, items: action.payload };
        case GET_CART_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case ADD_TO_CART:
            return { ...state, items: [...state.items, action.payload] };
        case REMOVE_FROM_CART:
            return { ...state, items: state.items.filter(item => item._id !== action.payload) };
        case CLEAR_CART:
            return { ...state, items: [] };
        case UPDATE_CART_QUANTITY:
            return {
                ...state,
                items: state.items.map(item =>
                    item._id === action.payload.itemId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            };
        default:
            return state;
    }
};
