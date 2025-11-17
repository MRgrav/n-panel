import Login from './components/Auth/Login'
import Layout from './components/Layout/Layout'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import ProtectedRoute from './components/ProtectedRoute'
import { protectedRoutes } from './config/routesConfig'
import { UserRole } from './store/slices/authSlice'


const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
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
          
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </Provider>
  )
}

export default App