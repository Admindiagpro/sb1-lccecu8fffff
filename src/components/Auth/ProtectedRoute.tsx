import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types/auth';
import AuthService from '../../services/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredRole?: User['role'];
  fallback?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredRole,
  fallback
}) => {
  const { user, isAuthenticated } = useAuth();
  const authService = AuthService.getInstance();

  // إذا لم يكن مسجل دخول
  if (!isAuthenticated || !user) {
    return fallback || <div>غير مصرح بالوصول</div>;
  }

  // التحقق من الدور المطلوب
  if (requiredRole && user.role !== requiredRole) {
    return fallback || <div>ليس لديك صلاحية للوصول إلى هذه الصفحة</div>;
  }

  // التحقق من الصلاحية المطلوبة
  if (requiredPermission && !authService.hasPermission(user, requiredPermission)) {
    return fallback || <div>ليس لديك صلاحية لهذا الإجراء</div>;
  }

  return <>{children}</>;
};