import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from '../../utils/api'; // Adjust the path as needed
import Swal from 'sweetalert2';
import '../../assets/css/ForgotPassword.css'; // Import custom CSS

const StyledContainer = styled(Container)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(to right, #6a11cb, #2575fc)', // Background gradient
}));

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  maxWidth: '400px',
  width: '100%',
}));

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/users/forget-password', { email });
      Swal.fire({
        position: 'top-center', // Center the notification
        icon: 'success',
        title: 'Email Sent',
        text: response.data.message,
        toast: true,
        showConfirmButton: false,
        timer: 2000,
        background: '#dff0d8', // Background color
        color: '#3c763d', // Text color
        customClass: {
          container: 'swal-container',
          title: 'swal-title',
          text: 'swal-text',
        },
      }).then(() => {
        setEmail(''); // Clear the form only if needed
      });
    } catch (error) {
      Swal.fire({
        position: 'top-center', // Center the notification
        icon: 'error',
        title: 'Error',
        text: 'Error sending email. Please try again.',
        toast: true,
        showConfirmButton: false,
        timer: 2000,
        background: '#f2dede', // Background color
        color: '#a94442', // Text color
        customClass: {
          container: 'swal-container',
          title: 'swal-title',
          text: 'swal-text',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="false">
      <StyledBox>
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
          Forgot Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, p: 1.5, background: 'linear-gradient(to right, #6a11cb, #2575fc)' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
          </Button>
        </Box>
      </StyledBox>
    </StyledContainer>
  );
};

export default ForgotPassword;
