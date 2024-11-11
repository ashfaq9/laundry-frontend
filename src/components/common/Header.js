import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Fade, Slide } from 'react-awesome-reveal';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import '../../assets/css/Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    setScrolled(offset > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  let headerClasses = ['header'];
  if (scrolled) {
    headerClasses.push('scrolled');
  }
  if (user) {
    headerClasses.push(user.role === 'admin' ? 'admin' : 'user');
  } else {
    headerClasses.push('guest');
  }

  return (
    <AppBar
      position="fixed"
      className={headerClasses.join(' ')}
      elevation={0}
      sx={{
        background: scrolled
          ? 'linear-gradient(45deg, #6a11cb 30%, #2575fc 90%)'
          : 'transparent',
        transition: 'background 0.3s ease',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.1)' : 'none'
      }}
    >
      <Toolbar>
        <Fade triggerOnce direction="down">
          <nav>
            <Slide triggerOnce cascade damping={0.1}>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link
                  to="/"
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 600
                  }}
                >
                 Speed wash
                </Link>
              </Typography>
              <div className="nav-links">
                <Link to="/">Home</Link>
                

                {user ? (
                  <>
                    {user.role === 'admin' ? (
                      <>

                        <Link to="/admin/order-status">Order Management</Link>
                        <Link to="/admin/services">Service Management</Link>
                        <Link to="/admin/users">Users List</Link>
                        <Link to="/admin/dashboard">Dashboard</Link>
                        <Link to="/admin/profile">Admin Profile</Link>
                        <Link to="/respond">Feedback Management</Link>
                      </>
                    ) : (
                      <>
                      <Link to="/services">Services</Link>
                        <Link to="/user/cart">Cart</Link>
                        <Link to="/user/order-status">Order Status</Link>
                        <Link to="/user/profile">User Profile</Link>
                        <Link to="/feedback-list">Feedback</Link>
                        <Link to="/user/transaction">Transaction </Link>
                      </>
                    )}
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={logout}
                      sx={{ ml: 2 }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                  <Link to="/services">Services</Link>
                    <Link to="/feedback-list">Feedback</Link>
                    <Link to="/login">Login/Register</Link>
           
          
    
                  </>
                )}
              </div>
            </Slide>
          </nav>
        </Fade>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
