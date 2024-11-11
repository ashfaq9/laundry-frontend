import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/common/HomePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import UserProfile from './components/user/UserProfile';
import AdminProfile from './components/admin/AdminProfile';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';
import ResetPassword from './components/auth/ResetPassword';
import UserList from './components/admin/UserList';
import './assets/css/app.css';
import ServiceList from './components/services/ServiceList';
import ServiceDetail from './components/services/ServiceDetail';
import AdminServiceList from './components/admin/AdminServiceList';
import ServiceManagement from './components/admin/ServiceManagement';
import Cart from './components/user/Cart'
import OrderForm from './components/user/OrderForm'
import PaymentForm from './components/user/PaymentForm';
import PaymentConfirmation from './components/user/PaymentConfirmation';
import OrderStatus from './components/user/OrderStatus';
import AdminOrderStatus from './components/admin/AdminOrderStatus';
import UserTransactions from './components/user/UserTransactions';
import AdminDashboard from './components/admin/AdminDashboard';
import FeedbackForm from './components/user/Feedback';
import FeedbackList from './components/user/FeedbackList';
import RespondFeedback from './components/admin/RespondFeedback';

const App = () => {
  return (
    <div id="root">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/services" element={<ServiceList />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          {/* <Route path="/add-feedback/:orderId" element={<FeedbackForm />} /> */}
          <Route path="/feedback-list" element={<FeedbackList />} />
          {/* <Route path="/respond" element={<RespondFeedback />} /> */}



          {/* User Routes */}
          {/* <Route
            path="/user/dashboard"
            element={
              <PrivateRoute allowedRoles={['user']}>
                <UserDashboard />
              </PrivateRoute>
            }
          /> */}
          <Route
            path="/user/profile"
            element={
              <PrivateRoute allowedRoles={['user']}>
                <UserProfile />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}

          <Route
            path="/admin/profile"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <UserList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminServiceList />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/edit-service/:id"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <ServiceManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/add-service"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <ServiceManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/cart"
            element={
              <PrivateRoute allowedRoles={['user']}>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/orderForm"
            element={
              <PrivateRoute allowedRoles={['user']}>
                <OrderForm />
              </PrivateRoute>
            }
          />
          <Route
            path='/payment/:orderId'
            element={
              <PrivateRoute allowedRoles={['user']}>
                <PaymentForm />
              </PrivateRoute>
            }
          />
          <Route
            path='/confirmation/:orderId'
            element={
              <PrivateRoute allowedRoles={['user']}>
                <PaymentConfirmation />
              </PrivateRoute>
            }
          />
          <Route
            path='/user/order-status'
            element={
              <PrivateRoute allowedRoles={['user']}>
                <OrderStatus />
              </PrivateRoute>
            }
          />
          <Route
            path='/admin/order-status'
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminOrderStatus />
              </PrivateRoute>
            }
          />
          <Route
            path='/user/transaction'
            element={
              <PrivateRoute allowedRoles={['user']}>
                <UserTransactions />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/respond"
            element={
              <PrivateRoute allowedRoles={['admin']}>
                <RespondFeedback />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-feedback/:orderId"
            element={
              <PrivateRoute allowedRoles={['user']}>
                <FeedbackForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
