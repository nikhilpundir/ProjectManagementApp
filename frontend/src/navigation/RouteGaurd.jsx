import React from 'react';
import { Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import { selectAuth } from '../slices/authSlice';

const RouteGuard = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector(selectAuth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RouteGuard;
