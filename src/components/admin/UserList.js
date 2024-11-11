import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { Card, CardContent, Typography, Avatar, Box, CircularProgress, IconButton, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from '../../utils/api';
import { toast } from 'react-toastify'; // Importing toast for notifications

const UserCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(8),
  height: theme.spacing(8),
  marginRight: theme.spacing(2),
}));

const UserList = () => {
  const { users, fetchUsers, token } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    fetchUsers().finally(() => setLoading(false)); 
  }, [fetchUsers]);

  useEffect(() => {
    setFilteredUsers(
      users.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, users]);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/users/delete/users/${userId}`, {
          headers: { Authorization: token },
        });
        toast.success('User deleted successfully'); 
        fetchUsers(); 
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Error deleting user');
      }
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (filteredUsers.length === 0) {
    return <Typography>No users found</Typography>;
  }

  return (
    <Box sx={{ maxWidth: '800px', margin: 'auto', padding: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Users List
      </Typography>
      <TextField
        label="Search by Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />
      {filteredUsers.map((user) => (
        <UserCard key={user._id}>
          <Box display="flex" alignItems="center">
            <UserAvatar
              src={user.profileImage ? `${process.env.REACT_APP_API_BASE_URL}/uploads/${user.profileImage}` : '/defaultProfileImage.png'}
              alt={`${user.firstName} ${user.lastName}`}
            />
            <CardContent>
              <Typography variant="h6">{`${user.firstName} ${user.lastName}`}</Typography>
              <Typography variant="body2">{user.email}</Typography>
              <Typography variant="body2">{user.phone}</Typography>
              <Typography variant="body2">{user.address}</Typography>
            </CardContent>
          </Box>
          <IconButton color="secondary" onClick={() => handleDelete(user._id)}>
            <DeleteIcon />
          </IconButton>
        </UserCard>
      ))}
    </Box>
  );
};

export default UserList;
