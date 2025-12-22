// App.tsx
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { logout } from './store/slices/authSlice';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { protectedRoutes } from './config/routesConfig';
import { UserRole } from './store/slices/authSlice';
import { isTokenExpired } from './utils/tokenUtils';

// Token checker component
const TokenChecker = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const userStr = localStorage.getItem('user');
        
        // If no token or user data, ensure logout
        if (!accessToken || !userStr) {
          dispatch(logout());
          return;
        }

        // Check if token is expired
        if (isTokenExpired(accessToken)) {
          console.log('Token expired, logging out...');
          dispatch(logout());
          
          // Optional: Clear any pending API calls
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      } catch (error) {
        console.error('Error checking token:', error);
        dispatch(logout());
      }
    };

    // Check token immediately on mount
    checkToken();

    // Set up periodic token check (every 30 seconds)
    const interval = setInterval(checkToken, 30000);

    // Check token on window focus (user comes back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkToken();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch]);

  return null;
};

// Main App component
const AppContent = () => {
  return (
    <>
      <TokenChecker />
      <Router>
        <Routes>
          {/* Public route - Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {protectedRoutes.map((route, index) => (
              <Route 
                key={index}
                path={route.path}
                element={
                  <ProtectedRoute allowedRoles={route.roles as UserRole[]}>
                    {route.element}
                  </ProtectedRoute>
                }
              />
            ))}
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </>
  );
};

// Main App wrapper with Redux Provider
const App = () => {
  // Initialize app - check auth state on first load
  useEffect(() => {
    const initializeApp = () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userStr = localStorage.getItem('user');
        
        if (accessToken && refreshToken && userStr) {
          // Token will be validated by TokenChecker component
          console.log('App initialized with stored authentication');
        } else {
          console.log('App initialized without authentication');
        }
      } catch (error) {
        console.error('Error initializing app:', error);
        // Clear any corrupt data
        localStorage.clear();
      }
    };

    initializeApp();
  }, []);

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;