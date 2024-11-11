// orderReducers.js

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
  
  const initialState = {
    cart: {
        items: [], 
    },
    pickupDate: '',
    location: '',
    latitude: null,
    longitude: null,
    orders: [],
    loading: false,
    error: null,
    order: {},
    
  };
  
  // Order Reducer
  export const orderReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CART_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_CART_SUCCESS:
            return {
                ...state,
                loading: false,
                cart: {
                    items: action.payload,
                },
            };
        case GET_CART_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case UPDATE_PICKUP_DATE:
            return {
                ...state,
                pickupDate: action.payload,
            };
        case UPDATE_LOCATION:
            return {
                ...state,
                location: action.payload.location,
                latitude: action.payload.latitude || state.latitude, // Keep previous state if null
                longitude: action.payload.longitude || state.longitude, // Keep previous state if null
            };
        case CREATE_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case CREATE_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                orders: action.payload.orders
         
            };
        case CREATE_ORDER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case GET_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
            };
            case GET_ORDERS_SUCCESS:
                console.log('Reducer Orders Payload:', action.payload);
                return { ...state, orders: action.payload ,  loading: false};
              
            
        case GET_ORDERS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
            case CANCEL_ORDER_REQUEST:
                return { ...state, loading: true };
                case CANCEL_ORDER_SUCCESS:
                    return {
                        ...state,
                        loading: false,
                        orders: state.orders.map((order) =>
                            order._id === action.payload._id ? action.payload : order
                        ),
                    };
                case CANCEL_ORDER_FAIL:
                    return {
                        ...state,
                        loading: false,
                        error: action.payload,
                    };
                    case UPDATE_ORDER_STATUS_REQUEST:
                        return {
                            ...state,
                            loading: true,
                        };
                    case UPDATE_ORDER_STATUS_SUCCESS:
                        console.log('Updated Order:', action.payload);
                        return {
                            ...state,
                            loading: false,
                            orders: state.orders.map((order) =>
                                order._id === action.payload._id ? action.payload : order
                            ),
                        };
                    case UPDATE_ORDER_STATUS_FAIL:
                        return {
                            ...state,
                            loading: false,
                            error: action.payload,
                        };
                    default:
                        return state;
                }
            };
  