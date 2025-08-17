import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/Toast';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal, ModalContent, ModalFooter } from '../ui/Modal';
import AuthService from '../../services/auth';
import { User } from '../../types/auth';
import { 
  Settings, 
  User as UserIcon, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Database,
  Wifi,
  Monitor,
  Volume2,
  Moon,
  Sun,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Plus,
  Edit,
  UserCheck,
  UserX,
  Calendar,
  Phone,
  Mail,
  Activity,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Award,
  Target,
  Users
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { t, toggleLanguage, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('general');
  const [employees, setEmployees] = useState<User[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    // إعدادات عامة
    language: currentLanguage.code,
    theme: 'light',
    autoSave: true,
    notifications: true,
    soundEnabled: true,
    compactMode: false,
    animationsEnabled: true,
    
    // إعدادات الأمان
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    autoLockScreen: false,
    
    // إعدادات النظام
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: 365,
    logLevel: 'info',
    maxFileSize: 10,
    
    // إعدادات الواجهة
    sidebarCollapsed: false,
    showAvatars: true,
    showOnlineStatus: true,
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '24h'
  });

  const authService = AuthService.getInstance();

  // تحميل الإعدادات والموظفين عند بدء التشغيل
  useEffect(() => {
    loadSettings();
    loadEmployees();
  }, []);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('app_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('خطأ في تحميل الإعدادات:', error);
    }
  };

  const loadEmployees = () => {
    try {
      const allUsers = authService.getAllUsers();
      setEmployees(allUsers);
    } catch (error) {
      showToast('فشل في تحميل بيانات الموظفين', 'error');
    }
  };

  const tabs = [
    { id: 'general', label: t('عام', 'General'), icon: Settings },
    { id: 'employees', label: t('الموظفين', 'Employees'), icon: Users },
    { id: 'security', label: t('الأمان', 'Security'), icon: Shield },
    { id: 'notifications', label: t('الإشعارات', 'Notifications'), icon: Bell },
    { id: 'appearance', label: t('المظهر', 'Appearance'), icon: Palette },
    { id: 'system', label: t('النظام', 'System'), icon: Database },
    { id: 'backup', label: t('النسخ الاحتياطي', 'Backup'), icon: Download }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // تطبيق بعض الإعدادات فوراً
    if (key === 'language') {
      if (value !== currentLanguage.code) {
        toggleLanguage();
      }
    }
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('app_settings', JSON.stringify(settings));
      showToast(t('تم حفظ الإعدادات بنجاح', 'Settings saved successfully'), 'success');
      
      // تطبيق الإعدادات على النظام
      applySettings();
    } catch (error) {
      showToast(t('فشل في حفظ الإعدادات', 'Failed to save settings'), 'error');
    }
  };

  const applySettings = () => {
    // تطبيق إعدادات الواجهة
    document.documentElement.style.setProperty('--animations-enabled', settings.animationsEnabled ? '1' : '0');
    
    // تطبيق إعدادات الصوت
    if (!settings.soundEnabled) {
      // إيقاف جميع الأصوات
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => audio.muted = true);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm(t('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟', 'Are you sure you want to reset all settings?'))) {
      localStorage.removeItem('app_settings');
      setSettings({
        language: 'ar',
        theme: 'light',
        autoSave: true,
        notifications: true,
        soundEnabled: true,
        compactMode: false,
        animationsEnabled: true,
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
        loginAttempts: 5,
        autoLockScreen: false,
        autoBackup: true,
        backupFrequency: 'daily',
        dataRetention: 365,
        logLevel: 'info',
        maxFileSize: 10,
        sidebarCollapsed: false,
        showAvatars: true,
        showOnlineStatus: true,
        dateFormat: 'dd/mm/yyyy',
        timeFormat: '24h'
      });
      showToast(t('تم إعادة تعيين الإعدادات', 'Settings reset successfully'), 'success');
    }
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(t('تم تصدير الإعدادات', 'Settings exported'), 'success');
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings(prev => ({ ...prev, ...importedSettings }));
        showToast(t('تم استيراد الإعدادات بنجاح', 'Settings imported successfully'), 'success');
      } catch (error) {
        showToast(t('فشل في استيراد الإعدادات', 'Failed to import settings'), 'error');
      }
    };
    reader.readAsText(file);
  };

  // إدارة الموظفين
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || emp.role === filterRole;
    return matchesSearch && matchesRole;
  });

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

  const getEmployeeStats = () => {
    const total = employees.length;
    const active = employees.filter(emp => emp.isActive).length;
    const admins = employees.filter(emp => emp.role === 'admin').length;
    const managers = employees.filter(emp => emp.role === 'manager').length;
    const technicians = employees.filter(emp => emp.role === 'technician').length;
    
    return { total, active, admins, managers, technicians };
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

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-brand-secondary mb-6 flex items-center gap-3">
          <Settings className="w-6 h-6" />
          {t('الإعدادات العامة', 'General Settings')}
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-yellow-50 to-brand-yellow-100 rounded-lg border-2 border-brand-yellow-200">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-brand-secondary">{t('اللغة', 'Language')}</p>
                <p className="text-sm text-brand-black-600">{t('اختر لغة الواجهة', 'Choose interface language')}</p>
              </div>
            </div>
            <select
              value={settings.language}
              onChange={(e) => handleSettingChange('language', e.target.value)}
              className="px-4 py-2 border-2 border-brand-yellow-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary bg-white"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-yellow-50 to-brand-yellow-100 rounded-lg border-2 border-brand-yellow-200">
            <div className="flex items-center gap-3">
              <Monitor className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-semibold text-brand-secondary">{t('المظهر', 'Theme')}</p>
                <p className="text-sm text-brand-black-600">{t('اختر مظهر الواجهة', 'Choose interface theme')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleSettingChange('theme', 'light')}
                className={`p-2 rounded-lg border-2 transition-all ${settings.theme === 'light' ? 'bg-brand-primary text-brand-secondary border-brand-yellow-400' : 'bg-white text-gray-600 border-gray-300 hover:border-brand-yellow-300'}`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSettingChange('theme', 'dark')}
                className={`p-2 rounded-lg border-2 transition-all ${settings.theme === 'dark' ? 'bg-brand-primary text-brand-secondary border-brand-yellow-400' : 'bg-white text-gray-600 border-gray-300 hover:border-brand-yellow-300'}`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-yellow-50 to-brand-yellow-100 rounded-lg border-2 border-brand-yellow-200">
            <div className="flex items-center gap-3">
              <Save className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-brand-secondary">{t('الحفظ التلقائي', 'Auto Save')}</p>
                <p className="text-sm text-brand-black-600">{t('حفظ التغييرات تلقائياً', 'Save changes automatically')}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSave}
                onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-yellow-50 to-brand-yellow-100 rounded-lg border-2 border-brand-yellow-200">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-semibold text-brand-secondary">{t('الأصوات', 'Sounds')}</p>
                <p className="text-sm text-brand-black-600">{t('تفعيل أصوات الإشعارات', 'Enable notification sounds')}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-brand-yellow-50 to-brand-yellow-100 rounded-lg border-2 border-brand-yellow-200">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-brand-secondary">{t('الرسوم المتحركة', 'Animations')}</p>
                <p className="text-sm text-brand-black-600">{t('تفعيل الرسوم المتحركة والانتقالات', 'Enable animations and transitions')}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.animationsEnabled}
                onChange={(e) => handleSettingChange('animationsEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmployeeSettings = () => {
    const stats = getEmployeeStats();
    
    return (
      <div className="space-y-6">
        {/* إحصائيات الموظفين */}
        <div>
          <h3 className="text-xl font-bold text-brand-secondary mb-6 flex items-center gap-3">
            <Users className="w-6 h-6" />
            {t('إدارة الموظفين', 'Employee Management')}
          </h3>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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

        {/* أدوات البحث والإضافة */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-black-400" />
              <input
                type="text"
                placeholder={t('البحث بالاسم أو البريد الإلكتروني...', 'Search by name or email...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200"
              />
            </div>
          </div>

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

          <Button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-brand-primary to-brand-yellow-400 hover:from-brand-yellow-400 hover:to-brand-yellow-300">
            <Plus className="w-4 h-4 me-2" />
            {t('إضافة موظف', 'Add Employee')}
          </Button>
        </div>

        {/* قائمة الموظفين */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                {/* إحصائيات الموظف */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <h4 className="font-medium text-brand-secondary mb-2 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    {t('إحصائيات الأداء', 'Performance Stats')}
                  </h4>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {Math.floor(Math.random() * 50) + 10}
                      </div>
                      <div className="text-xs text-gray-600">{t('مهام مكتملة', 'Completed')}</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-orange-600">
                        {Math.floor(Math.random() * 10) + 1}
                      </div>
                      <div className="text-xs text-gray-600">{t('مهام جارية', 'Active')}</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-brand-secondary">
                        {Math.floor(Math.random() * 20) + 80}%
                      </div>
                      <div className="text-xs text-gray-600">{t('معدل الإنجاز', 'Success Rate')}</div>
                    </div>
                  </div>
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
      </div>
    );
  };

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-brand-secondary mb-6 flex items-center gap-3">
          <Shield className="w-6 h-6" />
          {t('إعدادات الأمان', 'Security Settings')}
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border-2 border-red-200">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-semibold text-red-900">{t('المصادقة الثنائية', 'Two-Factor Authentication')}</p>
                <p className="text-sm text-red-700">{t('حماية إضافية للحساب', 'Additional account protection')}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">{t('انتهاء الجلسة', 'Session Timeout')}</p>
                <p className="text-sm text-blue-700">{t('مدة انتهاء الجلسة بالدقائق', 'Session timeout in minutes')}</p>
              </div>
            </div>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              className="px-4 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value={15}>15 {t('دقيقة', 'minutes')}</option>
              <option value={30}>30 {t('دقيقة', 'minutes')}</option>
              <option value={60}>60 {t('دقيقة', 'minutes')}</option>
              <option value={120}>120 {t('دقيقة', 'minutes')}</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-semibold text-purple-900">{t('محاولات تسجيل الدخول', 'Login Attempts')}</p>
                <p className="text-sm text-purple-700">{t('عدد المحاولات المسموحة', 'Number of allowed attempts')}</p>
              </div>
            </div>
            <select
              value={settings.loginAttempts}
              onChange={(e) => handleSettingChange('loginAttempts', parseInt(e.target.value))}
              className="px-4 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value={3}>3 {t('محاولات', 'attempts')}</option>
              <option value={5}>5 {t('محاولات', 'attempts')}</option>
              <option value={10}>10 {t('محاولات', 'attempts')}</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-semibold text-orange-900">{t('قفل الشاشة التلقائي', 'Auto Screen Lock')}</p>
                <p className="text-sm text-orange-700">{t('قفل الشاشة عند عدم النشاط', 'Lock screen when inactive')}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoLockScreen}
                onChange={(e) => handleSettingChange('autoLockScreen', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-brand-secondary mb-6 flex items-center gap-3">
          <Bell className="w-6 h-6" />
          {t('إعدادات الإشعارات', 'Notification Settings')}
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-200">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-900">{t('الإشعارات العامة', 'General Notifications')}</p>
                <p className="text-sm text-yellow-700">{t('تفعيل جميع الإشعارات', 'Enable all notifications')}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'taskNotifications', label: t('إشعارات المهام', 'Task Notifications'), icon: '📋', enabled: true },
              { key: 'messageNotifications', label: t('إشعارات الرسائل', 'Message Notifications'), icon: '💬', enabled: true },
              { key: 'systemNotifications', label: t('إشعارات النظام', 'System Notifications'), icon: '⚙️', enabled: true },
              { key: 'emailNotifications', label: t('إشعارات البريد', 'Email Notifications'), icon: '📧', enabled: false }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-white rounded-lg border-2 border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-900">{item.label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.enabled}
                    onChange={() => {}}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-brand-secondary mb-6 flex items-center gap-3">
          <Database className="w-6 h-6" />
          {t('إعدادات النظام', 'System Settings')}
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-200">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">{t('النسخ الاحتياطي التلقائي', 'Auto Backup')}</p>
                <p className="text-sm text-green-700">{t('نسخ احتياطي تلقائي للبيانات', 'Automatic data backup')}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-blue-900">{t('تكرار النسخ الاحتياطي', 'Backup Frequency')}</p>
                <p className="text-sm text-blue-700">{t('كم مرة يتم النسخ الاحتياطي', 'How often to backup')}</p>
              </div>
            </div>
            <select
              value={settings.backupFrequency}
              onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
              className="px-4 py-2 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="hourly">{t('كل ساعة', 'Hourly')}</option>
              <option value="daily">{t('يومياً', 'Daily')}</option>
              <option value="weekly">{t('أسبوعياً', 'Weekly')}</option>
            </select>
          </div>

          <div className="p-4 bg-gradient-to-r from-brand-yellow-50 to-brand-yellow-100 rounded-lg border-2 border-brand-yellow-200">
            <div className="flex items-center gap-2 mb-3">
              <Wifi className="w-5 h-5 text-brand-secondary" />
              <p className="font-semibold text-brand-secondary">{t('حالة الاتصال', 'Connection Status')}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="success">{t('متصل', 'Connected')}</Badge>
                <span className="text-sm text-brand-black-700 font-medium">
                  {t('آخر تحديث:', 'Last update:')} {new Date().toLocaleTimeString('ar-SA')}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 me-2" />
                {t('تحديث', 'Refresh')}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200">
            <div className="flex items-center gap-3">
              <Upload className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-semibold text-purple-900">{t('حد حجم الملف', 'Max File Size')}</p>
                <p className="text-sm text-purple-700">{t('الحد الأقصى لحجم الملفات بالميجابايت', 'Maximum file size in MB')}</p>
              </div>
            </div>
            <select
              value={settings.maxFileSize}
              onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
              className="px-4 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value={5}>5 MB</option>
              <option value={10}>10 MB</option>
              <option value={25}>25 MB</option>
              <option value={50}>50 MB</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-secondary">
            {t('الإعدادات المتقدمة', 'Advanced Settings')}
          </h1>
          <p className="text-brand-black-600 mt-1 font-medium">
            {t('تخصيص وإدارة إعدادات النظام والموظفين', 'Customize and manage system and employee settings')}
          </p>
        </div>
        
        <div className="flex gap-3">
          <input
            type="file"
            accept=".json"
            onChange={handleImportSettings}
            className="hidden"
            id="import-settings"
          />
          <Button 
            variant="ghost" 
            onClick={() => document.getElementById('import-settings')?.click()}
          >
            <Upload className="w-4 h-4 me-2" />
            {t('استيراد', 'Import')}
          </Button>
          <Button variant="ghost" onClick={handleExportSettings}>
            <Download className="w-4 h-4 me-2" />
            {t('تصدير', 'Export')}
          </Button>
          <Button variant="ghost" onClick={handleResetSettings} className="text-red-600 hover:bg-red-50">
            <Trash2 className="w-4 h-4 me-2" />
            {t('إعادة تعيين', 'Reset')}
          </Button>
          <Button onClick={handleSaveSettings} className="bg-gradient-to-r from-brand-primary to-brand-yellow-400 hover:from-brand-yellow-400 hover:to-brand-yellow-300">
            <Save className="w-4 h-4 me-2" />
            {t('حفظ', 'Save')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* التبويبات الجانبية */}
        <div className="lg:col-span-1">
          <Card className="border-2 border-brand-yellow-200 shadow-lg">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-brand-primary to-brand-yellow-300 text-brand-secondary border-2 border-brand-yellow-400 shadow-md'
                          : 'text-brand-black-700 hover:bg-brand-yellow-50 hover:text-brand-secondary border border-transparent hover:border-brand-yellow-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* محتوى الإعدادات */}
        <div className="lg:col-span-3">
          <Card className="border-2 border-brand-yellow-200 shadow-lg">
            <CardContent className="p-6">
              {activeTab === 'general' && renderGeneralSettings()}
              {activeTab === 'employees' && renderEmployeeSettings()}
              {activeTab === 'security' && renderSecuritySettings()}
              {activeTab === 'notifications' && renderNotificationSettings()}
              {activeTab === 'appearance' && renderGeneralSettings()}
              {activeTab === 'system' && renderSystemSettings()}
              {activeTab === 'backup' && renderSystemSettings()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* نوافذ إدارة الموظفين */}
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
        <Button onClick={handleSubmit} disabled={isLoading}>
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
        <Button onClick={handleSubmit} disabled={isLoading}>
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

  // إحصائيات وهمية للموظف
  const employeeStats = {
    completedTasks: Math.floor(Math.random() * 50) + 10,
    activeTasks: Math.floor(Math.random() * 10) + 1,
    completionRate: Math.floor(Math.random() * 20) + 80,
    totalRevenue: Math.floor(Math.random() * 20000) + 5000,
    avgTaskTime: Math.floor(Math.random() * 60) + 30,
    customerRating: (Math.random() * 1 + 4).toFixed(1)
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('تفاصيل الموظف', 'Employee Details')} size="xl">
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
              <div className="flex items-center gap-2">
                <Badge variant={employee.role === 'admin' ? 'danger' : employee.role === 'manager' ? 'primary' : 'success'}>
                  {getRoleLabel(employee.role)}
                </Badge>
                <Badge variant={employee.isActive ? 'success' : 'gray'} size="sm">
                  {employee.isActive ? t('نشط', 'Active') : t('غير نشط', 'Inactive')}
                </Badge>
              </div>
            </div>
          </div>

          {/* إحصائيات الأداء */}
          <div>
            <h4 className="text-lg font-bold text-brand-secondary mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              {t('إحصائيات الأداء', 'Performance Statistics')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200 text-center">
                <div className="text-3xl font-bold text-green-700">{employeeStats.completedTasks}</div>
                <div className="text-sm text-green-600 font-medium">{t('المهام المكتملة', 'Completed Tasks')}</div>
                <div className="mt-2">
                  <div className="w-full bg-green-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 text-center">
                <div className="text-3xl font-bold text-blue-700">{employeeStats.activeTasks}</div>
                <div className="text-sm text-blue-600 font-medium">{t('المهام الجارية', 'Active Tasks')}</div>
                <div className="mt-2">
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-brand-yellow-50 rounded-lg border-2 border-brand-yellow-200 text-center">
                <div className="text-3xl font-bold text-brand-secondary">{employeeStats.completionRate}%</div>
                <div className="text-sm text-brand-black-600 font-medium">{t('معدل الإنجاز', 'Completion Rate')}</div>
                <div className="mt-2">
                  <div className="w-full bg-brand-yellow-200 rounded-full h-2">
                    <div className="bg-brand-primary h-2 rounded-full" style={{width: `${employeeStats.completionRate}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* إحصائيات إضافية */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">{t('الإيرادات', 'Revenue')}</span>
              </div>
              <div className="text-2xl font-bold text-purple-700">
                {employeeStats.totalRevenue.toLocaleString()} {t('ر.س', 'SAR')}
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-900">{t('متوسط الوقت', 'Avg Time')}</span>
              </div>
              <div className="text-2xl font-bold text-orange-700">
                {employeeStats.avgTaskTime} {t('دقيقة', 'min')}
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">{t('تقييم العملاء', 'Customer Rating')}</span>
              </div>
              <div className="text-2xl font-bold text-yellow-700">
                {employeeStats.customerRating}/5.0 ⭐
              </div>
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