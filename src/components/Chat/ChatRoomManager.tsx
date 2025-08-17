import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../ui/Toast';
import { Modal, ModalContent, ModalFooter } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { employees } from '../../data/mockData';
import { ChatRoom } from '../../types';
import { 
  Users, 
  Plus, 
  Search, 
  X,
  UserPlus,
  Settings,
  Bell,
  MessageSquare,
  Shield,
  Globe,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

interface ChatRoomManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: (room: ChatRoom) => void;
}

export const ChatRoomManager: React.FC<ChatRoomManagerProps> = ({ 
  isOpen, 
  onClose, 
  onRoomCreated 
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [roomType, setRoomType] = useState<'group' | 'announcement'>('group');
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const filteredEmployees = employees.filter(emp => 
    emp.id !== user?.id && 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleParticipantToggle = (employeeId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleCreateRoom = () => {
    if (!roomName.trim()) {
      showToast(t('يرجى إدخال اسم الغرفة', 'Please enter room name'), 'error');
      return;
    }

    if (selectedParticipants.length === 0) {
      showToast(t('يرجى اختيار المشاركين', 'Please select participants'), 'error');
      return;
    }

    const newRoom: ChatRoom = {
      id: `${roomType}-${Date.now()}`,
      name: roomName,
      type: roomType,
      participants: [user?.id || '', ...selectedParticipants],
      createdBy: user?.id || '',
      createdAt: new Date(),
      isActive: true,
      description: roomDescription
    };

    onRoomCreated(newRoom);
    showToast(t('تم إنشاء الغرفة بنجاح', 'Room created successfully'), 'success');
    
    // إعادة تعيين النموذج
    setRoomName('');
    setRoomDescription('');
    setSelectedParticipants([]);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={t('إدارة غرف الدردشة', 'Chat Room Management')} 
      size="xl"
    >
      <ModalContent>
        <div className="space-y-6">
          {/* تبويبات */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === 'create'
                  ? 'bg-white text-brand-secondary shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Plus className="w-4 h-4" />
              {t('إنشاء غرفة', 'Create Room')}
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                activeTab === 'manage'
                  ? 'bg-white text-brand-secondary shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              {t('إدارة الغرف', 'Manage Rooms')}
            </button>
          </div>

          {activeTab === 'create' ? (
            <div className="space-y-6">
              {/* نوع الغرفة */}
              <div>
                <label className="block text-sm font-semibold text-brand-secondary mb-3">
                  {t('نوع الغرفة', 'Room Type')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setRoomType('group')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      roomType === 'group'
                        ? 'border-brand-primary bg-brand-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{t('مجموعة', 'Group')}</span>
                    </div>
                    <p className="text-sm text-gray-600 text-start">
                      {t('دردشة جماعية للتعاون والنقاش', 'Group chat for collaboration and discussion')}
                    </p>
                  </button>
                  
                  <button
                    onClick={() => setRoomType('announcement')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      roomType === 'announcement'
                        ? 'border-brand-primary bg-brand-yellow-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Bell className="w-5 h-5 text-purple-600" />
                      <span className="font-medium">{t('إعلانات', 'Announcements')}</span>
                    </div>
                    <p className="text-sm text-gray-600 text-start">
                      {t('قناة للإعلانات والتحديثات المهمة', 'Channel for announcements and important updates')}
                    </p>
                  </button>
                </div>
              </div>

              {/* معلومات الغرفة */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-brand-secondary mb-2">
                    {t('اسم الغرفة', 'Room Name')}
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder={t('أدخل اسم الغرفة', 'Enter room name')}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-brand-secondary mb-2">
                    {t('الخصوصية', 'Privacy')}
                  </label>
                  <div className="flex items-center gap-3 h-12">
                    <button
                      onClick={() => setIsPrivate(!isPrivate)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                        isPrivate
                          ? 'border-red-300 bg-red-50 text-red-700'
                          : 'border-green-300 bg-green-50 text-green-700'
                      }`}
                    >
                      {isPrivate ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                      <span className="font-medium">
                        {isPrivate ? t('خاصة', 'Private') : t('عامة', 'Public')}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-secondary mb-2">
                  {t('وصف الغرفة (اختياري)', 'Room Description (Optional)')}
                </label>
                <textarea
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  placeholder={t('اكتب وصفاً مختصراً للغرفة', 'Write a brief description of the room')}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>

              {/* اختيار المشاركين */}
              <div>
                <label className="block text-sm font-semibold text-brand-secondary mb-3">
                  {t('المشاركون', 'Participants')} ({selectedParticipants.length})
                </label>
                
                {/* البحث */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('البحث عن موظف...', 'Search for employee...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>

                {/* قائمة الموظفين */}
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={employee.avatar}
                          alt={employee.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{employee.name}</p>
                          <p className="text-sm text-gray-500">{employee.phone}</p>
                        </div>
                        <Badge 
                          variant={employee.isOnline ? 'success' : 'gray'} 
                          size="sm"
                        >
                          {employee.isOnline ? t('متصل', 'Online') : t('غير متصل', 'Offline')}
                        </Badge>
                      </div>
                      
                      <button
                        onClick={() => handleParticipantToggle(employee.id)}
                        className={`p-2 rounded-lg transition-all ${
                          selectedParticipants.includes(employee.id)
                            ? 'bg-brand-primary text-brand-secondary'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {selectedParticipants.includes(employee.id) ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <UserPlus className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                {/* المشاركون المحددون */}
                {selectedParticipants.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {t('المشاركون المحددون:', 'Selected Participants:')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedParticipants.map((participantId) => {
                        const employee = employees.find(emp => emp.id === participantId);
                        return employee ? (
                          <div
                            key={participantId}
                            className="flex items-center gap-2 px-3 py-1 bg-brand-yellow-100 rounded-full border border-brand-yellow-300"
                          >
                            <img
                              src={employee.avatar}
                              alt={employee.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="text-sm font-medium text-brand-secondary">
                              {employee.name}
                            </span>
                            <button
                              onClick={() => handleParticipantToggle(participantId)}
                              className="text-brand-secondary hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* تبويب إدارة الغرف */
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('إدارة الغرف', 'Room Management')}
              </h3>
              <p className="text-gray-600">
                {t('قريباً - إدارة وتعديل الغرف الموجودة', 'Coming Soon - Manage and edit existing rooms')}
              </p>
            </div>
          )}
        </div>
      </ModalContent>

      <ModalFooter>
        {activeTab === 'create' && (
          <Button
            onClick={handleCreateRoom}
            disabled={!roomName.trim() || selectedParticipants.length === 0}
            className="bg-gradient-to-r from-brand-primary to-brand-yellow-400 hover:from-brand-yellow-400 hover:to-brand-yellow-300"
          >
            <Plus className="w-4 h-4 me-2" />
            {t('إنشاء الغرفة', 'Create Room')}
          </Button>
        )}
        <Button variant="ghost" onClick={onClose}>
          {t('إغلاق', 'Close')}
        </Button>
      </ModalFooter>
    </Modal>
  );
};