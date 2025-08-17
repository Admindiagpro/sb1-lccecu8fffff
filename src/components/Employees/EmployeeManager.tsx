import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../ui/Toast';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal, ModalContent, ModalFooter } from '../ui/Modal';
import AuthService from '../../services/auth';
import { User } from '../../types/auth';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  UserCheck,
  UserX,
  Calendar,
  Phone,
  Mail,
  Shield,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Award,
  Target
} from 'lucide-react';

export const EmployeeManager: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const authService = AuthService.getInstance();

  // تحميل الموظفين عند بدء التشغيل
  React.useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    try {
      const allUsers = authService.getAllUsers();
      setEmployees(allUsers);
    } catch (error) {
      showToast('فشل في تحميل بيانات الموظفين', 'error');
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || emp.role === filterRole;
    return matchesSearch && matchesRole;
  });

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

  const getEmployeeStats = () => {
    const total = employees.length;
    const active = employees.filter(emp => emp.isActive).length;
    const admins = employees.filter(emp => emp.role === 'admin').length;
    const managers = employees.filter(emp => emp.role === 'manager').length;
    const technicians = employees.filter(emp => emp.role === 'technician').length;
    
    return { total, active, admins, managers, technicians };
  };

  const stats = getEmployeeStats();

  const handleDeleteEmployee = async (employeeId: string) => {
    if (employeeId === user?.id) {
      showToast('لا يمكنك حذف حسابك الخاص', 'error');
      return;
    }

    if (window.confirm(t('هل أنت متأكد من حذف هذا الموظف؟', 'Are you sure you want to delete this employee?'))) {
      try {
        await authService.deleteUser(employeeId);
        loadEmployees();
        showToast('تم حذف الموظف بنجاح', 'success');
      } catch (error) {
        showToast('فشل في حذف الموظف', 'error');
      }
    }
  };

  const handleToggleStatus = async (employee: User) => {
    try {
      await authService.updateUser(employee.id, { isActive: !employee.isActive });
      loadEmployees();
      showToast(
        employee.isActive ? 'تم إلغاء تفعيل الموظف' : 'تم تفعيل الموظف',
        'success'
      );
    } catch (error) {
      showToast('فشل في تحديث حالة الموظف', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة والإحصائيات */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-secondary">
            {t('إدارة الموظفين', 'Employee Management')}
          </h1>
          <p className="text-brand-black-600 mt-1 font-medium">
            {t('إدارة شاملة للموظفين مع تتبع الأداء', 'Comprehensive employee management with performance tracking')}
          </p>
        </div>

        {/* إحصائيات سريعة */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gradient-to-r from-brand-yellow-100 to-brand-yellow-200 p-4 rounded-lg border-2 border-brand-yellow-300 text-center">
            <div className="text-2xl font-bold text-brand-secondary">{stats.total}</div>
            <div className="text-sm text-brand-black-700 font-medium">{t('إجمالي', 'Total')}</div>
          </div>
          <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg border-2 border-green-300 text-center">
            <div className="text-2xl font-bold text-green-700">{stats.active}</div>
            <div className="text-sm text-green-700 font-medium">{t('نشط', 'Active')}</div>
          </div>
          <div className="bg-gradient-to-r from-red-100 to-red-200 p-4 rounded-lg border-2 border-red-300 text-center">
            <div className="text-2xl font-bold text-red-700">{stats.admins}</div>
            <div className="text-sm text-red-700 font-medium">{t('مدراء', 'Admins')}</div>
          </div>
          <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg border-2 border-blue-300 text-center">
            <div className="text-2xl font-bold text-blue-700">{stats.managers}</div>
            <div className="text-sm text-blue-700 font-medium">{t('مشرفين', 'Managers')}</div>
          </div>
          <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg border-2 border-purple-300 text-center">
            <div className="text-2xl font-bold text-purple-700">{stats.technicians}</div>
            <div className="text-sm text-purple-700 font-medium">{t('فنيين', 'Technicians')}</div>
          </div>
        </div>
      </div>

      {/* أدوات البحث والتصفية */}
      <Card className="border-2 border-brand-yellow-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* البحث */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-black-400" />
                <input
                  type="text"
                  placeholder={t('البحث بالاسم أو البريد الإلكتروني...', 'Search by name or email...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200"
                />
              </div>
            </div>

            {/* تصفية الأدوار */}
            <div className="lg:w-48">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200"
              >
                <option value="all">{t('جميع الأدوار', 'All Roles')}</option>
                <option value="admin">{t('مدير النظام', 'System Admin')}</option>
                <option value="manager">{t('مدير الموظفين', 'Staff Manager')}</option>
                <option value="technician">{t('فني التشخيص', 'Diagnostic Technician')}</option>
              </select>
            </div>

            {/* أزرار الإجراءات */}
            <div className="flex gap-3">
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 me-2" />
                {t('تصفية متقدمة', 'Advanced Filter')}
              </Button>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 me-2" />
                {t('موظف جديد', 'New Employee')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* قائمة الموظفين */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <Card key={employee.id} className="hover:shadow-xl transition-all duration-300 border-2 border-brand-yellow-200 shadow-lg hover:border-brand-yellow-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={employee.avatar || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150`}
                    alt={employee.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-brand-yellow-300"
                  />
                  <div>
                    <h3 className="font-bold text-brand-secondary">{employee.name}</h3>
                    <p className="text-sm text-brand-black-600">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={employee.isActive ? 'success' : 'gray'} size="sm">
                    {employee.isActive ? t('نشط', 'Active') : t('غير نشط', 'Inactive')}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-brand-black-600 font-medium">{t('الدور:', 'Role:')}</span>
                  <Badge variant={getRoleBadgeVariant(employee.role)} size="sm">
                    {getRoleLabel(employee.role)}
                  </Badge>
                </div>

                {employee.phone && (
                  <div className="flex items-center gap-2 text-sm text-brand-black-600">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-brand-black-600">
                  <Calendar className="w-4 h-4" />
                  <span>{t('انضم في:', 'Joined:')} {new Date(employee.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>

                {employee.lastLogin && (
                  <div className="flex items-center gap-2 text-sm text-brand-black-600">
                    <Clock className="w-4 h-4" />
                    <span>{t('آخر دخول:', 'Last login:')} {new Date(employee.lastLogin).toLocaleDateString('ar-SA')}</span>
                  </div>
                )}
              </div>

              {/* أزرار الإجراءات */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setShowDetailsModal(true);
                  }}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 me-2" />
                  {t('عرض', 'View')}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setShowEditModal(true);
                  }}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 me-2" />
                  {t('تعديل', 'Edit')}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleStatus(employee)}
                  className={`flex-1 ${employee.isActive ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-green-50 hover:text-green-600'}`}
                >
                  {employee.isActive ? (
                    <>
                      <UserX className="w-4 h-4 me-2" />
                      {t('إلغاء', 'Disable')}
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 me-2" />
                      {t('تفعيل', 'Enable')}
                    </>
                  )}
                </Button>

                {employee.id !== user?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* رسالة عدم وجود نتائج */}
      {filteredEmployees.length === 0 && (
        <Card className="border-2 border-brand-yellow-200">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-brand-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-brand-yellow-300">
              <Users className="w-8 h-8 text-brand-secondary" />
            </div>
            <h3 className="text-lg font-bold text-brand-secondary mb-2">
              {t('لا توجد نتائج', 'No Results Found')}
            </h3>
            <p className="text-brand-black-600">
              {t('لم يتم العثور على موظفين يطابقون معايير البحث', 'No employees found matching the search criteria')}
            </p>
          </CardContent>
        </Card>
      )}

      {/* نوافذ منبثقة */}
      <CreateEmployeeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadEmployees();
          setShowCreateModal(false);
        }}
      />

      <EditEmployeeModal
        isOpen={showEditModal}
        employee={selectedEmployee}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEmployee(null);
        }}
        onSuccess={() => {
          loadEmployees();
          setShowEditModal(false);
          setSelectedEmployee(null);
        }}
      />

      <EmployeeDetailsModal
        isOpen={showDetailsModal}
        employee={selectedEmployee}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedEmployee(null);
        }}
      />
    </div>
  );
};

