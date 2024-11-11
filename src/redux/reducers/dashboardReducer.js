import {
  FETCH_DASHBOARD_DATA_REQUEST,
  FETCH_DASHBOARD_DATA_SUCCESS,
  FETCH_DASHBOARD_DATA_FAIL,
} from '../constants/dashboardConstant';

export const dashboardReducer = (state = { dashboardData: {} }, action) => {
  switch (action.type) {
    case FETCH_DASHBOARD_DATA_REQUEST:
      return { loading: true, dashboardData: {} };
    case FETCH_DASHBOARD_DATA_SUCCESS:
      return { loading: false, dashboardData: action.payload };
    case FETCH_DASHBOARD_DATA_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
