import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom'; 

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate(); 

  const logout = useCallback(() => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/users/account', {
            headers: {
              Authorization: token,
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Fetched User:', response.data); 
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error('Error fetching user', error);
          logout();
        }
      }
    };
    fetchUser();
  }, [token, logout]);

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/users/login', credentials);
      const { token, ...userData } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users/admin/users', {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, fetchUsers, users }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
