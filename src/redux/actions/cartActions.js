import axios from '../../utils/api';
import {
    GET_CART_REQUEST,
    GET_CART_SUCCESS,
    GET_CART_FAILURE,
    ADD_TO_CART,
    REMOVE_FROM_CART,
    CLEAR_CART,
    UPDATE_CART_QUANTITY
} from '../constants/cartConstants';

export const getCart = (userId) => async (dispatch) => {
    dispatch({ type: GET_CART_REQUEST });
    try {
      const { data } = await axios.get(`/api/cart/${userId}`);
      if (data.cart && Array.isArray(data.cart.items)) {
      
        dispatch({ type: GET_CART_SUCCESS, payload: data.cart.items });
      } else {
        throw new Error('Data.cart.items is not an array');
      }
    } catch (error) {
      dispatch({ type: GET_CART_FAILURE, payload: error.message });
    }
  };
  

  export const addToCart = (item, userId, quantity = 1) => async (dispatch) => {
    if (!item.service || !item.item) {
      console.error("Cart items must include a valid service and item.");
      return;
    }
  
    try {
      await axios.post('/api/cart/add', { userId, ...item, quantity });
      dispatch({ type: ADD_TO_CART, payload: { ...item, quantity } });
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };
  


export const updateQuantity = (userId, itemId, quantity) => async (dispatch) => {
    try {
        await axios.put('/api/cart/update-quantity', { userId, itemId, quantity });
        dispatch({ type: UPDATE_CART_QUANTITY, payload: { itemId, quantity } });
    } catch (error) {
        console.error("Failed to update quantity:", error);
    }
};

export const removeFromCart = (userId, itemId) => async (dispatch) => {
    try {
        await axios.delete('/api/cart/remove', { data: { userId, itemId } });
        dispatch({ type: REMOVE_FROM_CART, payload: itemId });
    } catch (error) {
        console.error("Failed to remove item from cart:", error);
    }
};

export const clearCart = (userId) => async (dispatch) => {
    try {
        await axios.delete(`/api/cart/clear/${userId}`);
        dispatch({ type: CLEAR_CART });
    } catch (error) {
        console.error("Failed to clear cart:", error);
    }
};
