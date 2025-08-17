import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../ui/Toast';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MediaRecorder } from './MediaRecorder';
import { FileUploader } from './FileUploader';
import { MessageBubble } from './MessageBubble';
import { ChatRoomManager } from './ChatRoomManager';
import { employees } from '../../data/mockData';
import { Message, ChatRoom } from '../../types';
import { 
  Send, 
  Image as ImageIcon,
  Paperclip, 
  Phone,
  Video,
  X,
  Circle,
  Mic,
  Camera,
  Smile,
  MoreHorizontal,
  Search,
  Filter,
  Users,
  Settings,
  Bell,
  BellOff,
  Pin,
  Archive,
  Star,
  Reply,
  Forward,
  Edit,
  Trash2,
  Download,
  Copy,
  Flag,
  UserPlus,
  MessageSquare,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';

interface ChatSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatSystem: React.FC<ChatSystemProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();
  const { showToast } = useToast();
  
  // حالات الدردشة
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'urgent' | 'tasks'>('all');
  
  // حالات الوسائط
  const [showMediaRecorder, setShowMediaRecorder] = useState(false);
  const [showFileUploader, setShowFileUploader] = useState(false);
  const [mediaType, setMediaType] = useState<'audio' | 'video' | 'voice'>('voice');
  
  // حالات التفاعل
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [showMessageActions, setShowMessageActions] = useState<string | null>(null);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  
  // حالات الإعدادات
  const [showChatSettings, setShowChatSettings] = useState(false);
  const [showRoomManager, setShowRoomManager] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  // تهيئة الدردشات عند التحميل
  useEffect(() => {
    initializeChatRooms();
  }, []);

  // تحديث الرسائل عند تغيير الدردشة المحددة
  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat);
    }
  }, [selectedChat]);

  // التمرير للأسفل عند إضافة رسائل جديدة
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // محاكاة الكتابة
  useEffect(() => {
    if (newMessage.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [newMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChatRooms = () => {
    const rooms: ChatRoom[] = [
      // دردشات مباشرة مع الموظفين
      ...employees.filter(emp => emp.id !== user?.id).map(emp => ({
        id: `direct-${emp.id}`,
        name: emp.name,
        type: 'direct' as const,
        participants: [user?.id || '', emp.id],
        createdBy: user?.id || '',
        createdAt: new Date(),
        isActive: true,
        avatar: emp.avatar
      })),
      // غرف جماعية
      {
        id: 'general',
        name: t('عام', 'General'),
        type: 'group' as const,
        participants: employees.map(emp => emp.id),
        createdBy: '1',
        createdAt: new Date(),
        isActive: true,
        description: t('دردشة عامة لجميع الموظفين', 'General chat for all employees')
      },
      {
        id: 'technical',
        name: t('الدعم الفني', 'Technical Support'),
        type: 'group' as const,
        participants: employees.filter(emp => emp.type === 'confident' || emp.type === 'manager').map(emp => emp.id),
        createdBy: '1',
        createdAt: new Date(),
        isActive: true,
        description: t('دردشة للدعم الفني والمساعدة', 'Technical support and assistance chat')
      },
      {
        id: 'announcements',
        name: t('الإعلانات', 'Announcements'),
        type: 'announcement' as const,
        participants: employees.map(emp => emp.id),
        createdBy: '1',
        createdAt: new Date(),
        isActive: true,
        description: t('إعلانات الإدارة والتحديثات المهمة', 'Management announcements and important updates')
      }
    ];
    setChatRooms(rooms);
  };

  const loadMessages = (chatId: string) => {
    // محاكاة تحميل الرسائل
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: '2',
        receiverId: user?.id || '',
        content: t('مرحباً، كيف يمكنني مساعدتك اليوم؟', 'Hello, how can I help you today?'),
        timestamp: new Date(Date.now() - 3600000),
        isRead: true,
        type: 'text',
        category: 'general'
      },
      {
        id: '2',
        senderId: user?.id || '',
        receiverId: '2',
        content: t('أحتاج مساعدة في فحص حساس الهواء', 'I need help with air sensor inspection'),
        timestamp: new Date(Date.now() - 3000000),
        isRead: true,
        type: 'text',
        category: 'task',
        priority: 'high'
      },
      {
        id: '3',
        senderId: '2',
        receiverId: user?.id || '',
        content: t('بالطبع! سأرسل لك الدليل الفني', 'Of course! I\'ll send you the technical manual'),
        timestamp: new Date(Date.now() - 2400000),
        isRead: true,
        type: 'text',
        category: 'task'
      }
    ];
    setMessages(mockMessages);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      receiverId: selectedChat.startsWith('direct-') ? selectedChat.replace('direct-', '') : selectedChat,
      content: newMessage,
      timestamp: new Date(),
      isRead: false,
      type: 'text',
      category: 'general',
      priority: 'normal',
      replyTo: replyToMessage?.id
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setReplyToMessage(null);

    // محاكاة رد تلقائي
    if (selectedChat.startsWith('direct-')) {
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          senderId: selectedChat.replace('direct-', ''),
          receiverId: user?.id || '',
          content: t('تم استلام رسالتك، سأرد عليك قريباً', 'Message received, I will reply soon'),
          timestamp: new Date(),
          isRead: false,
          type: 'text',
          category: 'general'
        };
        setMessages(prev => [...prev, reply]);
        
        if (soundEnabled) {
          // تشغيل صوت إشعار
          const audio = new Audio('/notification.mp3');
          audio.play().catch(() => {});
        }
      }, 2000);
    }

    if (soundEnabled) {
      // تشغيل صوت الإرسال
      const audio = new Audio('/send.mp3');
      audio.play().catch(() => {});
    }
  };

  const sendMediaFile = (file: File, type: 'audio' | 'video' | 'voice' | 'image' | 'file') => {
    if (!selectedChat) return;

    const fileUrl = URL.createObjectURL(file);
    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      receiverId: selectedChat.startsWith('direct-') ? selectedChat.replace('direct-', '') : selectedChat,
      content: '',
      timestamp: new Date(),
      isRead: false,
      type: type,
      fileUrl: fileUrl,
      fileName: file.name,
      fileSize: file.size,
      duration: type === 'audio' || type === 'voice' || type === 'video' ? 30 : undefined,
      category: 'general',
      priority: 'normal'
    };

    setMessages(prev => [...prev, message]);
    showToast(t('تم إرسال الملف', 'File sent'), 'success');

    // محاكاة رد تلقائي
    if (selectedChat.startsWith('direct-')) {
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          senderId: selectedChat.replace('direct-', ''),
          receiverId: user?.id || '',
          content: t('تم استلام الملف، شكراً لك', 'File received, thank you'),
          timestamp: new Date(),
          isRead: false,
          type: 'text',
          category: 'general'
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }
  };

  const handleMessageAction = (action: string, messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    switch (action) {
      case 'reply':
        setReplyToMessage(message);
        messageInputRef.current?.focus();
        break;
      case 'forward':
        // منطق إعادة التوجيه
        showToast(t('تم نسخ الرسالة للتوجيه', 'Message copied for forwarding'), 'info');
        break;
      case 'copy':
        navigator.clipboard.writeText(message.content);
        showToast(t('تم نسخ النص', 'Text copied'), 'success');
        break;
      case 'star':
        // إضافة للمفضلة
        showToast(t('تم إضافة الرسالة للمفضلة', 'Message added to favorites'), 'success');
        break;
      case 'delete':
        if (message.senderId === user?.id) {
          setMessages(prev => prev.filter(m => m.id !== messageId));
          showToast(t('تم حذف الرسالة', 'Message deleted'), 'success');
        }
        break;
      case 'report':
        showToast(t('تم الإبلاغ عن الرسالة', 'Message reported'), 'warning');
        break;
    }
    setShowMessageActions(null);
  };

  const getEmployeeById = (id: string) => {
    return employees.find(emp => emp.id === id);
  };

  const getChatName = (chatId: string) => {
    const room = chatRooms.find(r => r.id === chatId);
    if (room) {
      if (room.type === 'direct') {
        const otherUserId = room.participants.find(p => p !== user?.id);
        const employee = getEmployeeById(otherUserId || '');
        return employee?.name || room.name;
      }
      return room.name;
    }
    return t('غير معروف', 'Unknown');
  };

  const getChatAvatar = (chatId: string) => {
    const room = chatRooms.find(r => r.id === chatId);
    if (room) {
      if (room.type === 'direct') {
        const otherUserId = room.participants.find(p => p !== user?.id);
        const employee = getEmployeeById(otherUserId || '');
        return employee?.avatar;
      }
      return room.avatar;
    }
    return undefined;
  };

  const getUnreadCount = (chatId: string) => {
    return messages.filter(m => 
      (m.receiverId === user?.id || chatId.startsWith('group-')) && 
      !m.isRead && 
      m.senderId !== user?.id
    ).length;
  };

  const filteredChatRooms = chatRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || 
      (filterType === 'unread' && getUnreadCount(room.id) > 0) ||
      (filterType === 'urgent' && messages.some(m => m.priority === 'urgent')) ||
      (filterType === 'tasks' && messages.some(m => m.category === 'task'));
    return matchesSearch && matchesFilter;
  });

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-7xl h-[90vh] flex shadow-2xl border-4 border-brand-primary">
          
          {/* الشريط الجانبي - قائمة الدردشات */}
          <div className="w-1/3 border-e-4 border-brand-yellow-200 flex flex-col bg-gradient-to-b from-white to-brand-yellow-25">
            
            {/* رأس الشريط الجانبي */}
            <div className="p-4 border-b-2 border-brand-yellow-200 bg-gradient-to-r from-brand-primary to-brand-yellow-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-secondary rounded-xl flex items-center justify-center border-2 border-brand-yellow-400">
                    <MessageSquare className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-secondary text-lg">
                      {t('نظام الدردشة', 'Chat System')}
                    </h3>
                    <p className="text-sm text-brand-black-700 font-medium">
                      {t('تواصل مع الفريق', 'Connect with team')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowRoomManager(true)}
                    className="text-brand-secondary hover:bg-brand-yellow-200 border border-brand-yellow-400"
                  >
                    <UserPlus className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowChatSettings(true)}
                    className="text-brand-secondary hover:bg-brand-yellow-200 border border-brand-yellow-400"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClose}
                    className="text-brand-secondary hover:bg-red-200 hover:text-red-600 border border-brand-yellow-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* البحث والتصفية */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-black-500" />
                  <input
                    type="text"
                    placeholder={t('البحث في الدردشات...', 'Search chats...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white border-2 border-brand-yellow-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary text-sm"
                  />
                </div>
                
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: t('الكل', 'All'), icon: MessageSquare },
                    { id: 'unread', label: t('غير مقروءة', 'Unread'), icon: Bell },
                    { id: 'urgent', label: t('عاجل', 'Urgent'), icon: AlertTriangle },
                    { id: 'tasks', label: t('مهام', 'Tasks'), icon: CheckCircle2 }
                  ].map((filter) => {
                    const Icon = filter.icon;
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setFilterType(filter.id as any)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all ${
                          filterType === filter.id
                            ? 'bg-brand-secondary text-brand-primary border border-brand-yellow-400'
                            : 'bg-white text-brand-secondary hover:bg-brand-yellow-100 border border-brand-yellow-300'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* قائمة الدردشات */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {filteredChatRooms.map((room) => {
                const unreadCount = getUnreadCount(room.id);
                const isSelected = selectedChat === room.id;
                const avatar = getChatAvatar(room.id);
                
                return (
                  <div
                    key={room.id}
                    onClick={() => setSelectedChat(room.id)}
                    className={`p-4 border-b border-brand-yellow-100 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-brand-yellow-200 to-brand-yellow-300 border-l-4 border-l-brand-secondary shadow-md' 
                        : 'hover:bg-brand-yellow-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {avatar ? (
                          <img 
                            src={avatar} 
                            alt={room.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-brand-yellow-300 shadow-md"
                          />
                        ) : (
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-brand-yellow-300 shadow-md ${
                            room.type === 'group' ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                            room.type === 'announcement' ? 'bg-gradient-to-br from-purple-100 to-purple-200' :
                            'bg-gradient-to-br from-brand-yellow-100 to-brand-yellow-200'
                          }`}>
                            {room.type === 'group' ? (
                              <Users className="w-6 h-6 text-blue-600" />
                            ) : room.type === 'announcement' ? (
                              <Bell className="w-6 h-6 text-purple-600" />
                            ) : (
                              <MessageSquare className="w-6 h-6 text-brand-secondary" />
                            )}
                          </div>
                        )}
                        
                        {room.type === 'direct' && (
                          <div className={`absolute -bottom-1 -end-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                            getEmployeeById(room.participants.find(p => p !== user?.id) || '')?.isOnline 
                              ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-brand-secondary truncate">
                            {getChatName(room.id)}
                          </h4>
                          <div className="flex items-center gap-2">
                            {room.type === 'announcement' && (
                              <Pin className="w-3 h-3 text-purple-600" />
                            )}
                            {unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-brand-black-600 truncate mt-1">
                          {room.description || t('انقر للدردشة', 'Click to chat')}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                room.type === 'direct' ? 'primary' :
                                room.type === 'group' ? 'success' : 'warning'
                              } 
                              size="sm"
                            >
                              {room.type === 'direct' ? t('مباشر', 'Direct') :
                               room.type === 'group' ? t('مجموعة', 'Group') :
                               t('إعلانات', 'Announcements')}
                            </Badge>
                            
                            {room.type !== 'direct' && (
                              <span className="text-xs text-brand-black-500 font-medium">
                                {room.participants.length} {t('عضو', 'members')}
                              </span>
                            )}
                          </div>
                          
                          <span className="text-xs text-brand-black-400">
                            {room.createdAt.toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* إحصائيات سريعة */}
            <div className="p-4 border-t-2 border-brand-yellow-200 bg-brand-yellow-50">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-bold text-brand-secondary">{chatRooms.length}</div>
                  <div className="text-xs text-brand-black-600 font-medium">{t('دردشات', 'Chats')}</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {employees.filter(emp => emp.isOnline).length}
                  </div>
                  <div className="text-xs text-brand-black-600 font-medium">{t('متصل', 'Online')}</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">
                    {messages.filter(m => !m.isRead && m.receiverId === user?.id).length}
                  </div>
                  <div className="text-xs text-brand-black-600 font-medium">{t('غير مقروء', 'Unread')}</div>
                </div>
              </div>
            </div>
          </div>

          {/* منطقة المحادثة الرئيسية */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* رأس المحادثة */}
                <div className="p-4 border-b-2 border-brand-yellow-200 bg-gradient-to-r from-brand-yellow-50 to-brand-yellow-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {getChatAvatar(selectedChat) ? (
                          <img 
                            src={getChatAvatar(selectedChat)} 
                            alt={getChatName(selectedChat)}
                            className="w-12 h-12 rounded-full object-cover border-2 border-brand-yellow-300 shadow-md"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-brand-yellow-100 to-brand-yellow-200 rounded-full flex items-center justify-center border-2 border-brand-yellow-300">
                            <MessageSquare className="w-6 h-6 text-brand-secondary" />
                          </div>
                        )}
                        
                        {selectedChat.startsWith('direct-') && (
                          <div className={`absolute -bottom-1 -end-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                            getEmployeeById(selectedChat.replace('direct-', ''))?.isOnline 
                              ? 'bg-green-500' : 'bg-gray-400'
                          }`} />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-brand-secondary text-lg">
                          {getChatName(selectedChat)}
                        </h3>
                        <div className="flex items-center gap-2">
                          {selectedChat.startsWith('direct-') ? (
                            <div className="flex items-center gap-1">
                              <Circle className={`w-2 h-2 ${
                                getEmployeeById(selectedChat.replace('direct-', ''))?.isOnline 
                                  ? 'text-green-500 fill-current' : 'text-gray-400 fill-current'
                              }`} />
                              <span className="text-sm text-brand-black-600 font-medium">
                                {getEmployeeById(selectedChat.replace('direct-', ''))?.isOnline 
                                  ? t('متصل الآن', 'Online now') : t('غير متصل', 'Offline')}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-brand-black-600 font-medium">
                              {chatRooms.find(r => r.id === selectedChat)?.participants.length} {t('أعضاء', 'members')}
                            </span>
                          )}
                          
                          {typingUsers.length > 0 && (
                            <div className="flex items-center gap-1">
                              <div className="flex gap-1">
                                <div className="w-1 h-1 bg-brand-primary rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-brand-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-1 h-1 bg-brand-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                              </div>
                              <span className="text-xs text-brand-black-500 font-medium">
                                {t('يكتب...', 'typing...')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="hover:bg-brand-yellow-200">
                        <Search className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-brand-yellow-200">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-brand-yellow-200">
                        <Video className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setNotifications(!notifications)}
                        className="hover:bg-brand-yellow-200"
                      >
                        {notifications ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-brand-yellow-200">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* منطقة الرسائل */}
                <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white to-brand-yellow-25 custom-scrollbar">
                  {/* رسالة ترحيب */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-yellow-100 rounded-full border border-brand-yellow-300">
                      <Zap className="w-4 h-4 text-brand-secondary" />
                      <span className="text-sm font-medium text-brand-secondary">
                        {t('بداية المحادثة', 'Start of conversation')}
                      </span>
                    </div>
                  </div>

                  {/* الرسائل */}
                  {messages.map((message) => (
                    <div key={message.id} className="relative group">
                      <MessageBubble
                        message={message}
                        isOwn={message.senderId === user?.id}
                        senderName={message.senderId !== user?.id ? getEmployeeById(message.senderId)?.name : undefined}
                        onReply={() => setReplyToMessage(message)}
                        onAction={(action) => handleMessageAction(action, message.id)}
                      />
                      
                      {/* أزرار الإجراءات السريعة */}
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
                          <button
                            onClick={() => handleMessageAction('reply', message.id)}
                            className="p-1 hover:bg-gray-100 rounded text-gray-600"
                            title={t('رد', 'Reply')}
                          >
                            <Reply className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMessageAction('forward', message.id)}
                            className="p-1 hover:bg-gray-100 rounded text-gray-600"
                            title={t('إعادة توجيه', 'Forward')}
                          >
                            <Forward className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMessageAction('star', message.id)}
                            className="p-1 hover:bg-gray-100 rounded text-gray-600"
                            title={t('إضافة للمفضلة', 'Add to favorites')}
                          >
                            <Star className="w-3 h-3" />
                          </button>
                          {message.senderId === user?.id && (
                            <button
                              onClick={() => handleMessageAction('delete', message.id)}
                              className="p-1 hover:bg-red-100 rounded text-red-600"
                              title={t('حذف', 'Delete')}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div ref={messagesEndRef} />
                </div>

                {/* منطقة الرد */}
                {replyToMessage && (
                  <div className="px-4 py-2 bg-brand-yellow-50 border-t border-brand-yellow-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-1 h-8 bg-brand-primary rounded-full"></div>
                        <div>
                          <p className="text-xs font-medium text-brand-secondary">
                            {t('الرد على', 'Replying to')} {getEmployeeById(replyToMessage.senderId)?.name || t('أنت', 'You')}
                          </p>
                          <p className="text-sm text-brand-black-600 truncate max-w-xs">
                            {replyToMessage.content}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyToMessage(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* منطقة إرسال الرسائل */}
                <div className="p-4 border-t-2 border-brand-yellow-200 bg-white">
                  {/* أزرار الوسائط */}
                  <div className="flex gap-2 mb-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="hover:bg-blue-50 hover:text-blue-600 border border-blue-200"
                      title={t('إرسال صورة', 'Send image')}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowFileUploader(true)}
                      className="hover:bg-purple-50 hover:text-purple-600 border border-purple-200"
                      title={t('إرسال ملف', 'Send file')}
                    >
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setMediaType('voice');
                        setShowMediaRecorder(true);
                      }}
                      className="hover:bg-green-50 hover:text-green-600 border border-green-200"
                      title={t('رسالة صوتية', 'Voice message')}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setMediaType('video');
                        setShowMediaRecorder(true);
                      }}
                      className="hover:bg-red-50 hover:text-red-600 border border-red-200"
                      title={t('تسجيل فيديو', 'Record video')}
                    >
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="hover:bg-yellow-50 hover:text-yellow-600 border border-yellow-200"
                      title={t('رموز تعبيرية', 'Emojis')}
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* حقل الإدخال */}
                  <div className="flex gap-3">
                    <input
                      ref={messageInputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder={t('اكتب رسالتك هنا...', 'Type your message here...')}
                      className="flex-1 px-4 py-3 border-2 border-brand-yellow-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 bg-brand-yellow-25"
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-yellow-400 hover:from-brand-yellow-400 hover:to-brand-yellow-300 text-brand-secondary rounded-xl font-bold shadow-lg border-2 border-brand-yellow-300"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* اختيار دردشة */
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-white to-brand-yellow-25">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 bg-gradient-to-br from-brand-yellow-100 to-brand-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-brand-yellow-300 shadow-lg">
                    <MessageSquare className="w-12 h-12 text-brand-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-brand-secondary mb-4">
                    {t('مرحباً بك في نظام الدردشة', 'Welcome to Chat System')}
                  </h3>
                  <p className="text-brand-black-600 mb-6 leading-relaxed">
                    {t('اختر دردشة من القائمة الجانبية لبدء المحادثة مع زملائك في العمل', 'Select a chat from the sidebar to start conversation with your colleagues')}
                  </p>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <h4 className="font-bold text-blue-900">
                          {t('دردشات جماعية', 'Group Chats')}
                        </h4>
                      </div>
                      <p className="text-sm text-blue-700">
                        {t('تواصل مع الفريق في المجموعات المختلفة', 'Communicate with team in different groups')}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3 mb-2">
                        <MessageSquare className="w-5 h-5 text-green-600" />
                        <h4 className="font-bold text-green-900">
                          {t('دردشات مباشرة', 'Direct Messages')}
                        </h4>
                      </div>
                      <p className="text-sm text-green-700">
                        {t('محادثات خاصة مع الزملاء', 'Private conversations with colleagues')}
                      </p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Bell className="w-5 h-5 text-purple-600" />
                        <h4 className="font-bold text-purple-900">
                          {t('الإعلانات', 'Announcements')}
                        </h4>
                      </div>
                      <p className="text-sm text-purple-700">
                        {t('تحديثات مهمة من الإدارة', 'Important updates from management')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* نوافذ الوسائط */}
      {showMediaRecorder && (
        <MediaRecorder
          type={mediaType}
          onSendMedia={sendMediaFile}
          onClose={() => setShowMediaRecorder(false)}
        />
      )}

      {showFileUploader && (
        <FileUploader
          onFileSelect={sendMediaFile}
          onClose={() => setShowFileUploader(false)}
        />
      )}

      {showRoomManager && (
        <ChatRoomManager
          isOpen={showRoomManager}
          onClose={() => setShowRoomManager(false)}
          onRoomCreated={(room) => {
            setChatRooms(prev => [...prev, room]);
            setShowRoomManager(false);
          }}
        />
      )}

      {/* حقل اختيار الصور المخفي */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            sendMediaFile(files[0], 'image');
          }
        }}
      />
    </>
  );
};