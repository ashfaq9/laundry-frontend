import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Alert,
    Button,
    Stepper,
    Step,
    StepLabel,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Snackbar,
    Grid,
    TextField
} from '@mui/material';
import { getOrdersByStatus, updateOrderStatus, cancelOrder } from '../../redux/actions/orderActions';

const AdminOrderStatus = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.order.orders || []);
    const loading = useSelector((state) => state.order.loading);
    const error = useSelector((state) => state.order.error);

    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // New state for search term
    const [notification, setNotification] = useState({ open: false, message: '' });

    useEffect(() => {
        dispatch(getOrdersByStatus());
    }, [dispatch]);

    const handleNotification = (message) => {
        setNotification({ open: true, message });
    };

    const handleCloseNotification = () => {
        setNotification({ open: false, message: '' });
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                if (orderId) {
                    await dispatch(cancelOrder(orderId));
                    handleNotification('Order successfully canceled.');
                }
            } catch (error) {
                handleNotification(error.message || 'Failed to cancel the order');
            }
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            if (orderId && newStatus) {
                await dispatch(updateOrderStatus(orderId, newStatus));
                handleNotification('Order status updated successfully.');
            }
        } catch (error) {
            handleNotification(error.message || 'Failed to update the order status');
        }
    };

    // Format date in dd-MM-yyyy
    const formatDate = (date) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(date).toLocaleDateString('en-GB', options);
    };

    // Filter orders by status and search term
    const filteredOrders = Array.isArray(orders)
        ? orders.filter((order) =>
            (statusFilter ? order.status === statusFilter : true) &&
        (searchTerm ? 
            order._id.includes(searchTerm) || 
            (order.orderPersonName && order.orderPersonName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.phoneNumber && order.phoneNumber.includes(searchTerm)) 
            : true)
        )
        : [];

    // Sort orders by pickup date, with the closest date first
    const sortedOrders = filteredOrders.slice().sort((a, b) => {
        const aDate = new Date(a.pickupDate);
        const bDate = new Date(b.pickupDate);

        if (a.status === 'Delivered' && b.status !== 'Delivered') return 1;
        if (a.status !== 'Delivered' && b.status === 'Delivered') return -1;

        return aDate - bDate; // Sort by pickup date, ascending order
    });

    const steps = ['Ordered', 'Confirmed', 'Picked Up', 'In Service', 'Delivered'];

    const getStatusStepIndex = (status) => {
        switch (status) {
            case 'Ordered':
                return 0;
            case 'Confirmed':
                return 1;
            case 'Picked Up':
                return 2;
            case 'In Service':
                return 3;
            case 'Delivered':
                return 4;
            default:
                return 0;
        }
    };

    // Calculate order counts by status
    const statusCounts = steps.reduce((acc, status) => {
        acc[status] = orders.filter(order => order.status === status).length;
        return acc;
    }, {});

    return (
        <>
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h5">Admin Order Management</Typography>

                {/* Search Input Field */}
                <TextField
                    fullWidth
                    label="Search"
                    variant="outlined"
                    style={{ marginTop: '20px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Display the counts of each status */}
                <Grid container spacing={2} style={{ marginTop: '20px', marginBottom: '20px' }}>
                    {steps.map((status) => (
                        <Grid item xs={6} sm={4} md={2} key={status}>
                            <Typography variant="subtitle1">
                                {status}: {statusCounts[status] || 0}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                <FormControl fullWidth style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <InputLabel>Status Filter</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {steps.map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <List>
                        {sortedOrders.length === 0 ? (
                            <Typography>No orders found.</Typography>
                        ) : (
                            sortedOrders.map((order) => (
                                <ListItem key={order?._id || 'no-id'} style={{ marginBottom: '15px' }}>
                                    <Paper style={{ padding: '10px', width: '100%' }}>
                                        <Typography variant="h6">Order ID: {order._id || 'No ID'}</Typography>
                                        <ListItemText
                                            primary={`Pickup Date: ${order?.pickupDate ? formatDate(order.pickupDate) : 'N/A'}`}
                                            secondary={`Total Amount: ₹${order?.totalAmount || 'N/A'}`}
                                        />

                                        {/* Display Order Person Name, Address, Pickup Time, and Phone Number */}
                                        <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                                            Order Person: {order?.orderPersonName || 'No name provided'}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Address: {order?.formatted_address || 'No address provided'}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Pickup Time: {order?.pickupTime || 'No pickup time provided'}
                                        </Typography>
                                        <Typography variant="subtitle1">
                                            Phone Number: {order?.phoneNumber || 'No phone number provided'}
                                        </Typography>

                                        <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                                            Order Status:
                                        </Typography>

                                        <Stepper activeStep={getStatusStepIndex(order?.status || 'Ordered')} alternativeLabel>
                                            {steps.map((label) => (
                                                <Step key={label}>
                                                    <StepLabel>{label}</StepLabel>
                                                </Step>
                                            ))}
                                        </Stepper>

                                        <FormControl fullWidth style={{ marginTop: '10px' }}>
                                            <InputLabel>Update Status</InputLabel>
                                            <Select
                                                value={order?.status || 'Ordered'}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            >
                                                {steps.map((status) => (
                                                    <MenuItem key={status} value={status}>
                                                        {status}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                                            Ordered Items:
                                        </Typography>
                                        {order?.services && order.services.length > 0 ? (
                                            <List>
                                                {order.services.map((service) => (
                                                    service.items && service.items.length > 0 ? (
                                                        service.items.map((item) => (
                                                            <ListItem key={item._id}>
                                                                <ListItemText
                                                                    primary={`Item: ${item.item || 'No name'}`}
                                                                    secondary={`Quantity: ${item.quantity || 'No quantity'}`}
                                                                />
                                                            </ListItem>
                                                        ))
                                                    ) : (
                                                        <Typography key={service._id}>No items found in this service.</Typography>
                                                    )
                                                ))}
                                            </List>
                                        ) : (
                                            <Typography>No items found.</Typography>
                                        )}
                                        {order?.status === 'Ordered' && (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleCancelOrder(order._id)}
                                                style={{ marginTop: '10px' }}
                                            >
                                                Cancel Order
                                            </Button>
                                        )}
                                    </Paper>
                                </ListItem>
                            ))
                        )}
                    </List>
                )}
            </Paper>

            <Snackbar
                open={notification.open}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                message={notification.message}
            />
        </>
    );
};

export default AdminOrderStatus;
