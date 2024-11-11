import axios from '../../utils/api';
import {
  PAYMENT_REQUEST,
  PAYMENT_SUCCESS,
  PAYMENT_FAIL,
  PAYMENT_CONFIRM_REQUEST,
  PAYMENT_CONFIRM_SUCCESS,
  PAYMENT_CONFIRM_FAIL,
  PAYMENT_RETRY_REQUEST,
  PAYMENT_RETRY_SUCCESS,
  PAYMENT_RETRY_FAIL,
  PAYMENT_CANCEL_REQUEST,
  PAYMENT_CANCEL_SUCCESS,
  PAYMENT_CANCEL_FAIL
} from '../constants/paymentConstants';

export const processPayment = (paymentData) => async (dispatch) => {
    try {
      dispatch({ type: PAYMENT_REQUEST });
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      const { data } = await axios.post('/api/payments/create-payment-intent', paymentData, config);
  
      dispatch({ type: PAYMENT_SUCCESS, payload: data });
      return data; // Ensure paymentMethodId is included in the response if needed
    } catch (error) {
      dispatch({
        type: PAYMENT_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      return { error: error.response?.data?.message || error.message };
    }
  };
  

export const confirmPayment = ({ paymentIntentId, orderId, paymentMethodId }) => async (dispatch) => {
    try {
      dispatch({ type: PAYMENT_CONFIRM_REQUEST });
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      const { data } = await axios.post('/api/payments/confirm-payment', { paymentIntentId, orderId, paymentMethodId }, config);
  
      dispatch({ type: PAYMENT_CONFIRM_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({
        type: PAYMENT_CONFIRM_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };
  

  export const retryPayment = ({ paymentIntentId, orderId, paymentMethodId }) => async (dispatch) => {
    try {
      dispatch({ type: PAYMENT_RETRY_REQUEST });
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      const { data } = await axios.post('/api/payments/retry-payment', { paymentIntentId, orderId, paymentMethodId }, config);
  
      dispatch({ type: PAYMENT_RETRY_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({
        type: PAYMENT_RETRY_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };
  
  export const cancelPayment = ({ paymentIntentId, orderId }) => async (dispatch) => {
    try {
      dispatch({ type: PAYMENT_CANCEL_REQUEST });
  
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
  
      const { data } = await axios.post('/api/payments/cancel-payment', { paymentIntentId, orderId }, config);
  
      dispatch({ type: PAYMENT_CANCEL_SUCCESS, payload: data });
      return data;
    } catch (error) {
      dispatch({
        type: PAYMENT_CANCEL_FAIL,
        payload: error.response?.data?.message || error.message,
      });
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };