import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, CircularProgress, Grid, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../assets/images/11.jpg';
import '../../assets/css/Register.css'; // Ensure this file provides custom CSS as needed

// Styled components for a consistent UI
const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0),
}));

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  maxWidth: '400px',
  width: '100%',
}));

const MySwal = withReactContent(Swal);

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string().matches(/^[0-9]{10}$/, 'Phone number should be exactly 10 digits').required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    password: Yup.string().min(6, 'Password should be between 6 - 128 characters').max(128, 'Password should be between 6 - 128 characters').required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setServerErrors({});
      try {
        await axios.post('/api/users/register', values);
        MySwal.fire({
          title: 'Registration successful!',
          text: 'You will be redirected to the login page.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (err) {
        if (err.response && err.response.data) {
          const { errors, message } = err.response.data;
          if (errors) {
            const formErrors = {};
            errors.forEach((error) => {
              formErrors[error.path] = error.msg;
            });
            setServerErrors(formErrors);
          }
          if (message) {
            setServerErrors({ general: message });
          }
        } else {
          MySwal.fire({
            title: 'An unexpected error occurred.',
            text: 'Please try again later.',
            icon: 'error',
          });
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <StyledContainer maxWidth="false">
      <StyledBox>
        <Typography component="h1" variant="h4" sx={{ textAlign: 'center', mb: 3 }}>
          Register With Us
        </Typography>
        {serverErrors.general && (
          <Box mb={2}>
            <Typography variant="body1" color="error">
              {serverErrors.general}
            </Typography>
          </Box>
        )}
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                {...formik.getFieldProps('firstName')}
                error={formik.touched.firstName && Boolean(formik.errors.firstName || serverErrors.firstName)}
                helperText={formik.touched.firstName && (formik.errors.firstName || serverErrors.firstName)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                {...formik.getFieldProps('lastName')}
                error={formik.touched.lastName && Boolean(formik.errors.lastName || serverErrors.lastName)}
                helperText={formik.touched.lastName && (formik.errors.lastName || serverErrors.lastName)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && Boolean(formik.errors.email || serverErrors.email)}
                helperText={formik.touched.email && (formik.errors.email || serverErrors.email)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                type="tel"
                variant="outlined"
                {...formik.getFieldProps('phone')}
                error={formik.touched.phone && Boolean(formik.errors.phone || serverErrors.phone)}
                helperText={formik.touched.phone && (formik.errors.phone || serverErrors.phone)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                variant="outlined"
                {...formik.getFieldProps('address')}
                error={formik.touched.address && Boolean(formik.errors.address || serverErrors.address)}
                helperText={formik.touched.address && (formik.errors.address || serverErrors.address)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                {...formik.getFieldProps('password')}
                error={formik.touched.password && Boolean(formik.errors.password || serverErrors.password)}
                helperText={formik.touched.password && (formik.errors.password || serverErrors.password)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2, background: 'linear-gradient(to right, #6a11cb, #2575fc)' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
          </Button>
          <Box mt={2} textAlign="center">
            <Link href="/login" style={{ textDecoration: 'none', color: '#2575fc' }}>
              Already have an account? Login
            </Link>
          </Box>
        </Box>
      </StyledBox>
    </StyledContainer>
  );
};

export default Register;
