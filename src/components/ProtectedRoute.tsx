import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, isTokenExpired } from '../stores/useAuthStore';

import { showGlobalToast } from '../services/apiClient';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'ADMIN' | 'CUSTOMER'>;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, token, logout } = useAuthStore();
  const location = useLocation();

  const isExpired = isTokenExpired(token);

  // 1. Unauthenticated / Expired redirect logic
  if (!isAuthenticated || isExpired) {
    if (isExpired && token) {
      logout();
    }
    if (location.pathname.startsWith('/admin')) {
      return <Navigate to="/admin-secure-gate" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // 2. Role authorization check logic
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If a standard customer tries to access admin management dashboards
    if (user.role === 'CUSTOMER' && location.pathname.startsWith('/admin')) {
      showGlobalToast("Ruxsat yo'q. Ushbu sahifaga kirish huquqingiz cheklangan.", 'error');
      return <Navigate to="/store" replace />;
    }
    
    // Fallback: unauthorized redirect to storefront catalog
    return <Navigate to="/store" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
