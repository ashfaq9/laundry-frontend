import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, Typography, Grid, CircularProgress, Box, Button, TextField, MenuItem } from '@mui/material';
import { styled } from '@mui/system';
import { fetchDashboardData } from '../../redux/actions/dashboardAction';
import moment from 'moment';

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

const CardValue = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.primary.main,
  fontSize: '1.8rem',
}));

export default function DashboardOverview() {
  const [filter, setFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { dashboardData, loading, error } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  useEffect(() => {
    if (filter === 'daily') {
      const today = moment().format('YYYY-MM-DD');
      setStartDate(today);
      setEndDate(today);
      dispatch(fetchDashboardData('daily', today, today));
    } else {
      dispatch(fetchDashboardData(filter, startDate, endDate));
    }
  }, [filter, startDate, endDate, dispatch]);

  const handleFilterChange = (event) => {
    const newFilter = event.target.value;
    setFilter(newFilter);
    if (newFilter !== 'custom') {
      setStartDate('');
      setEndDate('');
    }
  };

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      setFilter('custom');
      dispatch(fetchDashboardData('custom', startDate, endDate));
    }
  };



  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        Error loading dashboard data: {error.message}
      </Typography>
    );
  }

  const orderStatusList = ['Ordered', 'Confirmed', 'Picked Up', 'In Service', 'Delivered'];
  const orderStatusBreakdown = orderStatusList.map((status) => ({
    status,
    count: dashboardData?.orderStatusBreakdown?.[status] || 0,
  }));

  return (
    <Box>
      <Box mb={4}>
        <TextField
          select
          label="Filter by"
          value={filter}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
          sx={{ mr: 2 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="daily">Today</MenuItem>
          <MenuItem value="custom">Custom</MenuItem>
        </TextField>

        {filter === 'custom' && (
          <>
            <TextField
              type="date"
              label="Start Date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
            />
            <TextField
              type="date"
              label="End Date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              variant="outlined"
              size="small"
              sx={{ mr: 2 }}
            />
            <Button onClick={handleCustomDateChange} variant="contained" color="primary">
              Apply
            </Button>
          </>
        )}
      </Box>

      {/* Dashboard Overview */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <CardTitle variant="h6">Total Orders</CardTitle>
              <CardValue>{dashboardData?.totalOrders || 0}</CardValue>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <CardTitle variant="h6">Total Revenue</CardTitle>
              <CardValue>₹{dashboardData?.totalRevenue?.toFixed(2) || '0.00'}</CardValue>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <CardTitle variant="h6">Top Services</CardTitle>
              {dashboardData?.topServices?.map((service, index) => (
                <Typography key={index} variant="body2" color="textSecondary">
                  {`${index + 1}. ${service[0]}: ${service[1]}`}
                </Typography>
              ))}
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <CardTitle variant="h6">Top Users</CardTitle>
              {dashboardData?.topUsers?.map((user, index) => (
                <Typography key={index} variant="body2" color="textSecondary">
                  {`${index + 1}. ${user[0]}: ₹${user[1].toFixed(2)}`}
                </Typography>
              ))}
            </CardContent>
          </StyledCard>
        </Grid>

        {orderStatusBreakdown.map((statusObj, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StyledCard>
              <CardContent>
                <CardTitle variant="h6">{statusObj.status}</CardTitle>
                <CardValue>{statusObj.count}</CardValue>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>


    </Box>
  );
}
