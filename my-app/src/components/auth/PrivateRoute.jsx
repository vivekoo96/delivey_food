import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Add role-based access control if needed
  // if (role !== 'admin') {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return children;
};

export default ProtectedRoute;