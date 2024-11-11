import React, { useEffect, useState,useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices } from '../../redux/actions/serviceActions';
import { useNavigate } from 'react-router-dom'; // Correctly import useNavigate
import { Grid, Card, CardContent, CardMedia, Typography, Button, TextField, Box, Collapse, Pagination } from '@mui/material';
import '../../assets/css/ServiceList.css'; // Import the CSS file

const PAGE_SIZE = 6; // Number of services to display per page

const ServiceList = () => {
  const dispatch = useDispatch();
  const { loading, services, error } = useSelector(state => state.services);

  const [expanded, setExpanded] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate(); // Initialize useNavigate correctly

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleExpandClick = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when search query changes
  };

  // const filteredServices = services.filter(service =>
  //   service.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const filteredServices = useMemo(() => {
    return services.filter(service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, services]);
  

  // Pagination logic
  const indexOfLastService = currentPage * PAGE_SIZE;
  const indexOfFirstService = indexOfLastService - PAGE_SIZE;
  const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
  const totalPages = Math.ceil(filteredServices.length / PAGE_SIZE);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) return <Typography variant="h6" align="center">Loading...</Typography>;
  if (error) return <Typography variant="h6" align="center" color="error">Error: {error}</Typography>;

  if (!services || services.length === 0) {
    return <Typography variant="h6" align="center">No services available</Typography>;
  }

  return (
    <Box className="background-box" sx={{ maxWidth: '1200px', margin: 'auto', padding: '2rem' }}>
      {/* Delivery Promise Section */}
      <Box className="delivery-promise" sx={{ marginBottom: '2rem' }}>
        <Typography variant="h5" component="div">
          We Deliver Our Services Within 48 Hours!
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Enjoy quick and efficient service with our guaranteed 48-hour delivery promise.
        </Typography>
      </Box>

      {/* Search Bar */}
      <TextField
        className="styled-text-field"
        label="Search Services"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ marginBottom: '2rem' }}
      />

      {/* Service Grid */}
      <Grid container spacing={3}>
        {currentServices.map(service => (
          <Grid item xs={12} sm={6} md={4} key={service._id}>
            <Card className="responsive-card">
              <CardMedia
                className="responsive-card-media"
                component="img"
                alt={service.name}
                image={`http://localhost:5000${service.image}`} // Ensure this URL is correct for your environment
                title={service.name}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {service.name}
                </Typography>
                <Typography className="description-preview">
                  {service.description.length > 100
                    ? `${service.description.substring(0, 100)}...`
                    : service.description}
                </Typography>
                <Collapse in={expanded[service._id]} timeout="auto" unmountOnExit>
                  <Typography variant="body2" color="text.secondary">
                    {service.description}
                  </Typography>
                </Collapse>
                <Button
                  onClick={() => handleExpandClick(service._id)}
                  sx={{ mt: 1 }}
                >
                  {expanded[service._id] ? 'Read Less' : 'Read More'}
                </Button>
              </CardContent>
              <Button
                size="small"
                color="primary"
                onClick={() => navigate(`/services/${service._id}`)} // Use navigate for routing
              >
                View Details
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ServiceList;