// مكون إنشاء موظف جديد
const CreateEmployeeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'technician' as User['role'],
    phone: '',
    isActive: true
  });

  const authService = AuthService.getInstance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showToast('كلمات المرور غير متطابقة', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.addUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        isActive: formData.isActive,
        password: formData.password
      });
      
      showToast('تم إنشاء الموظف بنجاح', 'success');
      onSuccess();
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'technician',
        phone: '',
        isActive: true
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'فشل في إنشاء الموظف';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('إضافة موظف جديد', 'Add New Employee')} size="lg">
      <ModalContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-secondary mb-2">
                {t('الاسم الكامل', 'Full Name')}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200"
                placeholder={t('أدخل الاسم الكامل', 'Enter full name')}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-secondary mb-2">
                {t('البريد الإلكتروني', 'Email')}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200"
                placeholder={t('أدخل البريد الإلكتروني', 'Enter email address')}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-secondary mb-2">
                {t('كلمة المرور', 'Password')}
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200"
                placeholder={t('أدخل كلمة المرور', 'Enter password')}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-secondary mb-2">
                {t('تأكيد كلمة المرور', 'Confirm Password')}
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200"
                placeholder={t('أعد إدخال كلمة المرور', 'Re-enter password')}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-secondary mb-2">
                {t('الدور الوظيفي', 'Job Role')}
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200"
              >
                <option value="technician">{t('فني التشخيص', 'Diagnostic Technician')}</option>
                <option value="manager">{t('مدير الموظفين', 'Staff Manager')}</option>
                <option value="admin">{t('مدير النظام', 'System Admin')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-secondary mb-2">
                {t('رقم الهاتف', 'Phone Number')}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200"
                placeholder={t('أدخل رقم الهاتف', 'Enter phone number')}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-brand-secondary">
              {t('تفعيل الحساب فوراً', 'Activate account immediately')}
            </label>
          </div>
        </form>
      </ModalContent>

      <ModalFooter>
        <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? t('جاري الإنشاء...', 'Creating...') : t('إنشاء الموظف', 'Create Employee')}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          {t('إلغاء', 'Cancel')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

// مكون تعديل الموظف
const EditEmployeeModal: React.FC<{
  isOpen: boolean;
  employee: User | null;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, employee, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'technician' as User['role'],
    phone: '',
    isActive: true
  });

  const authService = AuthService.getInstance();

  React.useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        role: employee.role,
        phone: employee.phone || '',
        isActive: employee.isActive
      });
    }
  }, [employee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    setIsLoading(true);
    try {
      await authService.updateUser(employee.id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        isActive: formData.isActive
      });
      
      showToast('تم تحديث بيانات الموظف بنجاح', 'success');
      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'فشل في تحديث بيانات الموظف';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!employee) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('تعديل بيانات الموظف', 'Edit Employee')} size="lg">
      <ModalContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-brand-secondary mb-2">
                {t('الاسم الكامل', 'Full Name')}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-secondary mb-2">
                {t('البريد الإلكتروني', 'Email')}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-secondary mb-2">
                {t('الدور الوظيفي', 'Job Role')}
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200"
              >
                <option value="technician">{t('فني التشخيص', 'Diagnostic Technician')}</option>
                <option value="manager">{t('مدير الموظفين', 'Staff Manager')}</option>
                <option value="admin">{t('مدير النظام', 'System Admin')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-brand-secondary mb-2">
                {t('رقم الهاتف', 'Phone Number')}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActiveEdit"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
            />
            <label htmlFor="isActiveEdit" className="text-sm font-medium text-brand-secondary">
              {t('الحساب نشط', 'Account is active')}
            </label>
          </div>
        </form>
      </ModalContent>

      <ModalFooter>
        <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? t('جاري التحديث...', 'Updating...') : t('حفظ التغييرات', 'Save Changes')}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          {t('إلغاء', 'Cancel')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

// مكون تفاصيل الموظف
const EmployeeDetailsModal: React.FC<{
  isOpen: boolean;
  employee: User | null;
  onClose: () => void;
}> = ({ isOpen, employee, onClose }) => {
  const { t } = useLanguage();
  const authService = AuthService.getInstance();

  if (!employee) return null;

  const permissions = authService.getUserPermissions(employee);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return t('مدير النظام', 'System Admin');
      case 'manager': return t('مدير الموظفين', 'Staff Manager');
      case 'technician': return t('فني التشخيص', 'Diagnostic Technician');
      default: return role;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('تفاصيل الموظف', 'Employee Details')} size="lg">
      <ModalContent>
        <div className="space-y-6">
          {/* معلومات أساسية */}
          <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-brand-yellow-50 to-brand-yellow-100 rounded-xl border-2 border-brand-yellow-200">
            <img
              src={employee.avatar || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150`}
              alt={employee.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-brand-yellow-300 shadow-lg"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-brand-secondary">{employee.name}</h3>
              <p className="text-brand-black-600 mb-2">{employee.email}</p>
              <Badge variant={employee.role === 'admin' ? 'danger' : employee.role === 'manager' ? 'primary' : 'success'}>
                {getRoleLabel(employee.role)}
              </Badge>
            </div>
            <div className="text-center">
              <Badge variant={employee.isActive ? 'success' : 'gray'} size="sm">
                {employee.isActive ? t('نشط', 'Active') : t('غير نشط', 'Inactive')}
              </Badge>
            </div>
          </div>

          {/* تفاصيل الاتصال */}
          <div>
            <h4 className="text-lg font-bold text-brand-secondary mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              {t('معلومات الاتصال', 'Contact Information')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-brand-secondary" />
                  <span className="font-medium text-brand-secondary">{t('البريد الإلكتروني', 'Email')}</span>
                </div>
                <p className="text-brand-black-700">{employee.email}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-brand-secondary" />
                  <span className="font-medium text-brand-secondary">{t('رقم الهاتف', 'Phone Number')}</span>
                </div>
                <p className="text-brand-black-700">{employee.phone || t('غير محدد', 'Not specified')}</p>
              </div>
            </div>
          </div>

          {/* معلومات الحساب */}
          <div>
            <h4 className="text-lg font-bold text-brand-secondary mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t('معلومات الحساب', 'Account Information')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-brand-secondary" />
                  <span className="font-medium text-brand-secondary">{t('تاريخ الإنشاء', 'Created Date')}</span>
                </div>
                <p className="text-brand-black-700">{new Date(employee.createdAt).toLocaleDateString('ar-SA')}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-brand-secondary" />
                  <span className="font-medium text-brand-secondary">{t('آخر تسجيل دخول', 'Last Login')}</span>
                </div>
                <p className="text-brand-black-700">
                  {employee.lastLogin 
                    ? new Date(employee.lastLogin).toLocaleString('ar-SA')
                    : t('لم يسجل دخول بعد', 'Never logged in')
                  }
                </p>
              </div>
            </div>
          </div>

          {/* الصلاحيات */}
          <div>
            <h4 className="text-lg font-bold text-brand-secondary mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t('الصلاحيات', 'Permissions')}
            </h4>
            <div className="flex flex-wrap gap-2">
              {permissions.map((permission, index) => (
                <Badge key={index} variant="gray" size="sm">
                  {permission.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          {/* إحصائيات الأداء (محاكاة) */}
          <div>
            <h4 className="text-lg font-bold text-brand-secondary mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t('إحصائيات الأداء', 'Performance Statistics')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                <div className="text-2xl font-bold text-green-700">24</div>
                <div className="text-sm text-green-600 font-medium">{t('المهام المكتملة', 'Completed Tasks')}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-700">5</div>
                <div className="text-sm text-blue-600 font-medium">{t('المهام الجارية', 'Active Tasks')}</div>
              </div>
              <div className="p-4 bg-brand-yellow-50 rounded-lg border border-brand-yellow-200 text-center">
                <div className="text-2xl font-bold text-brand-secondary">92%</div>
                <div className="text-sm text-brand-black-600 font-medium">{t('معدل الإنجاز', 'Completion Rate')}</div>
              </div>
            </div>
          </div>
        </div>
      </ModalContent>

      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          {t('إغلاق', 'Close')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};