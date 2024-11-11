import React, { useContext, useState } from 'react';
import {
    List, ListItem, ListItemText, Typography, Button, Rating, Link,
    MenuItem, FormControl, Select, InputLabel, Divider
} from '@mui/material';
import { FeedbackContext } from '../../contexts/FeedbackContext';
import { Link as RouterLink } from 'react-router-dom';

export default function FeedbackList() {
    const { feedbacks } = useContext(FeedbackContext);
    const [expandedCommentId, setExpandedCommentId] = useState(null);
    const [sortOrder, setSortOrder] = useState('newest'); 
    const [filterRating, setFilterRating] = useState('all'); 
    const [visibleFeedbacks, setVisibleFeedbacks] = useState(7);

    const handleShowMore = () => {
        setVisibleFeedbacks(prev => prev + 7); 
    };

    const toggleReadMoreLess = (feedbackId) => {
        setExpandedCommentId(expandedCommentId === feedbackId ? null : feedbackId);
    };

    // Helper function to format the date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Sorting feedbacks based on the selected sortOrder
    const sortedFeedbacks = [...feedbacks].sort((a, b) => {
        if (sortOrder === 'newest') {
            return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
            return new Date(a.createdAt) - new Date(b.createdAt);
        }
    });

    // Filtering feedbacks based on the selected rating filter
    const filteredFeedbacks = sortedFeedbacks.filter(feedback => {
        if (filterRating === 'all') return true;
        return feedback.rating === parseInt(filterRating);
    });

    return (
        <>
            <Typography variant="h4" gutterBottom>
                User Reviews
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                Feedback can only be added after the order is delivered. Visit your{' '}
                <Link component={RouterLink} to="/user/order-status">
                    Order Status
                </Link>{' '}
                page to leave feedback.
            </Typography>

            {/* Filter and Sort Controls */}
            <div style={{ marginBottom: '20px' }}>
                <FormControl variant="outlined" style={{ marginRight: '20px', minWidth: 150 }}>
                    <InputLabel>Sort by Date</InputLabel>
                    <Select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        label="Sort by Date"
                    >
                        <MenuItem value="newest">Newest</MenuItem>
                        <MenuItem value="oldest">Oldest</MenuItem>
                    </Select>
                </FormControl>

                <FormControl variant="outlined" style={{ minWidth: 150 }}>
                    <InputLabel>Filter by Rating</InputLabel>
                    <Select
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                        label="Filter by Rating"
                    >
                        <MenuItem value="all">All Ratings</MenuItem>
                        <MenuItem value="5">5 Stars</MenuItem>
                        <MenuItem value="4">4 Stars</MenuItem>
                        <MenuItem value="3">3 Stars</MenuItem>
                        <MenuItem value="2">2 Stars</MenuItem>
                        <MenuItem value="1">1 Star</MenuItem>
                    </Select>
                </FormControl>
            </div>

            <List>
                {filteredFeedbacks.length > 0 ? filteredFeedbacks.slice(0, visibleFeedbacks).map((feedback) => {
                    const isExpanded = expandedCommentId === feedback._id;
                    const truncatedComment = feedback.comment.length > 100 && !isExpanded
                        ? `${feedback.comment.slice(0, 100)}...`
                        : feedback.comment;

                    return (
                        <ListItem key={feedback._id} alignItems="flex-start">
                            <ListItemText
                                primary={
                                    <>
                                        <Rating value={feedback.rating} readOnly precision={0.5} />
                                        <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                                            {feedback.user ? feedback.user.firstName : 'Unknown User'}
                                        </Typography>
                                        {' - '}
                                        <Typography variant="body2" component="span">
                                            {feedback.order ? `Order ID: ${feedback.order._id}` : 'Unknown Order'}
                                        </Typography>
                                        {' - '}
                                        <Typography variant="caption" color="textSecondary">
                                            {formatDate(feedback.createdAt)}
                                        </Typography>
                                    </>
                                }
                                secondary={
                                    <>
                                        <Typography variant="body2" component="p">
                                            {truncatedComment}
                                            {feedback.comment.length > 100 && (
                                                <Button
                                                    size="small"
                                                    onClick={() => toggleReadMoreLess(feedback._id)}
                                                    style={{ marginLeft: '8px' }}
                                                >
                                                    {isExpanded ? 'Read less' : 'Read more'}
                                                </Button>
                                            )}
                                        </Typography>

                                        {/* Display responses if any */}
                                        {feedback.responses && feedback.responses.length > 0 && (
                                            <div style={{ marginTop: '10px' }}>
                                                <Divider />
                                                <Typography variant="subtitle2" style={{ marginTop: '10px' }}>
                                                    Responses:
                                                </Typography>
                                                {feedback.responses.map((response, index) => (
                                                    <Typography variant="body2" key={index}>
                                                        <strong>{response.user.firstName || 'User'}:</strong> {response.comment}
                                                        <Typography variant="caption" color="textSecondary">
                                                            {' - '}{formatDate(response.createdAt)}
                                                        </Typography>
                                                    </Typography>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                }
                            />
                        </ListItem>
                    );
                }) : (
                    <Typography variant="body2" color="textSecondary">
                        No feedbacks found.
                    </Typography>
                )}
            </List>

            {/* Show More Button */}
            {visibleFeedbacks < filteredFeedbacks.length && (
                <Button variant="contained" color="primary" onClick={handleShowMore}>
                    Show More
                </Button>
            )}
        </>
    );
}
