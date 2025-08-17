import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Users, 
  ClipboardList, 
  CheckCircle, 
  Clock,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  FileText,
  DollarSign,
  Target,
  Award,
  Activity
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  // بيانات وهمية للتقارير
  const reportData = {
    overview: {
      totalTasks: 156,
      completedTasks: 142,
      pendingTasks: 14,
      totalRevenue: 45600,
      activeEmployees: 8,
      customerSatisfaction: 94
    },
    tasks: {
      byStatus: [
        { name: t('مكتملة', 'Completed'), value: 142, color: '#10B981' },
        { name: t('قيد التنفيذ', 'In Progress'), value: 8, color: '#F59E0B' },
        { name: t('معلقة', 'Pending'), value: 6, color: '#EF4444' }
      ],
      byPriority: [
        { name: t('عاجل', 'Urgent'), value: 12, color: '#DC2626' },
        { name: t('مرتفع', 'High'), value: 34, color: '#EA580C' },
        { name: t('متوسط', 'Medium'), value: 78, color: '#D97706' },
        { name: t('منخفض', 'Low'), value: 32, color: '#65A30D' }
      ]
    },
    performance: {
      weekly: [
        { day: t('السبت', 'Sat'), tasks: 18, revenue: 5400 },
        { day: t('الأحد', 'Sun'), tasks: 22, revenue: 6600 },
        { day: t('الاثنين', 'Mon'), tasks: 25, revenue: 7500 },
        { day: t('الثلاثاء', 'Tue'), tasks: 20, revenue: 6000 },
        { day: t('الأربعاء', 'Wed'), tasks: 28, revenue: 8400 },
        { day: t('الخميس', 'Thu'), tasks: 24, revenue: 7200 },
        { day: t('الجمعة', 'Fri'), tasks: 19, revenue: 5700 }
      ]
    },
    employees: [
      { name: 'أبو مانع', tasks: 45, completion: 98, revenue: 13500 },
      { name: 'شهاب', tasks: 52, completion: 96, revenue: 15600 },
      { name: 'عمر', tasks: 38, completion: 89, revenue: 11400 },
      { name: 'أحمد', tasks: 21, completion: 85, revenue: 6300 }
    ]
  };

  const reportTypes = [
    { id: 'overview', label: t('نظرة عامة', 'Overview'), icon: BarChart3 },
    { id: 'tasks', label: t('تقرير المهام', 'Tasks Report'), icon: ClipboardList },
    { id: 'performance', label: t('الأداء', 'Performance'), icon: TrendingUp },
    { id: 'employees', label: t('الموظفين', 'Employees'), icon: Users },
    { id: 'financial', label: t('المالي', 'Financial'), icon: DollarSign }
  ];

  const periods = [
    { id: 'week', label: t('هذا الأسبوع', 'This Week') },
    { id: 'month', label: t('هذا الشهر', 'This Month') },
    { id: 'quarter', label: t('هذا الربع', 'This Quarter') },
    { id: 'year', label: t('هذا العام', 'This Year') }
  ];

  const renderOverviewReport = () => (
    <div className="space-y-6">
      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">{t('إجمالي المهام', 'Total Tasks')}</p>
                <p className="text-3xl font-bold text-green-900">{reportData.overview.totalTasks}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600 me-1" />
                  <span className="text-sm text-green-600">+12% {t('من الشهر الماضي', 'from last month')}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">{t('المهام المكتملة', 'Completed Tasks')}</p>
                <p className="text-3xl font-bold text-blue-900">{reportData.overview.completedTasks}</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 me-1" />
                  <span className="text-sm text-blue-600">91% {t('معدل الإنجاز', 'completion rate')}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">{t('الإيرادات', 'Revenue')}</p>
                <p className="text-3xl font-bold text-purple-900">{reportData.overview.totalRevenue.toLocaleString()} {t('ر.س', 'SAR')}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-purple-600 me-1" />
                  <span className="text-sm text-purple-600">+8% {t('من الشهر الماضي', 'from last month')}</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-brand-yellow-200">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">{t('الأداء الأسبوعي', 'Weekly Performance')}</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2">
              {reportData.performance.weekly.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-brand-primary to-brand-yellow-300 rounded-t-md transition-all duration-500 hover:from-brand-yellow-400 hover:to-brand-yellow-200"
                    style={{ height: `${(day.tasks / 30) * 100}%` }}
                  />
                  <span className="text-xs text-gray-600 mt-2 font-medium">{day.day}</span>
                  <span className="text-xs text-gray-500">{day.tasks}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-brand-yellow-200">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">{t('توزيع المهام', 'Task Distribution')}</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.tasks.byStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ 
                          width: `${(item.value / reportData.overview.totalTasks) * 100}%`,
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-8">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderEmployeeReport = () => (
    <div className="space-y-6">
      <Card className="border-2 border-brand-yellow-200">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">{t('أداء الموظفين', 'Employee Performance')}</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-start py-3 px-4 font-semibold text-gray-900">{t('الموظف', 'Employee')}</th>
                  <th className="text-start py-3 px-4 font-semibold text-gray-900">{t('المهام', 'Tasks')}</th>
                  <th className="text-start py-3 px-4 font-semibold text-gray-900">{t('معدل الإنجاز', 'Completion Rate')}</th>
                  <th className="text-start py-3 px-4 font-semibold text-gray-900">{t('الإيرادات', 'Revenue')}</th>
                  <th className="text-start py-3 px-4 font-semibold text-gray-900">{t('التقييم', 'Rating')}</th>
                </tr>
              </thead>
              <tbody>
                {reportData.employees.map((employee, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-yellow-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-brand-secondary">
                            {employee.name.charAt(0)}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{employee.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">{employee.tasks}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{ width: `${employee.completion}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{employee.completion}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-900">
                        {employee.revenue.toLocaleString()} {t('ر.س', 'SAR')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`text-lg ${i < Math.floor(employee.completion / 20) ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTasksReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-2 border-brand-yellow-200">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">{t('المهام حسب الحالة', 'Tasks by Status')}</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.tasks.byStatus.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                    <span className="text-sm text-gray-500">
                      ({Math.round((item.value / reportData.overview.totalTasks) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-brand-yellow-200">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">{t('المهام حسب الأولوية', 'Tasks by Priority')}</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.tasks.byPriority.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-gray-900">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{item.value}</span>
                    <Badge 
                      variant={
                        item.name.includes('عاجل') || item.name.includes('Urgent') ? 'danger' :
                        item.name.includes('مرتفع') || item.name.includes('High') ? 'warning' :
                        'primary'
                      }
                      size="sm"
                    >
                      {Math.round((item.value / reportData.overview.totalTasks) * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-secondary">
            {t('التقارير والإحصائيات', 'Reports & Analytics')}
          </h1>
          <p className="text-brand-black-600 mt-1 font-medium">
            {t('تحليل شامل لأداء المركز والموظفين', 'Comprehensive analysis of center and employee performance')}
          </p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
          >
            {periods.map((period) => (
              <option key={period.id} value={period.id}>{period.label}</option>
            ))}
          </select>
          <Button variant="ghost">
            <Filter className="w-4 h-4 me-2" />
            {t('تصفية', 'Filter')}
          </Button>
          <Button variant="ghost">
            <RefreshCw className="w-4 h-4 me-2" />
            {t('تحديث', 'Refresh')}
          </Button>
          <Button>
            <Download className="w-4 h-4 me-2" />
            {t('تصدير', 'Export')}
          </Button>
        </div>
      </div>

      {/* أنواع التقارير */}
      <Card className="border-2 border-brand-yellow-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {reportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedReport(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedReport === type.id
                      ? 'bg-brand-primary text-brand-secondary'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {type.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* محتوى التقرير */}
      {selectedReport === 'overview' && renderOverviewReport()}
      {selectedReport === 'tasks' && renderTasksReport()}
      {selectedReport === 'employees' && renderEmployeeReport()}
      {selectedReport === 'performance' && renderOverviewReport()}
      {selectedReport === 'financial' && renderOverviewReport()}
    </div>
  );
};