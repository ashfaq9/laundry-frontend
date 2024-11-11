import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Container, Typography, List, ListItem, ListItemText, Button, Paper, TextField, CircularProgress, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Geocoder from 'nominatim-geocoder';
import { AuthContext } from '../../contexts/AuthContext';
import { getDistance } from 'geolib';
import { updateLocation, createOrder } from '../../redux/actions/orderActions';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Icon } from 'leaflet';

// Custom Marker Icon
const markerIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
    iconSize: [38, 38],
});

// Validation Schema
const validationSchema = yup.object().shape({
    pickupDate: yup
        .string()
        .required('Pickup Date is required')
        .test('min-48-hours', 'Pickup Date must be at least 48 hours from now', value => {
            const now = new Date();
            const pickupDate = new Date(value);
            return (pickupDate - now) / (1000 * 60 * 60) >= 48;
        })
        .test('max-7-days', 'Pickup Date must be within 7 days from now', value => {
            const now = new Date();
            const pickupDate = new Date(value);
            return (pickupDate - now) / (1000 * 60 * 60 * 24) <= 7;
        }),
    pickupTime: yup.string().required('Pickup Time is required'),
    formattedAddress: yup.string().required('Address is required'),

    orderPersonName: yup.string().required('Order Person Name is required'),
    phoneNumber: yup.string().required('Phone Number is required')
        .matches(/^[0-9]+$/, 'Phone Number must be a valid number')
        .min(10, 'Phone Number must be at least 10 digits'),

});

const OrderForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const userId = user ? user._id : '';
    const cartItems = useSelector(state => state.order.cart.items) || [];
    const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const [mapCenter, setMapCenter] = useState([12.9715999, 77.594566]); // Bangalore coordinates
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [address, setAddress] = useState(''); // Added state for address
    const [suggestions, setSuggestions] = useState([]);
    const geocoder = new Geocoder();

    const allowedLocation = { latitude: 12.9715999, longitude: 77.594566 };
    const maxDistance = 30000; // 30 km

    const handleAddressChange = async (address, setFieldValue) => {
        setFieldValue('formattedAddress', address);
        setAddress(address);
        if (!address) {
            resetMap();
            setSuggestions([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const results = await geocoder.search({ q: address });
            if (results && results.length > 0) {
                setSuggestions(results.map(result => result.display_name));
            } else {
                setSuggestions([]);
                throw new Error('No results found for the provided address.');
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            setError(error.message || 'Geocoding failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSelect = async (selectedAddress, setFieldValue) => {
        setFieldValue('formattedAddress', selectedAddress);
        setAddress(selectedAddress); // Update address state

        try {
            setLoading(true);
            const results = await geocoder.search({ q: selectedAddress });
            if (results && results.length > 0) {
                const { lat, lon } = results[0];
                updateMapLocation(lat, lon, selectedAddress, setFieldValue);
                setSuggestions([]);
            } else {
                throw new Error('Failed to get geocoding details for the selected address.');
            }
        } catch (error) {
            console.error('Geocoding error:', error);
            setError(error.message || 'Geocoding failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatTimeTo12Hour = (time24) => {
        const [hours, minutes] = time24.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        return `${hour12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    const handleSubmitForm = async (values) => {
        if (!latitude || !longitude) {
            setError('Please select a valid location on the map.');
            return;
        }

        const formattedPickupTime = formatTimeTo12Hour(values.pickupTime);
        const orderData = {
            user: userId,
            services: cartItems.map(item => ({
                service: item.service._id,
                items: [{ item: item.item, quantity: item.quantity }],
            })),
            totalAmount,
            pickupDate: values.pickupDate,
            pickupTime: formattedPickupTime,
            formatted_address: values.formattedAddress,
            latitude,
            longitude,
            orderPersonName: values.orderPersonName,
            phoneNumber: values.phoneNumber,
        };

        setLoading(true);

        try {
            const response = await dispatch(createOrder(orderData));

            if (response && response.order && response.order._id) {
                navigate(`/payment/${response.order._id}`);
            } else if (response && response.error) {
                // Display server-side error message
                setError(response.error);
                console.log(response);
            } else {
                setError('Failed to create order. Please try again.');

            }
        } catch (error) {
            // Handle any unexpected errors
            setError('An unexpected error occurred. Please try again later.');
            console.error('Order creation error:', error);
        } finally {
            setLoading(false);
        }
    }

    const resetMap = () => {
        setLatitude(null);
        setLongitude(null);
        setMapCenter([allowedLocation.latitude, allowedLocation.longitude]);
    };

    const updateMapLocation = (lat, lon, address, setFieldValue) => {
        setLatitude(parseFloat(lat));
        setLongitude(parseFloat(lon));
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
        setAddress(address); // Update address state
        validateDistance(parseFloat(lat), parseFloat(lon), address, setFieldValue);
    };

    const validateDistance = (lat, lon, address, setFieldValue) => {
        const distance = getDistance({ latitude: lat, longitude: lon }, allowedLocation);
        if (distance > maxDistance) {
            setError('Selected location is outside our service area.');
            // Optionally, reset the address and location
            setFieldValue('formattedAddress', '');
            resetMap();
        } else {
            setError(null);
            dispatch(updateLocation({ address, latitude: lat, longitude: lon }));
        }
    };

    return (
        <Container component={Paper} sx={{ p: 4, maxWidth: 800, boxShadow: 3, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                Create Your Order
            </Typography>
            <Typography variant="h6" gutterBottom>Order Details</Typography>
            <List>
                {cartItems.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={item.service.name} secondary={`Item: ${item.item}, Quantity: ${item.quantity}`} />
                    </ListItem>
                ))}
            </List>

            {error && (
                <Alert severity="error" sx={{ mb: 2, boxShadow: 2 }}>
                    {error}
                </Alert>
            )}

            <Formik
                initialValues={{
                    pickupDate: '',
                    pickupTime: '',
                    formattedAddress: '',
                    orderPersonName: '',
                    phoneNumber: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmitForm}
            >
                {({ setFieldValue }) => (
                    <Form>
                        <Field
                            as={TextField}
                            name="pickupDate"
                            label="Pickup Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            sx={{ mb: 3, borderRadius: 1 }}
                        />
                        <ErrorMessage name="pickupDate" component="div" style={{ color: 'red', marginBottom: 16 }} />

                        <Field
                            as={TextField}
                            name="pickupTime"
                            label="Pickup Time"
                            type="time"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            sx={{ mb: 3, borderRadius: 1 }}
                        />
                        <ErrorMessage name="pickupTime" component="div" style={{ color: 'red', marginBottom: 16 }} />

                        <Field
                            as={TextField}
                            name="formattedAddress"
                            label="Address"
                            fullWidth
                            sx={{ mb: 1, borderRadius: 1 }}
                            value={address}
                            onChange={(e) => handleAddressChange(e.target.value, setFieldValue)}
                        />
                        <ErrorMessage name="formattedAddress" component="div" style={{ color: 'red', marginBottom: 16 }} />

                        {loading ? (
                            <CircularProgress size={24} sx={{ mb: 3 }} />
                        ) : (
                            suggestions.length > 0 && (
                                <List sx={{ mb: 3, boxShadow: 1, maxHeight: 150, overflowY: 'auto' }}>
                                    {suggestions.map((suggestion, index) => (
                                        <ListItem
                                            key={index}
                                            button
                                            onClick={() => handleAddressSelect(suggestion, setFieldValue)}
                                            sx={{ '&:hover': { backgroundColor: '#f0f0f0' } }}
                                        >
                                            <ListItemText primary={suggestion} />
                                        </ListItem>
                                    ))}
                                </List>
                            )
                        )}

                        <MapContainer
                            center={mapCenter}
                            zoom={13}
                            style={{ height: "350px", marginBottom: "20px", borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker
                                position={mapCenter}
                                icon={markerIcon}
                            >
                                <Popup>Your Selected Location</Popup>
                            </Marker>
                        </MapContainer>

                        <Field
                            as={TextField}
                            name="orderPersonName"
                            label="Order Person Name"
                            fullWidth
                            sx={{ mb: 3, borderRadius: 1 }}
                        />
                        <ErrorMessage name="orderPersonName" component="div" style={{ color: 'red', marginBottom: 16 }} />

                        <Field
                            as={TextField}
                            name="phoneNumber"
                            label="Phone Number"
                            fullWidth
                            sx={{ mb: 3, borderRadius: 1 }}
                        />
                        <ErrorMessage name="phoneNumber" component="div" style={{ color: 'red', marginBottom: 16 }} />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                borderRadius: 2,
                                padding: '10px 0',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                                backgroundColor: '#2c3e50',
                                '&:hover': {
                                    backgroundColor: '#1a252f',
                                },
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Place Order'}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Container>
    );
};

export default OrderForm;
