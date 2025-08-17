import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../ui/Toast';
import { Modal, ModalContent, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import AuthService from '../../services/auth';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Edit, 
  Lock,
  Save,
  X
} from 'lucide-react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const authService = AuthService.getInstance();

  if (!user) return null;

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await authService.updateUser(user.id, {
        name: editForm.name,
        phone: editForm.phone
      });
      
      showToast('تم تحديث الملف الشخصي بنجاح', 'success');
      setIsEditing(false);
    } catch (error) {
      showToast('فشل في تحديث الملف الشخصي', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('كلمة المرور الجديدة غير متطابقة', 'error');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword(
        user.id,
        passwordForm.oldPassword,
        passwordForm.newPassword
      );
      
      showToast('تم تغيير كلمة المرور بنجاح', 'success');
      setShowChangePassword(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'فشل في تغيير كلمة المرور';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return t('مدير النظام', 'System Admin');
      case 'manager': return t('مدير الموظفين', 'Staff Manager');
      case 'technician': return t('فني التشخيص', 'Diagnostic Technician');
      default: return role;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'manager': return 'primary';
      case 'technician': return 'success';
      default: return 'gray';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('الملف الشخصي', 'User Profile')} size="lg">
      <ModalContent>
        <div className="space-y-6">
          {/* معلومات المستخدم الأساسية */}
          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <Badge variant={getRoleBadgeVariant(user.role)}>
                {getRoleLabel(user.role)}
              </Badge>
            </div>
          </div>

          {/* تفاصيل المستخدم */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* المعلومات الشخصية */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('المعلومات الشخصية', 'Personal Information')}
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('الاسم', 'Name')}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="w-4 h-4 inline mr-1" />
                    {t('البريد الإلكتروني', 'Email')}
                  </label>
                  <p className="text-gray-900">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone className="w-4 h-4 inline mr-1" />
                    {t('رقم الهاتف', 'Phone Number')}
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{user.phone || t('غير محدد', 'Not specified')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* معلومات الحساب */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {t('معلومات الحساب', 'Account Information')}
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('الدور', 'Role')}
                  </label>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    {t('تاريخ الإنشاء', 'Created Date')}
                  </label>
                  <p className="text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('آخر تسجيل دخول', 'Last Login')}
                  </label>
                  <p className="text-gray-900">
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleString('ar-SA')
                      : t('غير متوفر', 'Not available')
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('حالة الحساب', 'Account Status')}
                  </label>
                  <Badge variant={user.isActive ? 'success' : 'danger'}>
                    {user.isActive ? t('نشط', 'Active') : t('غير نشط', 'Inactive')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* الصلاحيات */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              {t('الصلاحيات', 'Permissions')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {authService.getUserPermissions(user).map((permission, index) => (
                <Badge key={index} variant="gray" size="sm">
                  {permission.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          {/* تغيير كلمة المرور */}
          {showChangePassword && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                {t('تغيير كلمة المرور', 'Change Password')}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('كلمة المرور الحالية', 'Current Password')}
                  </label>
                  <input
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('كلمة المرور الجديدة', 'New Password')}
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('تأكيد كلمة المرور', 'Confirm Password')}
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleChangePassword}
                    disabled={isLoading}
                    size="sm"
                  >
                    {t('حفظ كلمة المرور', 'Save Password')}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowChangePassword(false)}
                    size="sm"
                  >
                    {t('إلغاء', 'Cancel')}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </ModalContent>

      <ModalFooter>
        <div className="flex gap-3 justify-between w-full">
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t('حفظ', 'Save')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({ name: user.name, phone: user.phone || '' });
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  {t('إلغاء', 'Cancel')}
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {t('تعديل', 'Edit')}
              </Button>
            )}
            
            {!showChangePassword && (
              <Button
                variant="ghost"
                onClick={() => setShowChangePassword(true)}
              >
                <Lock className="w-4 h-4 mr-2" />
                {t('تغيير كلمة المرور', 'Change Password')}
              </Button>
            )}
          </div>

          <Button variant="ghost" onClick={onClose}>
            {t('إغلاق', 'Close')}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};