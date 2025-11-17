import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { UserRole } from '../store/slices/authSlice';

export const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  
  const hasRole = (roles: UserRole[]) => {
    return user && roles.includes(user.role);
  };

  const canAccessMaster = () => {
    return hasRole(['ADMIN', ]);
  };

  const canAccessEmployee = () => {
    return hasRole(['ADMIN',]);
  };

  const canManagePolicies = () => {
    return hasRole(['ADMIN',]);
  };

  const canManageLeads = () => {
    return hasRole(['ADMIN', ]);
  };

  return {
    user,
    isAuthenticated,
    loading,
    hasRole,
    canAccessMaster,
    canAccessEmployee,
    canManagePolicies,
    canManageLeads,
  };
};