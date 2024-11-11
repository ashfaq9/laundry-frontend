import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Container, TextField, Button, Typography, Box, IconButton, Snackbar, Alert } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

const ServiceManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [service, setService] = useState({
    name: '',
    description: '',
    prices: [{ item: '', price: 0 }],
    image: null,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (isEditing) {
      const fetchService = async () => {
        try {
          const response = await axios.get(`/api/services/${id}`);
          setService(response.data);
        } catch (error) {
          console.error('Failed to fetch service:', error);
        }
      };
      fetchService();
    }
  }, [id, isEditing]);

  const formik = useFormik({
    initialValues: service,
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('Service name is required'),
      description: Yup.string().required('Service description is required'),
      prices: Yup.array().of(
        Yup.object({
          item: Yup.string().required('Item name is required'),
          price: Yup.number().required('Price is required').positive('Price must be positive'),
        })
      ).min(1, 'Prices array cannot be empty'),
      image: Yup.mixed().test(
        'fileSize',
        'Image size is too large. Max size is 5MB.',
        (value) => {
          if (!isEditing && !value) {
            return false; // Required for new services
          }
          if (value instanceof File) {
            return value.size <= 5 * 1024 * 1024; // 5MB limit
          }
          return true; // Skip validation if the image is unchanged
        }
      ).required(isEditing ? undefined : 'Service image is required'),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('prices', JSON.stringify(values.prices));
  
      if (values.image instanceof File) {
        formData.append('image', values.image);
      }
  
      try {
        if (isEditing) {
          await axios.put(`/api/services/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          await axios.post('/api/services', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
        setSnackbarMessage('Service saved successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setTimeout(() => navigate('/admin/services'), 3000);  // Auto-redirect after 3 seconds
        
      } catch (error) {
        console.error(`Failed to ${isEditing ? 'update' : 'add'} service:`, error);
        setSnackbarMessage(error.response?.data?.error || 'An error occurred while saving the service.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    },
  });
  

  const handleAddPrice = () => {
    formik.setFieldValue('prices', [...formik.values.prices, { item: '', price: 0 }]);
  };

  const handleRemovePrice = (index) => {
    const prices = [...formik.values.prices];
    prices.splice(index, 1);
    formik.setFieldValue('prices', prices);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {isEditing ? 'Edit' : 'Add'} Service
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Service Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          sx={{ mb: 3 }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Service Description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
          sx={{ mb: 3 }}
        />
        {formik.values.prices.map((price, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
              label="Item"
              name={`prices[${index}].item`}
              value={price.item}
              onChange={formik.handleChange}
              error={formik.touched.prices && formik.errors.prices && formik.errors.prices[index] && Boolean(formik.errors.prices[index].item)}
              helperText={formik.touched.prices && formik.errors.prices && formik.errors.prices[index] && formik.errors.prices[index].item}
              sx={{ mr: 2, flex: 1 }}
            />
            <TextField
              label="Price"
              name={`prices[${index}].price`}
              type="number"
              value={price.price}
              onChange={formik.handleChange}
              error={formik.touched.prices && formik.errors.prices && formik.errors.prices[index] && Boolean(formik.errors.prices[index].price)}
              helperText={formik.touched.prices && formik.errors.prices && formik.errors.prices[index] && formik.errors.prices[index].price}
              sx={{ mr: 2, width: 100 }}
            />
            <IconButton
              color="error"
              onClick={() => handleRemovePrice(index)}
              disabled={formik.values.prices.length === 1}
            >
              <RemoveCircleOutline />
            </IconButton>
            {index === formik.values.prices.length - 1 && (
              <IconButton color="primary" onClick={handleAddPrice}>
                <AddCircleOutline />
              </IconButton>
            )}
          </Box>
        ))}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            component="label"
            sx={{ mr: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              name="image"
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                formik.setFieldValue('image', file);
              }}
            />
          </Button>
          {formik.touched.image && formik.errors.image && (
            <Typography variant="body2" color="error">
              {formik.errors.image}
            </Typography>
          )}
        </Box>
        <Button type="submit" variant="contained" color="primary">
          {isEditing ? 'Update' : 'Add'} Service
        </Button>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ServiceManagement;
