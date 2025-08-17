import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../ui/Toast';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import OpenAIService, { ChatMessage, DiagnosticRequest } from '../../services/openai';
import { 
  Bot, 
  Send, 
  X, 
  MessageSquare, 
  Wrench, 
  AlertTriangle, 
  Calendar,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Car,
  Settings,
  BookOpen
} from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

type AssistantMode = 'chat' | 'diagnostic' | 'dtc' | 'parts' | 'maintenance';

interface Message extends ChatMessage {
  id: string;
  timestamp: Date;
  isLoading?: boolean;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [mode, setMode] = useState<AssistantMode>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const openAIService = OpenAIService.getInstance();

  // نموذج التشخيص
  const [diagnosticForm, setDiagnosticForm] = useState<DiagnosticRequest>({
    carModel: '',
    year: '',
    symptoms: '',
    dtcCodes: '',
    mileage: ''
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // فحص الاتصال عند فتح المساعد
  useEffect(() => {
    if (isOpen && isConnected === null) {
      checkConnection();
    }
  }, [isOpen]);

  // إضافة رسالة ترحيب
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `مرحباً بك في المساعد الذكي لتشخيص السيارات! 🚗✨

أنا هنا لمساعدتك في:
🔧 تشخيص أعطال السيارات
⚠️ شرح أكواد الأعطال (DTC)
🔩 معلومات قطع الغيار
📅 جداول الصيانة المخصصة
💬 الإجابة على أسئلتك التقنية

كيف يمكنني مساعدتك اليوم؟`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  const checkConnection = async () => {
    try {
      const connected = await openAIService.testConnection();
      setIsConnected(connected);
      if (!connected) {
        showToast('فشل في الاتصال بالمساعد الذكي', 'error');
      }
    } catch (error) {
      setIsConnected(false);
      showToast('خطأ في الاتصال بالمساعد الذكي', 'error');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const chatMessages: ChatMessage[] = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({ role: msg.role, content: msg.content }));
      
      chatMessages.push({ role: 'user', content: inputMessage });

      const response = await openAIService.chat(chatMessages);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      showToast('تم الحصول على الإجابة', 'success');
    } catch (error) {
      showToast('فشل في الحصول على الإجابة', 'error');
      console.error('خطأ في إرسال الرسالة:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runDiagnostic = async () => {
    if (!diagnosticForm.carModel || !diagnosticForm.year || !diagnosticForm.symptoms) {
      showToast('يرجى ملء جميع الحقول المطلوبة', 'warning');
      return;
    }

    setIsLoading(true);

    try {
      const response = await openAIService.diagnoseProblem(diagnosticForm);

      const diagnosticMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🔧 **تشخيص ذكي للسيارة:**\n\n${response}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, diagnosticMessage]);
      showToast('تم إجراء التشخيص بنجاح', 'success');
      
      // إعادة تعيين النموذج
      setDiagnosticForm({
        carModel: '',
        year: '',
        symptoms: '',
        dtcCodes: '',
        mileage: ''
      });
    } catch (error) {
      showToast('فشل في إجراء التشخيص', 'error');
      console.error('خطأ في التشخيص:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    showToast('تم نسخ الرسالة', 'success');
  };

  const modes = [
    { id: 'chat', label: t('دردشة', 'Chat'), icon: MessageSquare, color: 'blue' },
    { id: 'diagnostic', label: t('تشخيص', 'Diagnostic'), icon: Wrench, color: 'green' },
    { id: 'dtc', label: t('أكواد الأعطال', 'DTC Codes'), icon: AlertTriangle, color: 'red' },
    { id: 'parts', label: t('قطع الغيار', 'Parts'), icon: Settings, color: 'purple' },
    { id: 'maintenance', label: t('الصيانة', 'Maintenance'), icon: Calendar, color: 'orange' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl">
        {/* رأس المساعد */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {t('المساعد الذكي', 'AI Assistant')}
                </h2>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="text-sm opacity-90">
                    {isConnected ? t('متصل', 'Connected') : t('غير متصل', 'Disconnected')}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* أوضاع المساعد */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {modes.map((modeOption) => {
              const Icon = modeOption.icon;
              return (
                <button
                  key={modeOption.id}
                  onClick={() => setMode(modeOption.id as AssistantMode)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 whitespace-nowrap
                    ${mode === modeOption.id
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {modeOption.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* محتوى المساعد */}
        <div className="flex-1 flex">
          {/* منطقة الرسائل */}
          <div className="flex-1 flex flex-col">
            {/* الرسائل */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-[80%] rounded-2xl px-4 py-3 shadow-sm
                      ${message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                      }
                    `}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${message.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {message.timestamp.toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {message.role === 'assistant' && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => copyMessage(message.content)}
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                            title={t('نسخ', 'Copy')}
                          >
                            <Copy className="w-3 h-3 text-gray-400" />
                          </button>
                          <button
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                            title={t('مفيد', 'Helpful')}
                          >
                            <ThumbsUp className="w-3 h-3 text-gray-400" />
                          </button>
                          <button
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                            title={t('غير مفيد', 'Not helpful')}
                          >
                            <ThumbsDown className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* مؤشر الكتابة */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      <span className="text-gray-600 text-sm">
                        {t('المساعد يكتب...', 'Assistant is typing...')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* منطقة الإدخال */}
            <div className="p-6 border-t border-gray-200 bg-white">
              {mode === 'chat' && (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={t('اكتب سؤالك هنا...', 'Type your question here...')}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    disabled={isLoading || !isConnected}
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={isLoading || !isConnected || !inputMessage.trim()}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {mode === 'diagnostic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={t('موديل السيارة', 'Car Model')}
                      value={diagnosticForm.carModel}
                      onChange={(e) => setDiagnosticForm({...diagnosticForm, carModel: e.target.value})}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <input
                      type="text"
                      placeholder={t('سنة الصنع', 'Year')}
                      value={diagnosticForm.year}
                      onChange={(e) => setDiagnosticForm({...diagnosticForm, year: e.target.value})}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <textarea
                    placeholder={t('اشرح الأعراض والمشاكل...', 'Describe symptoms and problems...')}
                    value={diagnosticForm.symptoms}
                    onChange={(e) => setDiagnosticForm({...diagnosticForm, symptoms: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={t('أكواد الأعطال (اختياري)', 'DTC Codes (optional)')}
                      value={diagnosticForm.dtcCodes}
                      onChange={(e) => setDiagnosticForm({...diagnosticForm, dtcCodes: e.target.value})}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <input
                      type="text"
                      placeholder={t('المسافة المقطوعة (اختياري)', 'Mileage (optional)')}
                      value={diagnosticForm.mileage}
                      onChange={(e) => setDiagnosticForm({...diagnosticForm, mileage: e.target.value})}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <Button 
                    onClick={runDiagnostic}
                    disabled={isLoading || !isConnected}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    <Wrench className="w-4 h-4 me-2" />
                    {t('تشخيص ذكي', 'Smart Diagnosis')}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* الشريط الجانبي للإجراءات السريعة */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              {t('إجراءات سريعة', 'Quick Actions')}
            </h3>
            
            <div className="space-y-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => setInputMessage('اشرح لي كود P0171')}
              >
                <AlertTriangle className="w-4 h-4 me-2" />
                {t('شرح كود عطل', 'Explain DTC Code')}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => setInputMessage('أين يقع حساس الهواء في كامري 2018؟')}
              >
                <Car className="w-4 h-4 me-2" />
                {t('موقع قطعة', 'Part Location')}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => setInputMessage('جدول صيانة لكامري 2018')}
              >
                <Calendar className="w-4 h-4 me-2" />
                {t('جدول صيانة', 'Maintenance Schedule')}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => setInputMessage('كيف أفحص بطارية السيارة؟')}
              >
                <BookOpen className="w-4 h-4 me-2" />
                {t('دليل فحص', 'Inspection Guide')}
              </Button>
            </div>

            {/* إحصائيات المحادثة */}
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">
                {t('إحصائيات الجلسة', 'Session Stats')}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('الرسائل', 'Messages')}</span>
                  <span className="font-medium">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('الحالة', 'Status')}</span>
                  <Badge variant={isConnected ? 'success' : 'danger'} size="sm">
                    {isConnected ? t('متصل', 'Connected') : t('غير متصل', 'Offline')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};