import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { employees, sampleTasks } from '../../data/mockData';
import { 
  Users, 
  ClipboardList, 
  CheckCircle, 
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Bot,
  Sparkles
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('إجمالي الموظفين', 'Total Employees'),
      value: employees.length,
      icon: Users,
      color: 'blue',
      change: '+2',
      changeType: 'increase'
    },
    {
      title: t('المهام النشطة', 'Active Tasks'),
      value: sampleTasks.filter(task => task.status !== 'completed').length,
      icon: ClipboardList,
      color: 'orange',
      change: '+5',
      changeType: 'increase'
    },
    {
      title: t('المهام المكتملة', 'Completed Tasks'),
      value: sampleTasks.filter(task => task.status === 'completed').length,
      icon: CheckCircle,
      color: 'green',
      change: '+12',
      changeType: 'increase'
    },
    {
      title: t('الإيرادات اليومية', 'Daily Revenue'),
      value: '2,450',
      icon: DollarSign,
      color: 'purple',
      change: '+8.2%',
      changeType: 'increase',
      prefix: t('ر.س', '$')
    }
  ];

  const recentActivities = [
    { id: 1, user: 'شهاب', action: t('أكمل فحص سيارة كامري', 'Completed Camry inspection'), time: '5 دقائق', type: 'success' },
    { id: 2, user: 'عمر', action: t('بدأ مهمة فحص حساس الهواء', 'Started air sensor inspection'), time: '15 دقيقة', type: 'info' },
    { id: 3, user: 'أبو مانع', action: t('أضاف مهمة جديدة', 'Added new task'), time: '30 دقيقة', type: 'primary' },
    { id: 4, user: 'شهاب', action: t('رفع تقرير الفحص', 'Uploaded inspection report'), time: '1 ساعة', type: 'warning' }
  ];
  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-secondary">
            {t('لوحة التحكم', 'Dashboard')}
          </h1>
          <p className="text-brand-black-600 mt-1 font-medium">
            {t('نظرة عامة على مركز التشخيص', 'Overview of the diagnostic center')}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm">
            <Calendar className="w-4 h-4 me-2" />
            {t('اليوم', 'Today')}
          </Button>
          <Button variant="ghost" size="sm">
            <BarChart3 className="w-4 h-4 me-2" />
            {t('التقارير', 'Reports')}
          </Button>
        </div>
      </div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 border-brand-yellow-200 shadow-lg hover:border-brand-yellow-300 bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-brand-black-600">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-brand-secondary mt-2">
                      {stat.prefix && <span className="text-lg font-bold">{stat.prefix}</span>}
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'increase' ? (
                        <ArrowUpRight className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-brand-black-500 ms-1 font-medium">
                        {t('من الأمس', 'from yesterday')}
                      </span>
                    </div>
                  </div>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                    stat.color === 'blue' ? 'from-brand-yellow-100 to-brand-yellow-200 border-2 border-brand-yellow-300' :
                    stat.color === 'orange' ? 'from-orange-100 to-orange-200 border-2 border-orange-300' :
                    stat.color === 'green' ? 'from-green-100 to-green-200 border-2 border-green-300' :
                    'from-purple-100 to-purple-200 border-2 border-purple-300'
                  } flex items-center justify-center shadow-lg`}>
                    <Icon className={`w-6 h-6 ${
                      stat.color === 'blue' ? 'text-brand-secondary' :
                      stat.color === 'orange' ? 'text-orange-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      'text-purple-600'
                    }`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* الرسوم البيانية والأنشطة */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* نشاط الموظفين */}
        <Card className="border-2 border-brand-yellow-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-secondary">
                {t('حالة الموظفين', 'Employee Status')}
              </h3>
              <Activity className="w-5 h-5 text-brand-black-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-brand-yellow-25 to-brand-yellow-50 rounded-lg hover:shadow-md transition-all duration-200 border border-brand-yellow-200 hover:border-brand-yellow-300">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={employee.avatar} 
                        alt={employee.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-brand-yellow-300 shadow-md"
                      />
                      <div className={`absolute -bottom-1 -end-1 w-3 h-3 rounded-full border-2 border-white ${
                        employee.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-brand-secondary">{employee.name}</p>
                      <p className="text-sm text-brand-black-600">{employee.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={employee.isOnline ? 'success' : 'gray'}
                      size="sm"
                    >
                      {employee.isOnline ? t('متصل', 'Online') : t('غير متصل', 'Offline')}
                    </Badge>
                    <Badge variant="primary" size="sm">
                      {employee.type === 'manager' ? t('مدير', 'Manager') :
                       employee.type === 'confident' ? t('واثق', 'Confident') :
                       t('موجه', 'Guided')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* المهام الأخيرة */}
        <Card className="border-2 border-brand-yellow-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-secondary">
                {t('المهام الأخيرة', 'Recent Tasks')}
              </h3>
              <ClipboardList className="w-5 h-5 text-brand-black-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-gradient-to-r from-brand-yellow-25 to-brand-yellow-50 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer border border-brand-yellow-200 hover:border-brand-yellow-300">
                  <div className="flex-shrink-0 mt-1">
                    {task.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : task.status === 'in-progress' ? (
                      <Clock className="w-5 h-5 text-orange-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-brand-secondary truncate">{task.title}</p>
                    <p className="text-sm text-brand-black-600 mt-1">{task.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant={
                          task.priority === 'urgent' ? 'danger' :
                          task.priority === 'high' ? 'warning' :
                          task.priority === 'medium' ? 'primary' : 'gray'
                        }
                        size="sm"
                      >
                        {task.priority === 'urgent' ? t('عاجل', 'Urgent') :
                         task.priority === 'high' ? t('مرتفع', 'High') :
                         task.priority === 'medium' ? t('متوسط', 'Medium') :
                         t('منخفض', 'Low')}
                      </Badge>
                      <span className="text-xs text-brand-black-500 font-medium">
                        {task.createdAt.toLocaleDateString('ar-SA')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t-2 border-brand-yellow-100">
              <Button variant="ghost" size="sm" className="w-full">
                {t('عرض جميع المهام', 'View all tasks')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* النشاطات الأخيرة */}
        <Card className="border-2 border-brand-yellow-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-secondary">
                {t('النشاطات الأخيرة', 'Recent Activities')}
              </h3>
              <TrendingUp className="w-5 h-5 text-brand-black-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'info' ? 'bg-blue-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brand-secondary font-medium">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-brand-black-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t-2 border-brand-yellow-100">
              <Button variant="ghost" size="sm" className="w-full">
                {t('عرض جميع النشاطات', 'View all activities')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* بطاقة المساعد الذكي */}
        <Card className="lg:col-span-2 bg-gradient-to-r from-brand-secondary to-brand-black-700 text-brand-primary border-4 border-brand-primary shadow-2xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-brand-primary bg-opacity-90 rounded-xl flex items-center justify-center border-2 border-brand-yellow-300">
                    <Bot className="w-6 h-6 text-brand-secondary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-brand-primary">
                      {t('المساعد الذكي متاح الآن!', 'AI Assistant Now Available!')}
                    </h3>
                    <p className="text-brand-yellow-200 font-medium">
                      {t('مدعوم بتقنية ChatGPT للتشخيص الذكي', 'Powered by ChatGPT for smart diagnostics')}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">🔧</div>
                    <div className="text-sm text-brand-yellow-200 font-medium">{t('تشخيص ذكي', 'Smart Diagnosis')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">⚠️</div>
                    <div className="text-sm text-brand-yellow-200 font-medium">{t('شرح أكواد الأعطال', 'DTC Explanation')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">🔩</div>
                    <div className="text-sm text-brand-yellow-200 font-medium">{t('معلومات القطع', 'Parts Info')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">📅</div>
                    <div className="text-sm text-brand-yellow-200 font-medium">{t('جداول الصيانة', 'Maintenance Schedules')}</div>
                  </div>
                </div>
                
                <Button 
                  variant="primary"
                  className="bg-brand-primary text-brand-secondary hover:bg-brand-yellow-200 border-2 border-brand-yellow-300 font-bold shadow-lg"
                  onClick={() => {
                    // سيتم ربطه بفتح المساعد الذكي
                    const event = new CustomEvent('openAIAssistant');
                    window.dispatchEvent(event);
                  }}
                >
                  <Sparkles className="w-4 h-4 me-2 text-brand-secondary" />
                  {t('جرب المساعد الذكي الآن', 'Try AI Assistant Now')}
                </Button>
              </div>
              
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-brand-primary bg-opacity-20 rounded-full flex items-center justify-center border-4 border-brand-yellow-300">
                  <Bot className="w-16 h-16 text-brand-primary opacity-90" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-brand-yellow-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-secondary">
                {t('أداء المهام الأسبوعي', 'Weekly Task Performance')}
              </h3>
              <BarChart3 className="w-5 h-5 text-brand-black-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 45, 78, 52, 89, 67, 43].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-brand-primary to-brand-yellow-300 rounded-t-md transition-all duration-500 hover:from-brand-yellow-400 hover:to-brand-yellow-200 border border-brand-yellow-400"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-brand-black-500 mt-2 font-medium">
                    {['س', 'ح', 'ث', 'ر', 'خ', 'ج', 'س'][index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-brand-yellow-200 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-secondary">
                {t('توزيع أنواع المهام', 'Task Type Distribution')}
              </h3>
              <PieChart className="w-5 h-5 text-brand-black-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: t('فحص المحرك', 'Engine Inspection'), value: 45, color: 'brand-primary' },
                { label: t('فحص الكهرباء', 'Electrical Check'), value: 30, color: 'green' },
                { label: t('فحص الفرامل', 'Brake Inspection'), value: 15, color: 'orange' },
                { label: t('أخرى', 'Others'), value: 10, color: 'purple' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.color === 'brand-primary' ? 'bg-brand-primary border border-brand-yellow-400' :
                      item.color === 'green' ? 'bg-green-500' :
                      item.color === 'orange' ? 'bg-orange-500' :
                      'bg-purple-500'
                    }`} />
                    <span className="text-sm text-brand-black-700 font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-brand-black-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          item.color === 'brand-primary' ? 'bg-brand-primary' :
                          item.color === 'green' ? 'bg-green-500' :
                          item.color === 'orange' ? 'bg-orange-500' :
                          'bg-purple-500'
                        }`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-brand-secondary w-8">{item.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};