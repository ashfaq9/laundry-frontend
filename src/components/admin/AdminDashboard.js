import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fetchDashboardData } from '../../redux/actions/dashboardAction';
import DashboardOverview from './../admin/DashboardOverview';
import DashboardCharts from './../admin/DashboardCharts';
import TransactionTable from './../admin/TransactionTable';
import ReportsButtons from './../admin/ReportsButtons';
import { Typography, Box, Button } from '@mui/material';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const transactionGenerateRef = useRef(null);
  const transactionHistoryRef = useRef(null);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Box
        mb={4}
        display="flex"
        justifyContent="flex-start"
        gap={2} // Adds space between the buttons
        sx={{
          position: 'sticky', // Makes the buttons sticky at the top
          top: 0, // Aligns the buttons to the top
          zIndex: 1000, // Ensures the buttons stay on top of other content
          backgroundColor: '#f5f5f5', // Sets the background color of the button container
          padding: '10px', // Adds padding around the buttons
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => scrollToSection(transactionGenerateRef)}
        >
          Go to Transaction Generate
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => scrollToSection(transactionHistoryRef)}
        >
          Go to Transaction History
        </Button>
      </Box>

      <DashboardOverview />
      <DashboardCharts />

      {/* Transaction Generate Section */}
      <Box ref={transactionGenerateRef} id="transaction-generate" mt={4}>
        <Typography variant="h5" gutterBottom>
          Transaction Generate
        </Typography>
        <ReportsButtons />
        {/* Add your transaction generation code here */}
      </Box>

      {/* Transaction History Section */}
      <Box ref={transactionHistoryRef} id="transaction-history" mt={4}>
        <Typography variant="h5" gutterBottom>
          Transaction History
        </Typography>
        <TransactionTable />
        {/* Add your transaction history code here */}
      </Box>
    </div>
  );
}
