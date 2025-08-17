import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { 
  Car, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Loader2,
  Shield,
  Users,
  Settings
} from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // مسح الخطأ عند تغيير المدخلات
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData.email, formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    try {
      await login(formData);
    } catch (error) {
      // الخطأ سيتم عرضه من خلال السياق
    }
  };

  const handleDemoLogin = (role: 'admin' | 'manager' | 'technician') => {
    const demoCredentials = {
      admin: { email: 'admin@cardiag.com', password: 'admin123' },
      manager: { email: 'shahab@cardiag.com', password: 'shahab123' },
      technician: { email: 'omar@cardiag.com', password: 'omar123' }
    };

    setFormData(demoCredentials[role]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-yellow-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* الشعار والعنوان */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-brand-primary to-brand-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl border-2 border-brand-yellow-200">
            <Car className="w-10 h-10 text-brand-secondary" />
          </div>
          <h1 className="text-3xl font-bold text-brand-secondary mb-2">
            {t('مركز التشخيص الاحترافي', 'ProDiag Center')}
          </h1>
          <p className="text-brand-black-600">
            {t('نظام إدارة مركز تشخيص السيارات', 'Car Diagnostic Center Management System')}
          </p>
        </div>

        {/* نموذج تسجيل الدخول */}
        <Card className="shadow-xl border-2 border-brand-yellow-200 bg-white">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-brand-secondary mb-2">
                {t('تسجيل الدخول', 'Login')}
              </h2>
              <p className="text-brand-black-600">
                {t('أدخل بياناتك للوصول إلى النظام', 'Enter your credentials to access the system')}
              </p>
            </div>

            {/* رسالة الخطأ */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-sm font-semibold text-brand-secondary mb-2">
                  {t('البريد الإلكتروني', 'Email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-black-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 bg-white"
                    placeholder={t('أدخل بريدك الإلكتروني', 'Enter your email')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* كلمة المرور */}
              <div>
                <label className="block text-sm font-semibold text-brand-secondary mb-2">
                  {t('كلمة المرور', 'Password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-brand-black-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 bg-white"
                    placeholder={t('أدخل كلمة المرور', 'Enter your password')}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-black-400 hover:text-brand-secondary transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* تذكرني */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-brand-black-600">
                    {t('تذكرني', 'Remember me')}
                  </span>
                </label>
                <button
                  type="button"
                  className="text-sm text-brand-secondary hover:text-brand-black-700 font-medium transition-colors"
                  disabled={isLoading}
                >
                  {t('نسيت كلمة المرور؟', 'Forgot password?')}
                </button>
              </div>

              {/* زر تسجيل الدخول */}
              <Button
                type="submit"
                className="w-full py-3 text-lg font-bold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2 text-brand-secondary" />
                    {t('جاري تسجيل الدخول...', 'Logging in...')}
                  </>
                ) : (
                  t('تسجيل الدخول', 'Login')
                )}
              </Button>
            </form>

            {/* حسابات تجريبية */}
            <div className="mt-8 pt-6 border-t-2 border-brand-yellow-200">
              <p className="text-sm text-brand-black-600 text-center mb-4 font-medium">
                {t('حسابات تجريبية للاختبار:', 'Demo accounts for testing:')}
              </p>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => handleDemoLogin('admin')}
                  className="flex items-center justify-center gap-2 p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-all duration-200 text-sm font-medium border border-red-200 hover:border-red-300"
                  disabled={isLoading}
                >
                  <Shield className="w-4 h-4" />
                  {t('مدير النظام', 'System Admin')} - admin@cardiag.com
                </button>
                <button
                  onClick={() => handleDemoLogin('manager')}
                  className="flex items-center justify-center gap-2 p-3 bg-brand-yellow-50 hover:bg-brand-yellow-100 text-brand-secondary rounded-lg transition-all duration-200 text-sm font-medium border border-brand-yellow-200 hover:border-brand-yellow-300"
                  disabled={isLoading}
                >
                  <Users className="w-4 h-4" />
                  {t('مدير الموظفين', 'Staff Manager')} - shahab@cardiag.com
                </button>
                <button
                  onClick={() => handleDemoLogin('technician')}
                  className="flex items-center justify-center gap-2 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-all duration-200 text-sm font-medium border border-green-200 hover:border-green-300"
                  disabled={isLoading}
                >
                  <Settings className="w-4 h-4" />
                  {t('فني التشخيص', 'Diagnostic Technician')} - omar@cardiag.com
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* معلومات إضافية */}
        <div className="mt-6 text-center">
          <p className="text-sm text-brand-black-500 font-medium">
            {t('نظام آمن ومحمي بأحدث تقنيات الأمان', 'Secure system protected with latest security technologies')}
          </p>
        </div>
      </div>
    </div>
  );
};