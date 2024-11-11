import React, { useEffect, useContext, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, List, ListItem, ListItemText, Button, Paper, Box, TextField, Alert } from '@mui/material';
import { getCart, removeFromCart, clearCart, updateQuantity } from '../../redux/actions/cartActions';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; 

const Cart = () => {
    const dispatch = useDispatch();
    const { user } = useContext(AuthContext);
    const userId = user ? user._id : '';
    const navigate = useNavigate(); 

    const cartItems = useSelector(state => state.cart.items) || [];

    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) {
            dispatch(getCart(userId));
        }
    }, [dispatch, userId]);

    const handleRemoveFromCart = (itemId) => {
        if (userId) {
            dispatch(removeFromCart(userId, itemId));
        }
    };

    const handleQuantityChange = (itemId, newQuantity) => {
        if (userId && newQuantity >=1) {
            dispatch(updateQuantity(userId, itemId, newQuantity));
        }
    };

    const handleClearCart = () => {
        if (userId) {
            dispatch(clearCart(userId));
        }
    };

    // Calculate total amount
    const calculateTotalAmount = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    // Handle navigation to checkout page
    const handleCheckout = () => {
        const totalAmount = parseFloat(calculateTotalAmount());
        if (totalAmount < 200) {
            setError('Minimum order amount is ₹200. Please add more items to your cart.');
        } else {
            setError(null);
            navigate('/user/orderForm');
        }
    };

   
    const handleAddMoreItems = () => {
        navigate('/services');
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Your Cart
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {cartItems.length > 0 ? (
                <>
                    <List>
                        {cartItems.map(item => (
                            <ListItem key={item._id} component={Paper} style={{ marginBottom: '1em', padding: '1em' }}>
                                <ListItemText
                                    primary={item.item || "Unknown Item"}
                                    secondary={`Service: ${item.service?.name || 'Unknown Service'} | Price: ₹${item.price.toFixed(2)} | Quantity:`}
                                />
                                <TextField
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                                    style={{ marginRight: '1em', width: '60px' }}
                                    inputProps={{ min: 1 }}
                                />
                                <Button variant="contained" color="error" onClick={() => handleRemoveFromCart(item._id)}>
                                    Remove
                                </Button>
                            </ListItem>
                        ))}
                    </List>

                    <Box display="flex" justifyContent="space-between" alignItems="center" paddingTop="1em">
                        <Typography variant="h6">Total: ₹{calculateTotalAmount()}</Typography>
                        <Button variant="contained" color="secondary" onClick={handleClearCart}>
                            Clear Cart
                        </Button>
                    </Box>

                    <Box display="flex" justifyContent="space-between" alignItems="center" paddingTop="2em">
                        <Button variant="contained" color="primary" onClick={handleCheckout}>
                            Proceed to Checkout
                        </Button>
                        <Button variant="outlined" color="primary" onClick={handleAddMoreItems}>
                            Add More Items
                        </Button>
                    </Box>
                </>
            ) : (

                <>
                    <Typography variant="h6" color="textSecondary">
                        Your cart is empty
                    </Typography>
                    <Button variant="outlined" color="primary" onClick={handleAddMoreItems} sx={{ marginTop: '1em' }}>
                        Browse Services
                    </Button>
                </>


            )}
        </Container>
    );
};

export default Cart;
