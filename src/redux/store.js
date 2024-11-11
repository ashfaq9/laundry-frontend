import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import { servicesReducer } from './reducers/servicesReducer';
import { cartReducer } from './reducers/cartReducer';
import { orderReducer } from './reducers/orderReducers';
import { paymentReducer } from '../redux/reducers/paymentReducer';
import { dashboardReducer } from './reducers/dashboardReducer';

const rootReducer = combineReducers({
  services: servicesReducer,
  cart: cartReducer,
  order: orderReducer,
  payment: paymentReducer,
  dashboard: dashboardReducer,
});

const initialState = {};

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middleware)
);

export default store;
