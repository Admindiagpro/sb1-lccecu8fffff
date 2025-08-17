import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../ui/Toast';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { sampleTasks, employees, dtcCodes } from '../../data/mockData';
import { Task } from '../../types';
import OpenAIService from '../../services/openai';
import AuthService from '../../services/auth';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Car,
  Phone,
  Calendar,
  User,
  Image as ImageIcon,
  Bot,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const TaskManager: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState(sampleTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [aiHelpTask, setAiHelpTask] = useState<Task | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const authService = AuthService.getInstance();

  // التحقق من الصلاحيات
  const canManageTasks = user && authService.hasPermission(user, 'manage_tasks');
  const canCreateTasks = user && authService.hasPermission(user, 'create_tasks');
  const canUpdateTasks = user && authService.hasPermission(user, 'update_tasks');
  const canDeleteTasks = user && authService.hasPermission(user, 'delete_tasks');

  // إذا لم يكن لديه صلاحية عرض المهام، اعرض رسالة خطأ
  if (!user || !authService.hasPermission(user, 'view_tasks')) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-300">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-brand-secondary mb-2">
            {t('ليس لديك صلاحية للوصول', 'Access Denied')}
          </h3>
          <p className="text-brand-black-600">
            {t('ليس لديك صلاحية لعرض المهام', 'You do not have permission to view tasks')}
          </p>
        </div>
      </div>
    );
  }
  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee?.name || t('غير معروف', 'Unknown');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-orange-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'primary';
      default: return 'gray';
    }
  };

  const getAIHelp = async (task: Task) => {
    setAiHelpTask(task);
    setIsLoadingAI(true);
    setAiResponse('');

    try {
      const openAIService = OpenAIService.getInstance();
      
      // إنشاء طلب تشخيص مفصل للمهمة
      const diagnosticRequest = {
        carModel: task.customerInfo?.carModel || 'غير محدد',
        year: task.customerInfo?.carYear || 'غير محدد',
        symptoms: task.description,
        dtcCodes: task.dtcCodes?.join(', ') || '',
        mileage: 'غير محدد'
      };

      const response = await openAIService.diagnoseProblem(diagnosticRequest);
      setAiResponse(response);
      showToast('تم الحصول على المساعدة الذكية', 'success');
    } catch (error) {
      console.error('خطأ في الحصول على المساعدة:', error);
      showToast('فشل في الحصول على المساعدة الذكية', 'error');
      setAiResponse('عذراً، حدث خطأ في الحصول على المساعدة الذكية. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* عنوان الصفحة والأدوات */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('إدارة المهام', 'Task Management')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('إنشاء وتوجيه المهام للموظفين', 'Create and assign tasks to employees')}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="ghost" size="sm">
            <Filter className="w-4 h-4 me-2" />
            {t('تصفية', 'Filter')}
          </Button>
          <Button variant="ghost" size="sm">
            <Search className="w-4 h-4 me-2" />
            {t('بحث', 'Search')}
          </Button>
          {canCreateTasks && (
            <Button onClick={() => setShowCreateTask(true)}>
              <Plus className="w-4 h-4 me-2" />
              {t('مهمة جديدة', 'New Task')}
            </Button>
          )}
        </div>
      </div>

      {/* قائمة المهام */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card 
            key={task.id} 
            className="hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelectedTask(task)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(task.status)}
                  <h3 className="font-semibold text-gray-900 truncate">{task.title}</h3>
                </div>
                <Badge variant={getPriorityColor(task.priority)} size="sm">
                  {task.priority === 'urgent' ? t('عاجل', 'Urgent') :
                   task.priority === 'high' ? t('مرتفع', 'High') :
                   task.priority === 'medium' ? t('متوسط', 'Medium') :
                   t('منخفض', 'Low')}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
              
              {/* معلومات المهمة */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{t('مُوكل إلى:', 'Assigned to:')} {getEmployeeName(task.assignedTo)}</span>
                </div>
                
                {task.customerInfo && (
                  <>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Car className="w-4 h-4" />
                      <span>{task.customerInfo.carModel} {task.customerInfo.carYear}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{task.customerInfo.name}</span>
                    </div>
                  </>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{task.createdAt.toLocaleDateString('ar-SA')}</span>
                </div>
              </div>

              {/* أكواد DTC */}
              {task.dtcCodes && task.dtcCodes.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    {t('أكواد الأعطال:', 'Error Codes:')}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {task.dtcCodes.map((code, index) => (
                      <Badge key={index} variant="warning" size="sm">
                        {code}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* الصور */}
              {task.images && task.images.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ImageIcon className="w-4 h-4" />
                  <span>{task.images.length} {t('صورة', 'images')}</span>
                </div>
              )}

              {/* زر المساعدة الذكية */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    getAIHelp(task);
                  }}
                  className="w-full bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 text-purple-700 border border-purple-200"
                  disabled={!user || !authService.hasPermission(user, 'access_ai_assistant')}
                >
                  <Bot className="w-4 h-4 me-2" />
                  {t('مساعدة ذكية', 'AI Help')}
                  <Sparkles className="w-3 h-3 ms-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* نافذة تفاصيل المهمة */}
      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)}
          onUpdate={(updatedTask) => {
            setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
            setSelectedTask(null);
          }}
          canUpdate={canUpdateTasks}
        />
      )}

      {/* نافذة إنشاء مهمة جديدة */}
      {showCreateTask && canCreateTasks && (
        <CreateTaskModal
          onClose={() => setShowCreateTask(false)}
          onCreate={(newTask) => {
            setTasks([...tasks, newTask]);
            setShowCreateTask(false);
          }}
        />
      )}

      {/* نافذة المساعدة الذكية */}
      {aiHelpTask && (
        <AIHelpModal
          task={aiHelpTask}
          response={aiResponse}
          isLoading={isLoadingAI}
          onClose={() => {
            setAiHelpTask(null);
            setAiResponse('');
          }}
        />
      )}
    </div>
  );
};

// مكون نافذة تفاصيل المهمة
const TaskDetailModal: React.FC<{
  task: Task;
  onClose: () => void;
  onUpdate: (task: Task) => void;
  canUpdate?: boolean;
}> = ({ task, onClose, onUpdate, canUpdate = false }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>

          <div className="space-y-6">
            {/* الوصف */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('الوصف', 'Description')}
              </h3>
              <p className="text-gray-600">{task.description}</p>
            </div>

            {/* معلومات العميل */}
            {task.customerInfo && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('معلومات العميل', 'Customer Information')}
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><strong>{t('الاسم:', 'Name:')}</strong> {task.customerInfo.name}</p>
                  <p><strong>{t('الهاتف:', 'Phone:')}</strong> {task.customerInfo.phone}</p>
                  <p><strong>{t('السيارة:', 'Car:')}</strong> {task.customerInfo.carModel} {task.customerInfo.carYear}</p>
                  <p><strong>{t('رقم اللوحة:', 'License:')}</strong> {task.customerInfo.licensePlate}</p>
                </div>
              </div>
            )}

            {/* أكواد DTC والحلول */}
            {task.dtcCodes && task.dtcCodes.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t('أكواد الأعطال والحلول المقترحة', 'Error Codes & Suggested Solutions')}
                </h3>
                <div className="space-y-4">
                  {task.dtcCodes.map((code, index) => {
                    const dtcInfo = dtcCodes.find(dtc => dtc.code === code);
                    return (
                      <div key={index} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="warning">{code}</Badge>
                          <span className="font-medium">{dtcInfo?.description}</span>
                        </div>
                        {dtcInfo && (
                          <div className="space-y-2">
                            <div>
                              <p className="font-medium text-sm text-gray-700">
                                {t('الأسباب المحتملة:', 'Possible Causes:')}
                              </p>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {dtcInfo.possibleCauses.map((cause, i) => (
                                  <li key={i}>{cause}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-700">
                                {t('الحلول المقترحة:', 'Suggested Solutions:')}
                              </p>
                              <ul className="list-disc list-inside text-sm text-gray-600">
                                {dtcInfo.suggestedSolutions.map((solution, i) => (
                                  <li key={i}>{solution}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* أزرار التحكم */}
            {canUpdate && (
              <div className="flex gap-3 pt-4 border-t">
                <Button 
                  variant="success"
                  onClick={() => onUpdate({...task, status: 'completed'})}
                >
                  {t('تم الإنجاز', 'Mark Complete')}
                </Button>
                <Button 
                  variant="warning"
                  onClick={() => onUpdate({...task, status: 'in-progress'})}
                >
                  {t('قيد التنفيذ', 'In Progress')}
                </Button>
              </div>
            )}
            <div className="flex gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={onClose}>
                {t('إغلاق', 'Close')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// مكون إنشاء مهمة جديدة
const CreateTaskModal: React.FC<{
  onClose: () => void;
  onCreate: (task: Task) => void;
}> = ({ onClose, onCreate }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '3', // عمر بشكل افتراضي
    priority: 'medium' as Task['priority'],
    customerName: '',
    customerPhone: '',
    carModel: '',
    carYear: '',
    licensePlate: '',
    dtcCodes: ''
  });
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showAISuggestion, setShowAISuggestion] = useState(false);

  const getAIHelp = async () => {
    if (!formData.carModel || !formData.carYear) {
      showToast('يرجى إدخال موديل السيارة وسنة الصنع أولاً', 'warning');
      return;
    }

    setIsLoadingAI(true);
    setShowAISuggestion(true);

    try {
      const openAIService = OpenAIService.getInstance();
      
      // إنشاء طلب تشخيص للمساعدة في إنشاء المهمة
      const prompt = `أنا أعمل في مركز تشخيص السيارات وأريد إنشاء مهمة تشخيص جديدة.

معلومات السيارة:
- الموديل: ${formData.carModel}
- السنة: ${formData.carYear}
${formData.customerName ? `- العميل: ${formData.customerName}` : ''}
${formData.dtcCodes ? `- أكواد الأعطال: ${formData.dtcCodes}` : ''}
${formData.description ? `- الوصف الحالي: ${formData.description}` : ''}

يرجى مساعدتي في:
1. اقتراح عنوان مناسب للمهمة
2. كتابة وصف تفصيلي للمهمة
3. تحديد الأولوية المناسبة
4. اقتراح خطوات التشخيص
5. تحديد الأدوات المطلوبة
6. تقدير الوقت اللازم

اجعل الاقتراحات عملية ومناسبة لفني السيارات.`;

      const response = await openAIService.chat([
        { role: 'user', content: prompt }
      ]);

      setAiSuggestion(response);
      showToast('تم الحصول على اقتراحات ذكية للمهمة', 'success');
    } catch (error) {
      console.error('خطأ في الحصول على المساعدة:', error);
      showToast('فشل في الحصول على المساعدة الذكية', 'error');
      setAiSuggestion('عذراً، حدث خطأ في الحصول على المساعدة الذكية. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const applyAISuggestions = () => {
    // يمكن للمستخدم نسخ الاقتراحات يدوياً
    showToast('يمكنك نسخ الاقتراحات وتطبيقها على النموذج', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      assignedTo: formData.assignedTo,
      createdBy: '1', // أبو مانع
      status: 'pending',
      priority: formData.priority,
      createdAt: new Date(),
      updatedAt: new Date(),
      customerInfo: formData.customerName ? {
        name: formData.customerName,
        phone: formData.customerPhone,
        carModel: formData.carModel,
        carYear: formData.carYear,
        licensePlate: formData.licensePlate
      } : undefined,
      dtcCodes: formData.dtcCodes ? formData.dtcCodes.split(',').map(code => code.trim()) : undefined
    };

    onCreate(newTask);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {t('إنشاء مهمة جديدة', 'Create New Task')}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* العنوان */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('عنوان المهمة', 'Task Title')}
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('مثال: فحص حساس الهواء', 'Example: Check air sensor')}
              />
            </div>

            {/* الوصف */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('وصف المهمة', 'Task Description')}
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('اشرح تفاصيل المهمة...', 'Describe the task details...')}
              />
            </div>

            {/* الموظف المكلف */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('الموظف المكلف', 'Assigned Employee')}
              </label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} ({employee.type === 'manager' ? t('مدير', 'Manager') :
                     employee.type === 'confident' ? t('واثق', 'Confident') :
                     t('موجه', 'Guided')})
                  </option>
                ))}
              </select>
            </div>

            {/* الأولوية */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('الأولوية', 'Priority')}
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as Task['priority']})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">{t('منخفضة', 'Low')}</option>
                <option value="medium">{t('متوسطة', 'Medium')}</option>
                <option value="high">{t('مرتفعة', 'High')}</option>
                <option value="urgent">{t('عاجلة', 'Urgent')}</option>
              </select>
            </div>

            {/* معلومات العميل */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('معلومات العميل (اختيارية)', 'Customer Information (Optional)')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('اسم العميل', 'Customer Name')}
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('رقم الهاتف', 'Phone Number')}
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('موديل السيارة', 'Car Model')}
                  </label>
                  <input
                    type="text"
                    value={formData.carModel}
                    onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Toyota Camry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('سنة الصنع', 'Manufacturing Year')}
                  </label>
                  <input
                    type="text"
                    value={formData.carYear}
                    onChange={(e) => setFormData({...formData, carYear: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2018"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('رقم اللوحة', 'License Plate')}
                  </label>
                  <input
                    type="text"
                    value={formData.licensePlate}
                    onChange={(e) => setFormData({...formData, licensePlate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ABC 1234"
                  />
                </div>
              </div>
            </div>

            {/* أكواد DTC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('أكواد الأعطال (منفصلة بفواصل)', 'DTC Codes (comma separated)')}
              </label>
              <input
                type="text"
                value={formData.dtcCodes}
                onChange={(e) => setFormData({...formData, dtcCodes: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="P0171, P0300"
              />
            </div>

            {/* زر المساعدة الذكية */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {t('المساعدة الذكية', 'AI Assistance')}
                </h3>
                <Button
                  type="button"
                  onClick={getAIHelp}
                  disabled={isLoadingAI}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isLoadingAI ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin me-2"></div>
                      {t('جاري التحليل...', 'Analyzing...')}
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4 me-2" />
                      {t('احصل على اقتراحات ذكية', 'Get Smart Suggestions')}
                      <Sparkles className="w-3 h-3 ms-2" />
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {t('احصل على اقتراحات ذكية لعنوان المهمة، الوصف، والخطوات المطلوبة', 'Get smart suggestions for task title, description, and required steps')}
              </p>

              {/* نتائج المساعدة الذكية */}
              {showAISuggestion && (
                <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Bot className="w-5 h-5 text-purple-600" />
                    <h4 className="font-medium text-gray-900">
                      {t('الاقتراحات الذكية', 'Smart Suggestions')}
                    </h4>
                  </div>
                  
                  {isLoadingAI ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-gray-600 text-sm">
                          {t('جاري تحليل معلومات السيارة...', 'Analyzing car information...')}
                        </p>
                      </div>
                    </div>
                  ) : aiSuggestion ? (
                    <div>
                      <div className="bg-white p-4 rounded-lg border border-blue-100 mb-3">
                        <div className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed max-h-64 overflow-y-auto custom-scrollbar">
                          {aiSuggestion}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(aiSuggestion);
                            showToast('تم نسخ الاقتراحات', 'success');
                          }}
                          className="text-purple-600 hover:bg-purple-100"
                        >
                          <HelpCircle className="w-4 h-4 me-2" />
                          {t('نسخ الاقتراحات', 'Copy Suggestions')}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAISuggestion(false)}
                          className="text-gray-600 hover:bg-gray-100"
                        >
                          {t('إخفاء', 'Hide')}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600 text-sm">
                        {t('انقر على الزر أعلاه للحصول على اقتراحات ذكية', 'Click the button above to get smart suggestions')}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* أزرار التحكم */}
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit">
                {t('إنشاء المهمة', 'Create Task')}
              </Button>
              <Button type="button" variant="ghost" onClick={onClose}>
                {t('إلغاء', 'Cancel')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// مكون نافذة المساعدة الذكية
const AIHelpModal: React.FC<{
  task: Task;
  response: string;
  isLoading: boolean;
  onClose: () => void;
}> = ({ task, response, isLoading, onClose }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const copyResponse = () => {
    navigator.clipboard.writeText(response);
    showToast('تم نسخ المساعدة', 'success');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* رأس النافذة */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {t('المساعدة الذكية للمهمة', 'AI Help for Task')}
                </h2>
                <p className="text-purple-100 text-sm">
                  {task.title}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              ×
            </Button>
          </div>
        </div>

        {/* محتوى النافذة */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* معلومات المهمة */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              {t('تفاصيل المهمة', 'Task Details')}
            </h3>
            <div className="space-y-2 text-sm">
              <p><strong>{t('العنوان:', 'Title:')}</strong> {task.title}</p>
              <p><strong>{t('الوصف:', 'Description:')}</strong> {task.description}</p>
              {task.customerInfo && (
                <>
                  <p><strong>{t('السيارة:', 'Car:')}</strong> {task.customerInfo.carModel} {task.customerInfo.carYear}</p>
                  <p><strong>{t('العميل:', 'Customer:')}</strong> {task.customerInfo.name}</p>
                </>
              )}
              {task.dtcCodes && task.dtcCodes.length > 0 && (
                <p><strong>{t('أكواد الأعطال:', 'DTC Codes:')}</strong> {task.dtcCodes.join(', ')}</p>
              )}
            </div>
          </div>

          {/* استجابة المساعد الذكي */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">
                {t('التوصيات الذكية', 'AI Recommendations')}
              </h3>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    {t('جاري تحليل المهمة...', 'Analyzing task...')}
                  </p>
                </div>
              </div>
            ) : response ? (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {response}
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyResponse}
                    className="text-purple-600 hover:bg-purple-100"
                  >
                    <HelpCircle className="w-4 h-4 me-2" />
                    {t('نسخ التوصيات', 'Copy Recommendations')}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">
                  {t('لم يتم الحصول على توصيات بعد', 'No recommendations yet')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose}>
            {t('إغلاق', 'Close')}
          </Button>
          {response && (
            <Button 
              onClick={copyResponse}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <HelpCircle className="w-4 h-4 me-2" />
              {t('نسخ التوصيات', 'Copy Recommendations')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};