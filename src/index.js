import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import AuthProvider from './contexts/AuthContext';
import { ThemeProvider } from '@mui/material/styles';
import theme from './assets/css/theme';
import App from './App';
import store from './redux/store';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { FeedbackProvider } from './contexts/FeedbackContext';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
      <FeedbackProvider>

   
        <AuthProvider>
        <Elements stripe={stripePromise}>
    <App />
  </Elements>
        </AuthProvider>
        </FeedbackProvider>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);

console.log('Stripe Publishable Key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY); // Ensure the key is being loaded correctly

