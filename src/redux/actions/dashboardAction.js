import axios from '../../utils/api'; 
import {
  FETCH_DASHBOARD_DATA_REQUEST,
  FETCH_DASHBOARD_DATA_SUCCESS,
  FETCH_DASHBOARD_DATA_FAIL,
} from '../constants/dashboardConstant';

export const fetchDashboardData = (filter, startDate, endDate) => async (dispatch) => {
  try {
    dispatch({ type: FETCH_DASHBOARD_DATA_REQUEST });
    const { data } = await axios.get('/api/admin/dashboard', {
      params: { filter, startDate, endDate }  
    });
    dispatch({ type: FETCH_DASHBOARD_DATA_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FETCH_DASHBOARD_DATA_FAIL,
      payload: error.response && error.response.data.message
        ? error.response.data.message
        : error.message,
    });
  }
};
