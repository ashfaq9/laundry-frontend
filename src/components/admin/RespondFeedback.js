import React, { useState, useEffect } from 'react';
import axios from '../../utils/api';
import {
    TextField, Button, Card, CardContent, Typography, Box, Avatar, Grid, Divider, IconButton, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import DeleteIcon from '@mui/icons-material/Delete';
import { Rating } from '@mui/material';

export default function RespondFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [response, setResponse] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [filter, setFilter] = useState('newest'); // State for filtering

    useEffect(() => {
        // Fetch all feedbacks
        const fetchFeedbacks = async () => {
            try {
                const res = await axios.get('/api/feedback');
                let sortedFeedbacks = res.data;

                // Sort based on filter
                if (filter === 'newest') {
                    sortedFeedbacks = sortedFeedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                } else if (filter === 'oldest') {
                    sortedFeedbacks = sortedFeedbacks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                } else if (filter === 'highest') {
                    sortedFeedbacks = sortedFeedbacks.sort((a, b) => b.rating - a.rating);
                } else if (filter === 'lowest') {
                    sortedFeedbacks = sortedFeedbacks.sort((a, b) => a.rating - b.rating);
                }

                setFeedbacks(sortedFeedbacks);
            } catch (err) {
                console.error(err);
            }
        };

        fetchFeedbacks();
    }, [submitted, filter]);

    const handleResponseChange = (e, feedbackId) => {
        setResponse({ ...response, [feedbackId]: e.target.value });
    };

    const handleResponseSubmit = async (feedbackId) => {
        try {
            await axios.post(`/api/feedback/response/${feedbackId}`, {
                comment: response[feedbackId],
                adminName: 'Admin' // This can be replaced with the actual admin's name from context or props
            });
            setSubmitted(!submitted); // Toggle submitted to trigger re-fetch of feedbacks
            setResponse({ ...response, [feedbackId]: '' }); // Clear input after submission
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteFeedback = async (feedbackId) => {
        try {
            await axios.delete(`/api/feedback/${feedbackId}`);
            setSubmitted(!submitted); // Toggle submitted to trigger re-fetch of feedbacks
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteResponse = async (feedbackId, responseId) => {
        try {
            await axios.delete(`/api/feedback/${feedbackId}/response/${responseId}`);
            setSubmitted(!submitted); // Toggle submitted to trigger re-fetch of feedbacks
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            {/* Filter Options */}
            <FormControl sx={{ marginBottom: 3, minWidth: 150 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <MenuItem value="newest">Newest</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                    <MenuItem value="highest">Highest Rating</MenuItem>
                    <MenuItem value="lowest">Lowest Rating</MenuItem>
                </Select>
            </FormControl>

            {feedbacks.map((feedback) => (
                <Card key={feedback._id} sx={{ marginBottom: 3, backgroundColor: '#f9f9f9' }}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Avatar sx={{ bgcolor: deepPurple[500] }}>
                                    {feedback.user?.firstName?.charAt(0) || 'U'}
                                </Avatar>
                            </Grid>
                            <Grid item xs>
                                <Typography variant="h6" component="div" fontWeight="bold">
                                    {feedback.user?.firstName || 'Unknown User'}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    <Rating value={feedback.rating} readOnly /> - {new Date(feedback.createdAt).toLocaleDateString()}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <IconButton onClick={() => handleDeleteFeedback(feedback._id)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <Typography variant="body1" component="div" sx={{ marginY: 2 }}>
                            {feedback.comment}
                        </Typography>

                        <Divider sx={{ marginBottom: 2 }} />

                        {feedback.responses.length > 0 && (
                            feedback.responses.map((response) => (
                                <Box key={response._id} sx={{ marginY: 2, padding: 2, backgroundColor: '#e0f7fa', borderRadius: '4px' }}>
                                    <Typography variant="body2" color="textSecondary" fontWeight="bold">
                                        {response.adminName} (Admin Response):
                                    </Typography>
                                    <Typography variant="body1">{response.comment}</Typography>
                                    <IconButton onClick={() => handleDeleteResponse(feedback._id, response._id)} color="secondary">
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))
                        )}

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Respond to Feedback"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={2}
                                value={response[feedback._id] || ''}
                                onChange={(e) => handleResponseChange(e, feedback._id)}
                                sx={{ marginBottom: 2 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleResponseSubmit(feedback._id)}
                            >
                                Submit Response
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}
