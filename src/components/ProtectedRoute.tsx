// components/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../store/slices/authSlice';
import { isTokenExpired } from '../utils/tokenUtils';
import { useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.accessToken && isTokenExpired(user.accessToken)) {
      // Token expired, logout user
      dispatch(logout());
      // You could also try to refresh token here instead of immediate logout
    }
  }, [user, dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;