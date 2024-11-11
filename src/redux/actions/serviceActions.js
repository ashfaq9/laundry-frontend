import axios from '../../utils/api';
import {
    FETCH_SERVICES_REQUEST,
    FETCH_SERVICES_SUCCESS,
    FETCH_SERVICES_FAILURE,
    FETCH_SERVICE_BY_ID_REQUEST,
    FETCH_SERVICE_BY_ID_SUCCESS,
    FETCH_SERVICE_BY_ID_FAILURE
} from '../constants/serviceConstants';

export const fetchServices = () => async (dispatch) => {
    dispatch({ type: FETCH_SERVICES_REQUEST });
    try {
        const { data } = await axios.get('/api/services');
        dispatch({ type: FETCH_SERVICES_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_SERVICES_FAILURE, payload: error.message });
    }
};

export const fetchServiceById = (id) => async (dispatch) => {
    dispatch({ type: FETCH_SERVICE_BY_ID_REQUEST });
    try {
        const { data } = await axios.get(`/api/services/${id}`);
        dispatch({ type: FETCH_SERVICE_BY_ID_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: FETCH_SERVICE_BY_ID_FAILURE, payload: error.message });
    }
};
