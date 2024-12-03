import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuth } from '../slices/authSlice';
import axios from 'axios'
import {toast} from 'react-toastify'
import CONFIG from '../config/config';
const RouteGuard = ({ allowedRoles }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(selectAuth);
  const dispatch = useDispatch()
  const verifyUser = async () => {
    const apiCall = axios.get(`${CONFIG.BASE_URL}/auth/verify`,
      {
        withCredentials: true,
      }
    );
    try {
      const response = await apiCall;
      console.log('API Response:', response.data);
      if(response.data.success===false){
          dispatch(logout());    
          navigate('/login');
      }
    } catch (error) {
      console.error('Error:', error);
      dispatch(logout());    
      navigate('/login');
    }
  };
  useEffect(() => {
    verifyUser();
  }, [])
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role.name.toUpperCase())) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RouteGuard;
