import React, { useEffect, useState } from 'react';
import axios from '../../utils/api';
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Paper,
} from '@mui/material';

const UserTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [filter, setFilter] = useState('all');
  const [specificDate, setSpecificDate] = useState('');

  // Handle input changes
  const handleFilterChange = (e) => setFilter(e.target.value);
  const handleSpecificDateChange = (e) => setSpecificDate(e.target.value);
  const handleSearchIdChange = (e) => setSearchId(e.target.value);

  // Debounce function to delay API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTransactions();
    }, 500); 

    return () => clearTimeout(delayDebounceFn);
  }, [searchId, filter, specificDate]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null); 

    try {
      let url = '/api/transactions/user';
      const params = new URLSearchParams();

      if (searchId && /^[a-f\d]{24}$/i.test(searchId)) {
        params.append('searchId', searchId);
      } else if (searchId) {
        setError('Invalid search ID format');
        setLoading(false);
        return;
      }

    
      if (filter && filter !== 'all') {
        params.append('filter', filter);
      }

      
      if (filter === 'specificDate' && specificDate && !isNaN(new Date(specificDate).getTime())) {
        params.append('specificDate', specificDate);
      } else if (filter === 'specificDate' && !specificDate) {
        setError('Please select a valid specific date');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${url}?${params.toString()}`);
      setTransactions(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Your Transactions
      </Typography>

      {error && (
        <Box display="flex" justifyContent="center" mb={2}>
          <Typography variant="h6" color="error">
            Error: {error}
          </Typography>
        </Box>
      )}

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Search by ID"
            variant="outlined"
            value={searchId}
            onChange={handleSearchIdChange}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Filter by</InputLabel>
            <Select value={filter} onChange={handleFilterChange} label="Filter by">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
              <MenuItem value="specificDate">Specific Date</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {filter === 'specificDate' && (
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="date"
              label="Specific Date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              value={specificDate}
              onChange={handleSpecificDateChange}
            />
          </Grid>
        )}
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      ) : transactions.length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <Typography variant="h6">No transactions found</Typography>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ marginTop: 2 }}>
          {transactions.map((transaction) => (
            <Grid item xs={12} key={transaction._id}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6">Transaction ID: {transaction._id}</Typography>
                <Typography>Order ID: {transaction.order ? transaction.order._id : 'N/A'}</Typography>
                <Typography>Amount: {transaction.amount} {transaction.currency}</Typography>
                <Typography>Status: {transaction.status}</Typography>
                <Typography>Date: {new Date(transaction.transactionDate).toLocaleDateString('en-GB')}</Typography>
                {transaction.order === null && (
                  <Typography color="textSecondary">Order details not available</Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default UserTransactions;
