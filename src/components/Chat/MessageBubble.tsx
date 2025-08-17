import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Message } from '../../types';
import { 
  Download, 
  Play, 
  Pause, 
  File, 
  Image as ImageIcon,
  Music,
  Video,
  FileText,
  Archive,
  Eye,
  X,
  Reply,
  Forward,
  Star,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap
} from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName?: string;
  onReply?: () => void;
  onAction?: (action: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwn, 
  senderName, 
  onReply, 
  onAction 
}) => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return <ImageIcon className="w-5 h-5 text-blue-600" />;
      case 'mp3':
      case 'wav':
      case 'ogg':
      case 'webm':
        return <Music className="w-5 h-5 text-purple-600" />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'webm':
        return <Video className="w-5 h-5 text-red-600" />;
      case 'pdf':
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-red-600" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <Archive className="w-5 h-5 text-orange-600" />;
      default:
        return <File className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadFile = () => {
    if (message.fileUrl && message.fileName) {
      const a = document.createElement('a');
      a.href = message.fileUrl;
      a.download = message.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const toggleAudioPlay = () => {
    // هنا يمكن إضافة منطق تشغيل الصوت
    setIsPlaying(!isPlaying);
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-3 h-3 text-red-500" />;
      case 'high':
        return <Zap className="w-3 h-3 text-orange-500" />;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'task':
        return <Badge variant="warning" size="sm">{t('مهمة', 'Task')}</Badge>;
      case 'urgent':
        return <Badge variant="danger" size="sm">{t('عاجل', 'Urgent')}</Badge>;
      case 'training':
        return <Badge variant="primary" size="sm">{t('تدريب', 'Training')}</Badge>;
      case 'announcement':
        return <Badge variant="success" size="sm">{t('إعلان', 'Announcement')}</Badge>;
      default:
        return null;
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        );

      case 'image':
        return (
          <div className="space-y-2">
            {message.fileUrl && (
              <div className="relative group">
                <img
                  src={message.fileUrl}
                  alt={message.fileName || 'Image'}
                  className="max-w-xs max-h-64 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setShowImageModal(true)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all duration-200 flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )}
            {message.content && (
              <p className="text-sm text-gray-600">{message.content}</p>
            )}
          </div>
        );

      case 'file':
        return (
          <div className="bg-gray-50 rounded-lg p-3 max-w-xs">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {getFileIcon(message.fileName || '')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {message.fileName}
                </p>
                {message.fileSize && (
                  <p className="text-xs text-gray-500">
                    {formatFileSize(message.fileSize)}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadFile}
                className="flex-shrink-0 p-1 hover:bg-gray-200"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
            {message.content && (
              <p className="text-sm text-gray-600 mt-2">{message.content}</p>
            )}
          </div>
        );

      case 'audio':
      case 'voice':
        return (
          <div className="bg-gray-50 rounded-lg p-3 max-w-xs">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAudioPlay}
                className="flex-shrink-0 p-2 rounded-full bg-brand-primary hover:bg-brand-yellow-400 text-brand-secondary"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-300 rounded-full">
                    <div className="h-1 bg-brand-primary rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  {message.duration && (
                    <span className="text-xs text-gray-500">
                      {formatDuration(message.duration)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {message.type === 'voice' ? t('رسالة صوتية', 'Voice message') : t('ملف صوتي', 'Audio file')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadFile}
                className="flex-shrink-0 p-1 hover:bg-gray-200"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
            {message.content && (
              <p className="text-sm text-gray-600 mt-2">{message.content}</p>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="space-y-2">
            {message.fileUrl && (
              <video
                src={message.fileUrl}
                controls
                className="max-w-xs max-h-64 rounded-lg"
                poster={message.thumbnail}
              />
            )}
            {message.content && (
              <p className="text-sm text-gray-600">{message.content}</p>
            )}
          </div>
        );

      default:
        return (
          <p className="text-sm leading-relaxed">
            {message.content}
          </p>
        );
    }
  };

  return (
    <>
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 group`}>
        <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
          {/* الرد على رسالة */}
          {message.replyTo && (
            <div className="mb-2 px-3">
              <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg border-l-4 border-blue-500">
                <Reply className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-gray-600">{t('رد على رسالة', 'Reply to message')}</span>
              </div>
            </div>
          )}
          
          {!isOwn && senderName && (
            <div className="flex items-center justify-between mb-1 px-3">
              <p className="text-xs text-gray-500 font-medium">{senderName}</p>
              <div className="flex items-center gap-1">
                {getPriorityIcon(message.priority)}
                {getCategoryBadge(message.category)}
              </div>
            </div>
          )}
          
          <div
            className={`rounded-2xl px-4 py-3 shadow-sm ${
              isOwn
                ? 'bg-gradient-to-r from-brand-primary to-brand-yellow-300 text-brand-secondary border border-brand-yellow-400'
                : 'bg-white text-gray-800 border border-gray-200'
            }`}
          >
            {/* أيقونة الرسالة المعاد توجيهها */}
            {message.isForwarded && (
              <div className="flex items-center gap-1 mb-2 text-xs opacity-70">
                <Forward className="w-3 h-3" />
                <span>{t('معاد توجيهها', 'Forwarded')}</span>
              </div>
            )}
            
            {renderMessageContent()}
            
            {/* أزرار الإجراءات السريعة */}
            <div className={`absolute top-2 ${isOwn ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 transition-opacity`}>
              <div className="flex gap-1">
                {onReply && (
                  <button
                    onClick={onReply}
                    className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title={t('رد', 'Reply')}
                  >
                    <Reply className="w-3 h-3 text-gray-600" />
                  </button>
                )}
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-1 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  title={t('المزيد', 'More')}
                >
                  <MoreHorizontal className="w-3 h-3 text-gray-600" />
                </button>
              </div>
              
              {/* قائمة الإجراءات */}
              {showActions && (
                <div className="absolute top-8 right-0 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-32">
                  <button
                    onClick={() => {
                      onAction?.('forward');
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Forward className="w-3 h-3" />
                    {t('إعادة توجيه', 'Forward')}
                  </button>
                  <button
                    onClick={() => {
                      onAction?.('star');
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Star className="w-3 h-3" />
                    {t('إضافة للمفضلة', 'Add to favorites')}
                  </button>
                  <button
                    onClick={() => {
                      onAction?.('copy');
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Download className="w-3 h-3" />
                    {t('نسخ', 'Copy')}
                  </button>
                </div>
              )}
            </div>
            
            <div className={`flex items-center justify-between mt-2 ${
              isOwn ? 'text-brand-black-600' : 'text-gray-500'
            }`}>
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3" />
                <span className="text-xs">
                  {message.timestamp.toLocaleTimeString('ar-SA', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
                {message.isEdited && (
                  <span className="text-xs opacity-70">
                    {t('معدلة', 'edited')}
                  </span>
                )}
              </div>
              
              {isOwn && (
                <div className="flex items-center gap-1">
                  {message.isRead ? (
                    <CheckCircle2 className="w-3 h-3 text-blue-500" />
                  ) : (
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                      <div className="w-2 h-2 rounded-full bg-gray-400" />
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* التفاعلات */}
            {message.reactions && Object.keys(message.reactions).length > 0 && (
              <div className="flex gap-1 mt-2">
                {Object.entries(message.reactions).map(([userId, reaction]) => (
                  <span key={userId} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {reaction}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* نافذة عرض الصورة */}
      {showImageModal && message.type === 'image' && message.fileUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 z-10"
            >
              <X className="w-6 h-6" />
            </Button>
            <img
              src={message.fileUrl}
              alt={message.fileName || 'Image'}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            {message.fileName && (
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
                <p className="text-sm">{message.fileName}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};