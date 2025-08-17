import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserProfile } from '../Auth/UserProfile';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Car, 
  Globe, 
  Bell, 
  User,
  Menu,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  onChatToggle: () => void;
  onAIToggle: () => void;
  unreadMessages: number;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, onChatToggle, onAIToggle, unreadMessages }) => {
  const { user, logout } = useAuth();
  const { t, toggleLanguage, isRTL } = useLanguage();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showProfile, setShowProfile] = React.useState(false);

  const notifications = [
    { id: 1, title: t('مهمة جديدة', 'New Task'), message: t('تم تعيين مهمة فحص كامري 2020', 'Camry 2020 inspection task assigned'), time: '5 دقائق', unread: true },
    { id: 2, title: t('تحديث النظام', 'System Update'), message: t('تحديث جديد متوفر للنظام', 'New system update available'), time: '1 ساعة', unread: true },
    { id: 3, title: t('رسالة جديدة', 'New Message'), message: t('رسالة من شهاب', 'Message from Shahab'), time: '2 ساعة', unread: false }
  ];
  return (
    <header className="bg-white shadow-lg border-b-4 border-brand-primary sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* الجانب الأيسر/الأيمن - القائمة والشعار */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onMenuToggle} className="hover:bg-brand-yellow-50">
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-yellow-400 rounded-lg flex items-center justify-center shadow-lg border border-brand-yellow-300">
                <Car className="h-5 w-5 text-brand-secondary" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-brand-secondary">
                  {t('مركز التشخيص الاحترافي', 'ProDiag Center')}
                </h1>
                <p className="text-sm text-brand-black-600 font-medium">
                  {t('نظام إدارة الموظفين', 'Staff Management System')}
                </p>
              </div>
            </div>
          </div>

          {/* الجانب الأيمن/الأيسر - الأدوات */}
          <div className="flex items-center gap-3">
            {/* المساعد الذكي */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onAIToggle}
              className="relative hover:bg-brand-yellow-50 transition-all duration-200 group border border-transparent hover:border-brand-yellow-200"
            >
              <div className="relative">
                <svg className="w-5 h-5 text-brand-secondary group-hover:text-brand-black-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div className="absolute -top-1 -end-1 w-2 h-2 bg-brand-primary rounded-full animate-pulse border border-brand-yellow-400"></div>
              </div>
              <span className="hidden sm:inline-block ms-2 text-brand-secondary group-hover:text-brand-black-800 font-semibold">
                {t('مساعد ذكي', 'AI Assistant')}
              </span>
            </Button>

            {/* الدردشة */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onChatToggle}
              className="relative hover:bg-brand-yellow-50 transition-all duration-200 border border-transparent hover:border-brand-yellow-200"
            >
              <MessageSquare className="h-5 w-5 text-brand-secondary" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -end-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse font-bold">
                  {unreadMessages}
                </span>
              )}
            </Button>

            {/* الإشعارات */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative hover:bg-brand-yellow-50 transition-all duration-200 border border-transparent hover:border-brand-yellow-200"
              >
                <Bell className="h-5 w-5 text-brand-secondary" />
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="absolute -top-1 -end-1 bg-brand-primary text-brand-secondary text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce font-bold border border-brand-yellow-400">
                    {notifications.filter(n => n.unread).length}
                  </span>
                )}
              </Button>
              
              {/* قائمة الإشعارات */}
              {showNotifications && (
                <div className="absolute top-full mt-2 end-0 w-80 bg-white rounded-lg shadow-xl border-2 border-brand-yellow-200 z-50">
                  <div className="p-4 border-b-2 border-brand-yellow-100 bg-brand-yellow-50">
                    <h3 className="font-bold text-brand-secondary">
                      {t('الإشعارات', 'Notifications')}
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 border-b border-gray-50 hover:bg-brand-yellow-50 cursor-pointer transition-colors ${notification.unread ? 'bg-brand-yellow-25' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-brand-secondary text-sm">{notification.title}</p>
                            <p className="text-brand-black-600 text-sm mt-1">{notification.message}</p>
                            <p className="text-brand-black-400 text-xs mt-2">{notification.time}</p>
                          </div>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-brand-primary rounded-full mt-2 border border-brand-yellow-400"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t-2 border-brand-yellow-100 bg-brand-yellow-50">
                    <Button variant="ghost" size="sm" className="w-full text-center">
                      {t('عرض جميع الإشعارات', 'View all notifications')}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* تبديل اللغة */}
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="hover:bg-brand-yellow-50 transition-all duration-200 border border-transparent hover:border-brand-yellow-200">
              <Globe className="h-5 w-5 text-brand-secondary" />
              <span className="hidden sm:inline-block ms-2">
                {t('EN', 'عر')}
              </span>
            </Button>

            {/* الملف الشخصي */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="hover:bg-brand-yellow-50 transition-all duration-200 border border-transparent hover:border-brand-yellow-200"
              >
                <div className="flex items-center gap-2">
                  <img 
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-6 h-6 rounded-full object-cover border border-brand-yellow-300"
                  />
                  <span className="hidden sm:inline-block font-semibold text-brand-secondary">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-brand-secondary" />
                </div>
              </Button>
              
              {/* قائمة المستخدم */}
              {showUserMenu && (
                <div className="absolute top-full mt-2 end-0 w-48 bg-white rounded-lg shadow-xl border-2 border-brand-yellow-200 z-50">
                  <div className="p-3 border-b-2 border-brand-yellow-100 bg-brand-yellow-50">
                    <p className="font-bold text-brand-secondary">{user?.name}</p>
                    <p className="text-sm text-brand-black-600">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button onClick={() => { setShowProfile(true); setShowUserMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brand-secondary hover:bg-brand-yellow-50 rounded-md font-medium transition-colors">
                      <User className="w-4 h-4" />
                      {t('الملف الشخصي', 'Profile')}
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-brand-secondary hover:bg-brand-yellow-50 rounded-md font-medium transition-colors">
                      <Settings className="w-4 h-4" />
                      {t('الإعدادات', 'Settings')}
                    </button>
                    <hr className="my-2" />
                    <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md font-medium transition-colors">
                      <LogOut className="w-4 h-4" />
                      {t('تسجيل الخروج', 'Logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* نافذة الملف الشخصي */}
      <UserProfile 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
      
      {/* إغلاق القوائم عند النقر خارجها */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};