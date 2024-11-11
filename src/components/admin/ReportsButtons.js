import React, { useState } from 'react';
import axios from '../../utils/api';
import { Button, TextField, CircularProgress, Alert, Grid, Paper } from '@mui/material';

const ReportsButtons = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filter, setFilter] = useState('custom');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateReport = async (reportType) => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`/api/admin/${reportType}-report`, {
        params: { startDate, endDate, filter },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportType}-report-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(`Error generating ${reportType} PDF report. Please try again.`);
      console.error(`Error generating ${reportType} PDF report:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ padding: 2, marginTop: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            select
            label="Filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            fullWidth
            SelectProps={{ native: true }}
            margin="normal"
          >
            <option value="custom">Custom</option>
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
          </TextField>
        </Grid>

        {loading && (
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
        )}

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {['order', 'transaction'].map((reportType) => (
          <Grid key={reportType} item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleGenerateReport(reportType)}
              disabled={loading}
              fullWidth
            >
              Generate {reportType.charAt(0).toUpperCase() + reportType.slice(1)} PDF Report
            </Button>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default ReportsButtons;
