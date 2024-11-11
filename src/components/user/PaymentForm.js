import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Typography, Button, Paper, Box, CircularProgress, Alert, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import * as yup from 'yup';
import { processPayment } from '../../redux/actions/paymentActions';
import { AuthContext } from '../../contexts/AuthContext';

// Validation schema
const validationSchema = yup.object().shape({
  cardName: yup.string().required('Cardholder Name is required'),
});

const PaymentForm = () => {
  const { user } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { orderId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe has not loaded properly');
      setLoading(false);
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);

      const { paymentMethod, error: stripeError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: values.cardName,
        },
      });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // Dispatch payment processing
      const result = await dispatch(processPayment({
        paymentMethodId: paymentMethod.id,
        orderId
      }));

      if (result && result.paymentIntentId) {
        const paymentStatus = result.payment.paymentStatus;

        if (paymentStatus === 'Pending') {
          navigate(`/confirmation/${orderId}?paymentIntentId=${result.paymentIntentId}`);

        } else if (paymentStatus === 'Succeeded') {
          navigate(`/user/order-status`);
        } else {
          setError('Payment failed. Please try again.');
        }
      } else {
        setError(result.error || 'Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setError('An error occurred while processing the payment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Payment Details
        </Typography>
        <Formik
          initialValues={{
            cardName: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, values, errors, touched }) => (
            <Form>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  name="cardName"
                  label="Cardholder Name"
                  variant="outlined"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.cardName}
                  error={touched.cardName && Boolean(errors.cardName)}
                  helperText={touched.cardName && errors.cardName}
                />
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading || !stripe || !elements}
                >
                  {loading ? <CircularProgress size={24} /> : 'Pay Now'}
                </Button>
                {error && <Alert severity="error">{error}</Alert>}
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Container>
  );
};

export default PaymentForm;
