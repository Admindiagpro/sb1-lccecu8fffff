import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  LayoutDashboard,
  Users,
  ClipboardList,
  MessageSquare,
  Archive,
  Search,
  Settings,
  X,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, onTabChange }) => {
  const { t, isRTL } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: t('لوحة التحكم', 'Dashboard'), icon: LayoutDashboard, badge: null },
    { id: 'employees', label: t('الموظفين', 'Employees'), icon: Users, badge: '3' },
    { id: 'tasks', label: t('المهام', 'Tasks'), icon: ClipboardList, badge: '5' },
    { id: 'messages', label: t('الرسائل', 'Messages'), icon: MessageSquare, badge: '12' },
    { id: 'reports', label: t('التقارير', 'Reports'), icon: TrendingUp, badge: null },
    { id: 'calendar', label: t('التقويم', 'Calendar'), icon: Calendar, badge: null },
    { id: 'archive', label: t('الأرشيف', 'Archive'), icon: Archive, badge: null },
    { id: 'search', label: t('البحث', 'Search'), icon: Search, badge: null },
    { id: 'settings', label: t('الإعدادات', 'Settings'), icon: Settings, badge: null },
  ];

  return (
    <>
      {/* الخلفية المظلمة */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* الشريط الجانبي */}
      <aside className={`
        fixed lg:static inset-y-0 z-50 w-64 bg-white border-e-4 border-brand-primary shadow-xl lg:shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full bg-gradient-to-b from-white to-brand-yellow-25">
          {/* رأس الشريط الجانبي */}
          <div className="flex items-center justify-between p-4 border-b-2 border-brand-yellow-200 lg:hidden bg-brand-yellow-50">
            <h2 className="text-lg font-bold text-brand-secondary">
              {t('القائمة', 'Menu')}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-200">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* عناصر القائمة */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-lg
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-brand-yellow-100 to-brand-yellow-200 text-brand-secondary border-2 border-brand-yellow-300 shadow-md font-semibold' 
                      : 'text-brand-black-700 hover:bg-brand-yellow-50 hover:text-brand-secondary font-medium hover:border hover:border-brand-yellow-200'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-brand-secondary' : 'text-brand-black-500 group-hover:text-brand-secondary'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant={isActive ? 'primary' : 'gray'} size="sm">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>

          {/* إحصائيات سريعة */}
          <div className="p-4 border-t-2 border-brand-yellow-200">
            <div className="bg-gradient-to-r from-brand-yellow-50 to-brand-yellow-100 p-4 rounded-lg border border-brand-yellow-200">
              <h4 className="text-sm font-bold text-brand-secondary mb-2">
                {t('إحصائيات اليوم', 'Today\'s Stats')}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-brand-black-600 font-medium">{t('المهام المكتملة', 'Completed Tasks')}</span>
                  <span className="font-medium text-green-600">8/12</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-brand-black-600 font-medium">{t('الموظفين النشطين', 'Active Staff')}</span>
                  <span className="font-medium text-brand-secondary">3/3</span>
                </div>
                <div className="w-full bg-brand-black-200 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-brand-primary to-green-500 h-2 rounded-full shadow-sm" style={{width: '67%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* معلومات إضافية */}
          <div className="p-4 border-t-2 border-brand-yellow-200 bg-brand-yellow-50">
            <div className="text-xs text-brand-black-600 text-center space-y-1 font-medium">
              {t('مركز التشخيص الاحترافي', 'ProDiag Center')}
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse border border-brand-yellow-400"></div>
                <span>{t('الإصدار 1.0', 'Version 1.0')}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};