import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { showGlobalToast } from '../services/apiClient';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'ADMIN' | 'CUSTOMER'>;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // 1. Unauthenticated redirect logic
  if (!isAuthenticated) {
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
