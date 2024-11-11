
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import axios from '../../utils/api'; // Adjust the path as needed
import { Box, Button, TextField, Typography, IconButton, CircularProgress, Card, CardContent, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ProfileCard = styled(Card)(({ theme }) => ({
  maxWidth: 600,
  margin: 'auto',
  padding: theme.spacing(3),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  borderRadius: '50%',
  marginBottom: theme.spacing(2),
}));

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
});

const UserProfile = () => {
  const { user, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && token) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const response = await axios.get('/api/users/account', {
            headers: {
              Authorization: token,
            },
          });
          setProfile(response.data);
          setProfileImagePreview(response.data.profileImage ? `http://localhost:5000${response.data.profileImage}` : null);
          setError('');
        } catch (error) {
          setError('Error fetching profile');
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user, token]);

  const handleRemoveImage = async () => {
    try {
      await axios.delete('/api/users/profile-image', {
        headers: { Authorization: token },
      });
      setProfile((prevProfile) => ({
        ...prevProfile,
        profileImage: null,
      }));
      setProfileImagePreview(null); 
      setError('');
    } catch (error) {
      setError('Error removing profile image');
    }
  };

  const handleSubmit = async (values) => {
    const formDataToSend = new FormData();
    Object.keys(values).forEach((key) => {
      if (values[key] !== null) {
        formDataToSend.append(key, values[key]);
      }
    });

    try {
      const response = await axios.put('/api/users/profile', formDataToSend, {
        headers: {
          Authorization: token,
          'Content-Type': 'multipart/form-data',
        },
      });
      setProfile(response.data);
      setProfileImagePreview(response.data.profileImage ? `http://localhost:5000/uploads/${response.data.profileImage}` : null);
      setEditMode(false);
      setError('');
    } catch (error) {
      setError('Error updating profile');
    }
  };

  return (
    <ProfileCard>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : profile ? (
          <Box>
            {editMode ? (
              <Formik
                initialValues={{
                  firstName: profile.firstName || '',
                  lastName: profile.lastName || '',
                  email: profile.email || '',
                  phone: profile.phone || '',
                  address: profile.address || '',
                  profileImage: null,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue }) => (
                  <Form>
                    <Box mb={2} display="flex" flexDirection="column" alignItems="center">
                      <StyledAvatar
                        src={profileImagePreview || '/defaultProfileImage.png'}
                        alt="Profile Image"
                        onError={(e) => { e.target.src = '/defaultProfileImage.png'; }} 
                      />
                      <input
                        type="file"
                        name="profileImage"
                        id="profileImage"
                        style={{ display: 'none' }}
                        onChange={(event) => {
                          setFieldValue('profileImage', event.currentTarget.files[0]);
                          setProfileImagePreview(URL.createObjectURL(event.currentTarget.files[0]));
                        }}
                      />
                      <label htmlFor="profileImage">
                        <IconButton color="primary" component="span">
                          <PhotoCamera />
                        </IconButton>
                      </label>
                      {profileImagePreview && (
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleRemoveImage}
                          sx={{ mt: 1 }}
                        >
                          Remove Image
                        </Button>
                      )}
                    </Box>
                    <Field
                      as={TextField}
                      fullWidth
                      label="First Name"
                      name="firstName"
                      margin="normal"
                      helperText={<ErrorMessage name="firstName" />}
                      error={Boolean(<ErrorMessage name="firstName" />)}
                    />
                    <Field
                      as={TextField}
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      margin="normal"
                      helperText={<ErrorMessage name="lastName" />}
                      error={Boolean(<ErrorMessage name="lastName" />)}
                    />
                    <Field
                      as={TextField}
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      margin="normal"
                      helperText={<ErrorMessage name="email" />}
                      error={Boolean(<ErrorMessage name="email" />)}
                    />
                    <Field
                      as={TextField}
                      fullWidth
                      label="Phone"
                      name="phone"
                      margin="normal"
                      helperText={<ErrorMessage name="phone" />}
                      error={Boolean(<ErrorMessage name="phone" />)}
                    />
                    <Field
                      as={TextField}
                      fullWidth
                      label="Address"
                      name="address"
                      margin="normal"
                      helperText={<ErrorMessage name="address" />}
                      error={Boolean(<ErrorMessage name="address" />)}
                    />
                    <Box mt={2} display="flex" justifyContent="space-between">
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Form>
                )}
              </Formik>
            ) : (
              <Box>
                <StyledAvatar
                  src={profileImagePreview || '/defaultProfileImage.png'}
                  alt="Profile Image"
                  onError={(e) => { e.target.src = '/defaultProfileImage.png'; }} // Fallback in case of error
                />
                <Typography variant="h6">{profile.firstName} {profile.lastName}</Typography>
                <Typography variant="body2">{profile.email}</Typography>
                <Typography variant="body2">{profile.phone}</Typography>
                <Typography variant="body2">{profile.address}</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setEditMode(true)}
                  sx={{ mt: 2 }}
                >
                  Edit Profile
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Typography>No profile data</Typography>
        )}
      </CardContent>
    </ProfileCard>
  );
};

export default UserProfile;
