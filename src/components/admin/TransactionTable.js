import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Typography, Box, Button, Grid, TablePagination } from '@mui/material';
import axios from '../../utils/api';

const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('/api/transactions/admin');
                const sortedTransactions = response.data.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
                setTransactions(sortedTransactions);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setError('Failed to load transactions.');
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const handleToggleExpand = (id) => {
        setExpanded((prevState) => ({ ...prevState, [id]: !prevState[id] }));
    };

   const handleChangePage = (event, newPage) => {
  setPage(newPage);
};


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
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
                {error}
            </Typography>
        );
    }

    if (transactions.length === 0) {
        return <Typography>No transactions available.</Typography>;
      }
      

    // Paginated transactions
    const paginatedTransactions = transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        
        <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>User</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Order Details</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Amount</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Payment Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Payment Method</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Transaction Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedTransactions.map((transaction) => (
                            <TableRow key={transaction._id}>
                                <TableCell>
                                    {transaction.user ? `${transaction.user.firstName} ${transaction.user.lastName}` : 'Unknown'}
                                </TableCell>
                                <TableCell>
                                    {transaction.order && transaction.order.services ? (
                                        <>
                                            <ul>
                                                {transaction.order.services.slice(0, expanded[transaction._id] ? transaction.order.services.length : 1).map((serviceDetail, index) => (
                                                    <li key={index}>
                                                        {serviceDetail.service ? serviceDetail.service.name : 'Unnamed Service'}
                                                        <ul>
                                                            {serviceDetail.items.map((item, itemIndex) => (
                                                                <li key={itemIndex}>
                                                                    {item.item} - Quantity: {item.quantity}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </li>
                                                ))}
                                            </ul>
                                            {transaction.order.services.length > 1 && (
                                                <Button size="small" onClick={() => handleToggleExpand(transaction._id)}>
                                                    {expanded[transaction._id] ? 'Read Less' : 'Read More'}
                                                </Button>
                                            )}
                                        </>
                                    ) : (
                                        <Typography variant="body2">No Order Details</Typography>
                                    )}
                                </TableCell>
                                <TableCell>{transaction.amount}</TableCell>
                                <TableCell>{transaction.status}</TableCell>
                                <TableCell>{transaction.paymentMethod}</TableCell>
                                <TableCell>{new Date(transaction.transactionDate).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={transactions.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </Grid>
    );
};

export default TransactionTable;
