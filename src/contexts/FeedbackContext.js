import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/api';

export const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
    const [feedbacks, setFeedbacks] = useState([]);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get('/api/feedback');
                setFeedbacks(response.data);
            } catch (error) {
                console.error('Error fetching feedbacks', error);
            }
        };
        fetchFeedbacks();
    }, []);

    return (
        <FeedbackContext.Provider value={{ feedbacks, setFeedbacks }}>
            {children}
        </FeedbackContext.Provider>
    );
};
