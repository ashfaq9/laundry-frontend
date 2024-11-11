import React from 'react';
import { useSelector } from 'react-redux';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Box, Typography, Card, CardContent } from '@mui/material';

// Register Pie chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

export default function OrderBreakdownChart() {
  const { dashboardData } = useSelector((state) => state.dashboard);

  
  

  // Prepare data for Order Status Breakdown Pie Chart
  const orderStatusBreakdown = dashboardData?.orderStatusBreakdown || {};
  const labels = Object.keys(orderStatusBreakdown);
  const data = Object.values(orderStatusBreakdown);

  const pieChartData = {
    labels,
    datasets: [
      {
        label: 'Order Status',
        data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Red
          'rgba(54, 162, 235, 0.6)', // Blue
          'rgba(255, 206, 86, 0.6)', // Yellow
          'rgba(75, 192, 192, 0.6)', // Green
          'rgba(153, 102, 255, 0.6)', // Purple
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.raw}`,
        },
      },
    },
  };

  if (!orderStatusBreakdown || orderStatusBreakdown.length === 0) {
    return <Typography>No data available for chart</Typography>;
  }
  return (
    <Box sx={{ padding: 3 }}>
      {/* Order Status Breakdown Chart */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Status Breakdown
          </Typography>
          <div style={{ width: '100%', height: '400px' }}>
            <Pie data={pieChartData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
