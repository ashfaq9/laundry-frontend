import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Container, TextField, Button, Typography, Box, CircularProgress, Alert } from '@mui/material';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import '../../assets/css/Login.css'; // Custom CSS for styling

const MySwal = withReactContent(Swal);

const Login = () => {
  const { login } = useContext(AuthContext);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setServerError(null); 
      try {
        const user = await login(values);
        if (user.role === 'admin') {
          navigate('/admin/profile');
        } else {
          navigate('/user/profile');
        }
        MySwal.fire({
          title: 'Login Successful!',
          text: 'You have successfully logged in.',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'animated fadeInDown faster',
          },
        });
        resetForm();
      } catch (err) {
        if (err.response) {
   
          const serverMessage = err.response.data.message;
          if (serverMessage) {
            setServerError(serverMessage); 
            MySwal.fire({
              title: 'Login Failed!',
              text: serverMessage, 
              icon: 'error',
              confirmButtonText: 'Try Again',
            });
          } else if (err.response.data.errors) {
            // Handle multiple validation errors
            setServerError(err.response.data.errors);
            MySwal.fire({
              title: 'Login Failed!',
              text: 'Please check your credentials.',
              icon: 'error',
              confirmButtonText: 'Try Again',
            });
          } else {
            MySwal.fire({
              title: 'An unexpected error occurred.',
              text: 'Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        } else {
          console.error('Login failed', err);
          MySwal.fire({
            title: 'An unexpected error occurred.',
            text: 'Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
        setSubmitting(false);
      }
    },
  });

  const displayErrors = () => {
    if (typeof serverError === 'string') {
      return <Alert severity="error">{serverError}</Alert>;
    } else if (Array.isArray(serverError)) {
      return (
        <Box mt={2}>
          <Typography variant="h6" color="error">Please fix the following errors:</Typography>
          <ul>
            {serverError.map((error, index) => (
              <li key={index}>
                <Alert severity="error">{error.msg}</Alert>
              </li>
            ))}
          </ul>
        </Box>
      );
    }
    return null;
  };

  return (
    <div className="login-background"> {/* Background image styling */}
      <Container maxWidth="xs" className="login-container">
        <Box mt={4} p={3} sx={{ borderRadius: 2, boxShadow: 3, background: 'rgba(255, 255, 255, 0.85)' }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login
          </Typography>
          {serverError && displayErrors()} 
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              variant="outlined"
              margin="normal"
              {...formik.getFieldProps('email')}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ background: '#fff', borderRadius: 1 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              variant="outlined"
              margin="normal"
              {...formik.getFieldProps('password')}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{ background: '#fff', borderRadius: 1 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, background: 'linear-gradient(to right, #6a11cb, #2575fc)' }}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
            <Box mt={2} textAlign="center">
              <Link to="/forgot-password" className="custom-link">Forgot Password?</Link>
            </Box>
            <Box mt={1} textAlign="center">
              <Link to="/register" className="custom-link">Don't have an account? Sign Up</Link>
            </Box>
          </form>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
