import React, { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paper, Typography, List, ListItem, ListItemText, CircularProgress, Alert, Button, Stepper, Step, StepLabel } from '@mui/material';
import { getOrdersByUser, cancelOrder } from '../../redux/actions/orderActions';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const OrderStatus = () => {
    const { user } = useContext(AuthContext);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const orders = useSelector((state) => state.order.orders || []);
    const loading = useSelector((state) => state.order.loading);
    const error = useSelector((state) => state.order.error);

    const [showDelivered, setShowDelivered] = useState(false);
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        if (user) {
            dispatch(getOrdersByUser(user._id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        const updatedOrders = showDelivered
            ? orders.filter(order => order.status === 'Delivered' && !order.feedback)
            : orders;
        setFilteredOrders(updatedOrders);
    }, [showDelivered, orders]);

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await dispatch(cancelOrder(orderId));
            } catch (error) {
                console.error(error.message || 'Failed to cancel the order');
            }
        }
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
    };

    const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.pickupDate) - new Date(a.pickupDate));
    const steps = ['Ordered', 'Confirmed', 'Picked Up', 'In Service', 'Delivered'];

    const getStatusStepIndex = (status) => {
        return steps.indexOf(status);
    };

    const handleGoToCart = () => {
        navigate('/user/cart');
    };

    const isCancellationAllowed = (orderDate) => {
        const orderTime = new Date(orderDate);
        const currentTime = new Date();
        return (currentTime - orderTime) / (1000 * 60 * 60) <= 1;
    };

    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
            <Typography variant="h5">Your Orders</Typography>

            <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2, mr: 1 }}
                onClick={() => setShowDelivered(true)}
            >
                Add Feedback for Delivered Orders
            </Button>

            {showDelivered && (
                <Button
                    variant="contained"
                    color="secondary"
                    sx={{ mb: 2 }}
                    onClick={() => setShowDelivered(false)}
                >
                    Show All Orders
                </Button>
            )}

            {loading ? (
                <CircularProgress />
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <List>
                    {sortedOrders.length === 0 ? (
                        <Typography>No orders found for your account.</Typography>
                    ) : (
                        sortedOrders.map((order) => (
                            <ListItem key={order._id} sx={{ mb: 2 }}>
                                <Paper sx={{ p: 2, width: '100%' }}>
                                    <Typography variant="h6">Order ID: {order._id}</Typography>
                                    <ListItemText
                                        primary={`Pickup Date: ${formatDate(order.pickupDate)}`}
                                        secondary={`Pickup Place: ${order.formatted_address}`}
                                    />
                                    <Typography variant="subtitle1">
                                        Total Amount: ₹{order.totalAmount}
                                    </Typography>

                                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                        Order Status:
                                    </Typography>

                                    <Stepper activeStep={getStatusStepIndex(order.status)} alternativeLabel>
                                        {steps.map((label) => (
                                            <Step key={label}>
                                                <StepLabel>{label}</StepLabel>
                                            </Step>
                                        ))}
                                    </Stepper>

                                    <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                        Ordered Items:
                                    </Typography>
                                    {order.services?.length > 0 ? (
                                        <List>
                                            {order.services.map((service) => (
                                                service.items?.length > 0 ? (
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

                                    {order.status === 'Ordered' && (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleCancelOrder(order._id)}
                                            sx={{ mt: 1 }}
                                        >
                                            Cancel Order
                                        </Button>
                                    )}

                                    {order.status === 'Delivered' && !order.feedback ? (
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            sx={{ mt: 1 }}
                                            onClick={() => navigate(`/add-feedback/${order._id}`)}
                                        >
                                            Add Feedback
                                        </Button>
                                    ) : order.feedback ? (
                                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                            Feedback Submitted
                                        </Typography>
                                    ) : null}

                                    {order.status === 'Pending' && !isCancellationAllowed(order.createdAt) && (
                                        <Typography variant="body1" color="error" sx={{ mt: 1 }}>
                                            Your order is pending. It can be canceled within the next hour. 
                                            <Button color="primary" onClick={handleGoToCart}>Go to Cart</Button>
                                        </Typography>
                                    )}
                                </Paper>
                            </ListItem>
                        ))
                    )}
                </List>
            )}

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleGoToCart}
            >
                Go to Cart
            </Button>
        </Paper>
    );
};

export default OrderStatus;
