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
  PAYMENT_CANCEL_FAIL,
} from '../constants/paymentConstants';

const initialState = {
  loading: false,
  payment: null,
  error: null,
  status: null,
  paymentMethodId: null,
};

// Main payment reducer
export const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case PAYMENT_REQUEST:
    case PAYMENT_CONFIRM_REQUEST:
    case PAYMENT_RETRY_REQUEST:
    case PAYMENT_CANCEL_REQUEST:
      return { ...state, loading: true, error: null };

    case PAYMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        payment: action.payload,
        status: 'Created',
        paymentMethodId: action.payload.paymentMethodId,
      };

    case PAYMENT_CONFIRM_SUCCESS:
    case PAYMENT_RETRY_SUCCESS:
      return { ...state, loading: false, status: 'Completed', payment: action.payload };

    case PAYMENT_CANCEL_SUCCESS:
      return { ...state, loading: false, status: 'Cancelled', payment: action.payload };

    case PAYMENT_FAIL:
    case PAYMENT_CONFIRM_FAIL:
    case PAYMENT_RETRY_FAIL:
    case PAYMENT_CANCEL_FAIL:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
