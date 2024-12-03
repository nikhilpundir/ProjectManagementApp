import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectAuth } from '../slices/authSlice';
import axios from 'axios'
import {toast} from 'react-toastify'
import CONFIG from '../config/config';
const RouteGuard = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useSelector(selectAuth);
  const dispatch = useDispatch()
  const verifyUser = async () => {
    const apiCall = axios.get(`${CONFIG.BASE_URL}/auth/verify`,
      {
        headers:{
          Authorization:"eyJhbGd1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGRkYTYwMzE0MjgwY2Y0MGM5Yjk0NyIsImlhdCI6MTczMzI0NzE1OCwiZXhwIjoxNzMzMzMzNTU4fQ.HzoSMrjhHrCuOnfXjbTSDJnYlxtcU5OYBKOwE4qd6Xc"
        }
      }
    );

    toast.promise(
      apiCall,
      {
        // pending: 'Verifying user...',
        // success: 'User verified successfully!',
        error: {
          render({data}){
            // When the promise reject, data will contains the error
            console.log(data?.response?.data?.message);
            
            return `${data?.response?.data?.message || "Error verifying User"}`
          }
        }
      }
    );

    try {
      const response = await apiCall;
      console.log('API Response:', response.data);
      if(response.data.success===false){
          dispatch(logout())
      }
    } catch (error) {
      console.error('Error:', error);
      dispatch(logout())
    }
  };
  useEffect(() => {
    verifyUser();
  }, [])
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default RouteGuard;
