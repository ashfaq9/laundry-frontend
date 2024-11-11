import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Use useNavigate instead of Navigate
import { useSelector, useDispatch } from 'react-redux';
import { fetchServiceById } from '../../redux/actions/serviceActions';
import { addToCart } from '../../redux/actions/cartActions';
import { AuthContext } from '../../contexts/AuthContext';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

const ServiceDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize useNavigate

  const { loading, service, error } = useSelector(state => state.services);

  // State for Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = (priceItem) => {
    if (!user || !user._id) {
      setSnackbarMessage('You need to be logged in to add items to the cart.');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      navigate('/login'); // Use navigate instead of Navigate
      return;
    }

    if (!service || !service._id || !priceItem.item) {
      setSnackbarMessage('Service ID and Item Name are required to add to the cart.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const itemToAdd = {
      ...priceItem,
      service: service._id,
      quantity: 1,
    };

    dispatch(addToCart(itemToAdd, user._id, itemToAdd.quantity));
    setSnackbarMessage(`${priceItem.item} added to cart`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) return <CircularProgress style={{ display: 'block', margin: 'auto', marginTop: '2rem' }} />;
  if (error) return <Alert severity="error" style={{ marginTop: '2rem' }}>{error}</Alert>;

  return (
    <>
      {service ? (
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Card>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <CardMedia
                  component="img"
                  alt={service.name}
                  height="400"
                  image={`http://localhost:5000${service.image}`}
                  title={service.name}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CardContent>
                  <Typography variant="h4" component="div">
                    {service.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                    {service.description}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 4 }}>
                    Prices:
                  </Typography>
                  <List>
                    {service.prices && service.prices.map((priceItem) => (
                      <ListItem key={priceItem._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <ListItemText
                          primary={priceItem.item}
                          secondary={`₹${priceItem.price}`}
                        />
                        {(!user || user.role === 'user') && ( // Show button if user is not logged in or has role 'user'
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleAddToCart(priceItem)}
                          >
                            Add to Cart
                          </Button>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Container>
      ) : (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>Service not found</Typography>
      )}

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
    </>
  );
};

export default ServiceDetail;
