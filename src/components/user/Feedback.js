import React, { useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Button, TextField, Typography, Container, Rating, Box, Grid, Paper
} from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import { FeedbackContext } from '../../contexts/FeedbackContext';
import axios from '../../utils/api';
import { useParams } from 'react-router-dom';
import FeedbackList from './FeedbackList';

export default function FeedbackForm() {
    const { user } = useContext(AuthContext);
    const { setFeedbacks } = useContext(FeedbackContext);
    const { orderId } = useParams();

    const formik = useFormik({
        initialValues: {
            rating: 0, 
            comment: '',
            order: orderId || '',
        },
        validationSchema: Yup.object({
            rating: Yup.number()
                .min(1, 'Rating must be at least 1')
                .max(5, 'Rating must be 5 or less')
                .required('Rating is required'),
            comment: Yup.string().required('Comment is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const feedbackData = {
                    ...values,
                    rating: Number(values.rating),
                    user: user?._id,
                };
                await axios.post('/api/feedback', feedbackData);
                const response = await axios.get('/api/feedback');
                setFeedbacks(response.data);
                resetForm();
            } catch (error) {
                console.error('Error submitting feedback', error);
            }
        },
    });

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
                <Typography variant="h5" gutterBottom>
                    Add Feedback
                </Typography>
                {user ? (
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center">
                                    <Typography variant="subtitle1" style={{ marginRight: '10px' }}>
                                        Rating:
                                    </Typography>
                                    <Rating
                                        id="rating"
                                        name="rating"
                                        value={formik.values.rating}
                                        onChange={(event, newValue) => {
                                            formik.setFieldValue('rating', newValue);
                                        }}
                                        precision={0.5}
                                        size="large"
                                    />
                                </Box>
                                {formik.touched.rating && formik.errors.rating && (
                                    <Typography variant="body2" color="error">
                                        {formik.errors.rating}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    id="comment"
                                    name="comment"
                                    label="Comment"
                                    multiline
                                    rows={4}
                                    value={formik.values.comment}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.comment && Boolean(formik.errors.comment)}
                                    helperText={formik.touched.comment && formik.errors.comment}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    fullWidth
                                    type="submit"
                                    style={{
                                        backgroundColor: '#3f51b5',
                                        color: '#fff',
                                        padding: '10px 0',
                                    }}
                                >
                                    Submit Feedback
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                ) : (
                    <Typography variant="body1" color="error">
                        Please log in to submit feedback.
                    </Typography>
                )}
            </Paper>

            <FeedbackList />
        </Container>
    );
}
