import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from '../../utils/api'; 
import Swal from 'sweetalert2';
import '../../assets/css/ResetPassword.css'; 

const StyledContainer = styled(Container)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(to right, #6a11cb, #2575fc)', 
}));

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  maxWidth: '400px',
  width: '100%',
}));

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match.',
        showConfirmButton: false,
        timer: 2000,
        background: '#f2dede',
        color: '#a94442', 
        customClass: {
          container: 'swal-container swal-error',
          title: 'swal-title',
          text: 'swal-text',
        },
      });
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post(`/api/users/reset-password/${token}`, { password, confirmPassword });
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: response.data.message,
        showConfirmButton: false,
        timer: 2000,
        background: '#dff0d8', 
        color: '#3c763d',
        customClass: {
          container: 'swal-container swal-success',
          title: 'swal-title',
          text: 'swal-text',
        },
      }).then(() => {
        navigate('/login'); 
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error resetting password. Please try again.',
        showConfirmButton: false,
        timer: 2000,
        background: '#f2dede', 
        color: '#a94442',
        customClass: {
          container: 'swal-container swal-error',
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
          Reset Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            margin="normal"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ResetPassword;
