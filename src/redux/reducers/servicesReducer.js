import {
  FETCH_SERVICES_REQUEST,
  FETCH_SERVICES_SUCCESS,
  FETCH_SERVICES_FAILURE,
  FETCH_SERVICE_BY_ID_REQUEST,
  FETCH_SERVICE_BY_ID_SUCCESS,
  FETCH_SERVICE_BY_ID_FAILURE
} from '../constants/serviceConstants';

const initialState = {
  loading: false,
  services: [],
  service: null,
  error: '',
};

export const servicesReducer = (state = initialState, action) => {
  switch (action.type) {
      case FETCH_SERVICES_REQUEST:
      case FETCH_SERVICE_BY_ID_REQUEST:
          return { ...state, loading: true, error: '' };
      case FETCH_SERVICES_SUCCESS:
          return { ...state, loading: false, services: action.payload, error: '' };
      case FETCH_SERVICE_BY_ID_SUCCESS:
          return { ...state, loading: false, service: action.payload, error: '' };
      case FETCH_SERVICES_FAILURE:
      case FETCH_SERVICE_BY_ID_FAILURE:
          return { ...state, loading: false, error: action.payload };
      default:
          return state;
  }
};
