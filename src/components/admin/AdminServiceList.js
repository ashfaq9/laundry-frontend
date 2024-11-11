import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from '../../utils/api';
import { Container, Grid, Card, CardContent, Typography, Button, CardMedia } from '@mui/material';

const AdminServiceList = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services');
        setServices(response.data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/services/${id}`);
      setServices(services.filter(service => service._id !== id));
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const handleDescriptionToggle = (id) => {
    setServices(services.map(service => (
      service._id === id ? { ...service, expanded: !service.expanded } : service
    )));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Services
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={RouterLink}
        to="/admin/add-service"
        sx={{ mb: 3 }}
      >
        Add New Service
      </Button>
      <Grid container spacing={3}>
        {services.map(service => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Card>
              <CardMedia
                component="img"
                alt={service.name}
                height="200"
                image={service.image ? `http://localhost:5000${service.image}` : '/default-image.png'}
                title={service.name}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {service.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {service.expanded ? service.description : `${service.description.slice(0, 100)}...`}
                  <Button size="small" onClick={() => handleDescriptionToggle(service._id)}>
                    {service.expanded ? 'Read Less' : 'Read More'}
                  </Button>
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2, mr: 1 }}
                  onClick={() => navigate(`/admin/edit-service/${service._id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => handleDelete(service._id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminServiceList;
