import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Button, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import { confirmPayment /*, retryPayment, cancelPayment*/ } from '../../redux/actions/paymentActions';

const PaymentConfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentFailed, setPaymentFailed] = useState(false);

  // Extract paymentIntentId from the URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const paymentIntentId = queryParams.get('paymentIntentId');

  // Confirm the payment intent upon loading the component
  const handleConfirmPayment = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPaymentFailed(false);

    if (!paymentIntentId || !orderId) {
      setError('Missing payment information. Please refresh the page and try again.');
      setLoading(false);
      return;
    }

    // Use a default payment method ID (or retrieve dynamically in real-world cases)
    const paymentMethodId = 'pm_card_visa'; 

    try {
      // Dispatch action to confirm the payment
      const result = await dispatch(confirmPayment({ paymentIntentId, orderId, paymentMethodId }));

      if (result.success) {
        navigate(`/user/order-status`);
      } else {
        // Handle failure and provide a retry option
        handleError(result.error);
        setPaymentFailed(true);
      }
    } catch (err) {
      // Catch any unexpected errors during the process
      setError('An error occurred while confirming the payment. Please try again later.');
      console.error('Confirm Payment Error:', err);
      setPaymentFailed(true);
    } finally {
      setLoading(false);
    }
  }, [dispatch, navigate, paymentIntentId, orderId]);

  // Retry payment in case of failure (commented out)
  /*
  const handleRetryPayment = async () => {
    setLoading(true);
    setError(null);

    if (!paymentIntentId || !orderId) {
      setError('Payment details are missing. Please refresh the page and try again.');
      setLoading(false);
      return;
    }

    const paymentMethodId = 'pm_card_visa'; // Replace with dynamic payment method ID if applicable

    try {
      // Dispatch action to retry the payment
      const result = await dispatch(retryPayment({ paymentIntentId, orderId, paymentMethodId }));

      if (result.success) {
        navigate(`/user/order-status`);
      } else {
        // Handle failure with improved messaging
        handleError(result.error);
      }
    } catch (err) {
      setError('An error occurred while retrying the payment. Please try again later.');
      console.error('Retry Payment Error:', err);
    } finally {
      setLoading(false);
    }
  };
  */

  // Cancel payment if the user chooses to do so (commented out)
  /*
  const handleCancelPayment = async () => {
    setLoading(true);
    setError(null);

    if (!paymentIntentId || !orderId) {
      setError('Payment details are missing. Please refresh the page and try again.');
      setLoading(false);
      return;
    }

    try {
      // Dispatch action to cancel the payment
      const result = await dispatch(cancelPayment({ paymentIntentId, orderId }));

      if (result.success) {
        navigate(`/cancelled`);
      } else {
        // Improved error handling for cancellation failure
        handleError(result.error);
      }
    } catch (err) {
      setError('An error occurred while canceling the payment. Please try again later.');
      console.error('Cancel Payment Error:', err);
    } finally {
      setLoading(false);
    }
  };
  */

  // Enhanced error messaging for different scenarios
  const handleError = (error) => {
    if (error.includes('already succeeded')) {
      setError('This payment has already been completed successfully.');
    } else if (error.includes('cannot cancel')) {
      setError('The payment cannot be canceled as it has already been processed.');
    } else if (error.includes('network')) {
      setError('There was a network issue. Please check your connection and try again.');
    } else if (error.includes('timeout')) {
      setError('Payment confirmation timed out. Please retry.');
    } else {
      setError('An unexpected error occurred. Please try again or contact support.');
    }
  };

  // Confirm payment on initial load
  useEffect(() => {
    if (paymentIntentId && orderId) {
      handleConfirmPayment();
    }
  }, [paymentIntentId, orderId, handleConfirmPayment]);

  return (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h5">Payment Confirmation</Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {!paymentFailed && (
            <Button variant="contained" color="primary" onClick={handleConfirmPayment}>
              Confirm Payment
            </Button>
          )}

        
          {/* 
          {paymentFailed && (
            <>
              <Button variant="contained" color="primary" onClick={handleRetryPayment}>
                Retry Payment
              </Button>
              <Button variant="outlined" color="error" onClick={handleCancelPayment}>
                Cancel Payment
              </Button>
            </>
          )}
          */}
        </>
      )}
    </Paper>
  );
};

export default PaymentConfirmation;
