export interface Employee {
  id: string;
  name: string;
  phone: string;
  type: 'manager' | 'confident' | 'guided';
  isOnline: boolean;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
  dtcCodes?: string[];
  customerInfo?: {
    name: string;
    phone: string;
    carModel: string;
    carYear: string;
    licensePlate: string;
  };
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'voice' | 'task' | 'location' | 'contact';
  taskId?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number; // للملفات الصوتية والفيديو
  thumbnail?: string; // للفيديو
  replyTo?: string; // للرد على رسالة
  isForwarded?: boolean; // للرسائل المعاد توجيهها
  reactions?: { [userId: string]: string }; // التفاعلات
  isEdited?: boolean; // للرسائل المعدلة
  editedAt?: Date; // تاريخ التعديل
  priority?: 'low' | 'normal' | 'high' | 'urgent'; // أولوية الرسالة
  category?: 'general' | 'task' | 'urgent' | 'training' | 'announcement'; // فئة الرسالة
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'announcement';
  participants: string[];
  createdBy: string;
  createdAt: Date;
  lastMessage?: Message;
  isActive: boolean;
  description?: string;
  avatar?: string;
}

export interface ChatNotification {
  id: string;
  userId: string;
  messageId: string;
  type: 'message' | 'mention' | 'task' | 'urgent';
  isRead: boolean;
  createdAt: Date;
}

export interface DTCCode {
  code: string;
  description: string;
  possibleCauses: string[];
  suggestedSolutions: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface Language {
  code: 'ar' | 'en';
  name: string;
  direction: 'rtl' | 'ltr';
}