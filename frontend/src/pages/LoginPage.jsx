import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, Typography, Container, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router';
import axios from 'axios';
import CONFIG from '../config/config';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { login, selectAuth } from '../slices/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated} = useSelector(selectAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email regex for basic email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset error messages
    setEmailError('');
    setPasswordError('');

    let valid = true;

    // Email validation
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      valid = false;
    }

    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }

    // If validation passes, proceed with login
    if (valid) {
      const apiCall = axios.post(`${CONFIG.BASE_URL}/users/login`, {
        email,
        password
      }, {
        withCredentials: true,
      })
      toast.promise(
        apiCall,
        {
          pending: 'Logging in...',
          success: 'Login successfull!',
          error: {
            render({ data }) {
              return `${data?.response?.data?.message || "Error Logging in"}`
            }
          }
        }
      );
      try {
        setIsSubmitting(true);
        const response = await apiCall;
        console.log('API Response:', response.data);
        if (response.data.success) {
          dispatch(login(response.data.user));
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }finally{
        setIsSubmitting(false);
      }
      
    }
  };
useEffect(()=>{
  if(isAuthenticated){
    navigate('/home')
  }
},[isAuthenticated])
  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Paper elevation={3} sx={{ padding: 3 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>

          {/* Email Field */}
          <TextField
            label="Email"
            variant="outlined"
            margin="normal"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
          />

          {/* Password Field */}
          <TextField
            label="Password"
            variant="outlined"
            margin="normal"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
