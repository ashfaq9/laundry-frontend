// orderActions.js
import axios from '../../utils/api';
import {
    GET_CART_REQUEST,
    GET_CART_SUCCESS,
    GET_CART_FAILURE,
    UPDATE_PICKUP_DATE,
    UPDATE_LOCATION,
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
    GET_ORDERS_REQUEST,
    GET_ORDERS_SUCCESS,
    GET_ORDERS_FAILURE,
    CANCEL_ORDER_REQUEST,
    CANCEL_ORDER_SUCCESS,
    CANCEL_ORDER_FAIL,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAIL,
} from '../constants/orderConstants';

// Get Cart
export const getCart = (userId) => async (dispatch) => {
    dispatch({ type: GET_CART_REQUEST });
    try {
        const { data } = await axios.get(`/api/cart/${userId}`);
        dispatch({ type: GET_CART_SUCCESS, payload: data.cart.items });
    } catch (error) {
        dispatch({ type: GET_CART_FAILURE, payload: error.message });
    }
};

// Update Pickup Date
export const updatePickupDate = (date) => (dispatch) => {
    dispatch({
        type: UPDATE_PICKUP_DATE,
        payload: date,
    });
};

// Update Location
export const updateLocation = (locationData) => (dispatch) => {
    dispatch({
        type: UPDATE_LOCATION,
        payload: locationData,
    });
};

// Create Order

const handleErrorResponse = (error) => 
    error.response && error.response.data.message
        ? error.response.data.message
        : error.message;
        export const createOrder = (orderData) => async (dispatch) => {
            dispatch({ type: CREATE_ORDER_REQUEST });
            try {
                const { data } = await axios.post('/api/orders', orderData, { headers: { 'Content-Type': 'application/json' } });
                dispatch({ type: CREATE_ORDER_SUCCESS, payload: data.order });
                return { success: true, order: data.order };
            } catch (error) {
                dispatch({ type: CREATE_ORDER_FAILURE, payload: handleErrorResponse(error) });
                return { success: false };
            }
        };


// Redux action to fetch orders by user
export const getOrdersByUser = (userId) => async (dispatch) => {
    dispatch({ type: GET_ORDERS_REQUEST });
    try {
        const { data } = await axios.get(`/api/orders/user/${userId}`);
        dispatch({ type: GET_ORDERS_SUCCESS, payload: data });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            dispatch({ 
                type: GET_ORDERS_FAILURE, 
                payload: 'No orders found for this user.' 
            });
        } else {
            dispatch({ 
                type: GET_ORDERS_FAILURE, 
                payload: error.response?.data?.message || 'Failed to fetch orders.' 
            });
        }
    }
};

export const cancelOrder = (orderId) => async (dispatch) => {
    try {
        dispatch({ type: CANCEL_ORDER_REQUEST });

        const { data } = await axios.delete(`/api/orders/${orderId}`); // Make sure the endpoint is correct

        dispatch({
            type: CANCEL_ORDER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: CANCEL_ORDER_FAIL,
            payload: error.response && error.response.data.error ? error.response.data.error : error.message,
        });
        // Optionally throw error to be caught in the component
        throw new Error(error.response && error.response.data.error ? error.response.data.error : error.message);
    }
};

export const getOrdersByStatus = () => async (dispatch) => {
    dispatch({ type: GET_ORDERS_REQUEST });
    try {
        const { data } = await axios.get(`/api/orders`);
        console.log('API Response:', data);
        dispatch({ type: GET_ORDERS_SUCCESS, payload: data });
console.log('Dispatching GET_ORDERS_SUCCESS with payload:', data.orders);

    } catch (error) {
        dispatch({
            type: GET_ORDERS_FAILURE,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};



export const updateOrderStatus = (orderId, status) => async (dispatch) => {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST }); // Dispatch request action
    try {
        const { data } = await axios.put(`/api/orders/${orderId}`, { status });
        dispatch({ type: UPDATE_ORDER_STATUS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_STATUS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

