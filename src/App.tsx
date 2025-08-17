import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { useLanguage } from './hooks/useLanguage';
import { useToast } from './components/ui/Toast';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TaskManager } from './components/Tasks/TaskManager';
import { ChatSystem } from './components/Chat/ChatSystem';
import { SearchSystem } from './components/Search/SearchSystem';
import { AIAssistant } from './components/AI/AIAssistant';
import { EmployeeManager } from './components/Employees/EmployeeManager';
import { SettingsPage } from './components/Settings/SettingsPage';
import { ReportsPage } from './components/Reports/ReportsPage';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isRTL } = useLanguage();
  const { ToastContainer } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [unreadMessages] = useState(8);

  // الاستماع لحدث فتح المساعد الذكي من لوحة التحكم
  useEffect(() => {
    const handleOpenAI = () => setAiAssistantOpen(true);
    window.addEventListener('openAIAssistant', handleOpenAI);
    return () => window.removeEventListener('openAIAssistant', handleOpenAI);
  }, []);
  // عرض شاشة التحميل أثناء التحقق من المصادقة
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحقق من بيانات المستخدم...</p>
        </div>
      </div>
    );
  }

  // عرض نموذج تسجيل الدخول إذا لم يكن مسجل دخول
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'tasks':
        return (
          <ProtectedRoute requiredPermission="manage_tasks">
            <TaskManager />
          </ProtectedRoute>
        );
      case 'search':
        return <SearchSystem />;
      case 'reports':
        return (
          <ReportsPage />
        );
      case 'calendar':
        return (
          <div className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {isRTL ? 'التقويم والمواعيد' : 'Calendar & Appointments'}
              </h1>
              <p className="text-gray-600">
                {isRTL ? 'قريباً - نظام إدارة المواعيد والجدولة الذكية' : 'Coming Soon - Smart appointment and scheduling system'}
              </p>
            </div>
          </div>
        );
      case 'employees':
        return (
          <ProtectedRoute requiredPermission="manage_employees">
            <EmployeeManager />
          </ProtectedRoute>
        );
      case 'messages':
        return (
          <div className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {isRTL ? 'الرسائل' : 'Messages'}
              </h1>
              <p className="text-gray-600 mb-4">
                {isRTL ? 'استخدم زر الدردشة في الأعلى للمحادثة المباشرة' : 'Use the chat button at the top for instant messaging'}
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  {isRTL ? '💬 نظام الدردشة متاح الآن!' : '💬 Chat system is now available!'}
                </p>
              </div>
            </div>
          </div>
        );
      case 'archive':
        return (
          <div className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {isRTL ? 'الأرشيف' : 'Archive'}
              </h1>
              <p className="text-gray-600">
                {isRTL ? 'قريباً - نظام الأرشفة التلقائية مع البحث المتقدم' : 'Coming Soon - Automatic archive system with advanced search'}
              </p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <SettingsPage />
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-white via-brand-yellow-25 to-gray-50 ${isRTL ? 'font-arabic' : 'font-sans'}`}>
      <div className="flex h-screen">
        {/* الشريط الجانبي */}
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* المحتوى الرئيسي */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* الرأس */}
          <Header 
            onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            onChatToggle={() => setChatOpen(!chatOpen)}
            onAIToggle={() => setAiAssistantOpen(!aiAssistantOpen)}
            unreadMessages={unreadMessages}
          />

          {/* المحتوى */}
          <main className="flex-1 overflow-y-auto p-6 smooth-scroll bg-gradient-to-br from-white to-brand-yellow-25">
            {renderActiveComponent()}
          </main>
        </div>
      </div>

      {/* نظام الدردشة */}
      <ChatSystem 
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />

      {/* المساعد الذكي */}
      <AIAssistant 
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
      />

      {/* نظام التوست */}
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;