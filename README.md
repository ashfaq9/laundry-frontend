# Laundry Service Management System - Frontend  

This repository contains the frontend code for the Laundry Service Management System, built to provide a user-friendly interface for managing laundry services.  

## Purpose  
The purpose of this project is to simplify laundry service management for both users and administrators. Users can easily register, book services, manage orders, and make payments online, while administrators can handle service management, user data, and order tracking efficiently.  

## Features  
### **User Features:**  
- **User Authentication:**  
  - Registration and login functionality with form validation.  
- **Profile Management:**  
  - Update profile details and change passwords.  
- **Service Booking:**  
  - Browse available services and place orders.  
- **Order Tracking:**  
  - View order history and current order status.  
- **Payment Integration:**  
  - Secure payment handling with Stripe API.  
- **Feedback System:**  
  - Submit feedback for completed orders.  
- **Notifications:**  
  - Receive updates for order status and changes.  

### **Admin Features:**  
- **Service Management:**  
  - Add, update, or remove laundry services.  
- **Order Management:**  
  - View and update order statuses.  
- **Dashboard Analytics:**  
  - Overview of orders and user activities.  
- **Transaction Filters:**  
  - View transactions based on date range.  
- **PDF Generation:**  
  - Download order and transaction summaries as PDFs.  

## Tech Stack  
- **React.js**: JavaScript library for building user interfaces  
- **Material-UI**: UI component library for responsive design  
- **UseState**: State management for login, register, profile updates, and authentication  
- **Redux**: State management for handling application-wide state  
- **Formik & Yup**: Form handling and validation  
- **Multer**: File upload for profile pictures and other documents  
- **Stripe API**: Secure payment processing  

## Installation  
1. Clone the repository:  
   ```bash
   git clone https://github.com/ashfaq9/laundry-frontend.git
   cd laundry-frontend
