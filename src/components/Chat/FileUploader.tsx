import React, { useRef, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../ui/Toast';
import { Button } from '../ui/Button';
import { 
  Upload, 
  File, 
  Image as ImageIcon, 
  X, 
  FileText,
  Music,
  Video,
  Archive,
  Download
} from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File, type: 'image' | 'file') => void;
  onClose: () => void;
  maxSize?: number; // بالميجابايت
  allowedTypes?: string[];
}

export const FileUploader: React.FC<FileUploaderProps> = ({ 
  onFileSelect, 
  onClose, 
  maxSize = 10,
  allowedTypes = ['image/*', 'application/*', 'text/*', 'audio/*', 'video/*']
}) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-blue-600" />;
    if (type.startsWith('audio/')) return <Music className="w-8 h-8 text-purple-600" />;
    if (type.startsWith('video/')) return <Video className="w-8 h-8 text-red-600" />;
    if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-600" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="w-8 h-8 text-orange-600" />;
    return <File className="w-8 h-8 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File) => {
    // فحص الحجم
    if (file.size > maxSize * 1024 * 1024) {
      showToast(t(`حجم الملف كبير جداً. الحد الأقصى ${maxSize} ميجابايت`, `File too large. Max ${maxSize}MB`), 'error');
      return false;
    }

    // فحص النوع
    const isAllowed = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isAllowed) {
      showToast(t('نوع الملف غير مدعوم', 'File type not supported'), 'error');
      return false;
    }

    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);

    // إنشاء معاينة للصور
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const sendFile = () => {
    if (selectedFile) {
      const type = selectedFile.type.startsWith('image/') ? 'image' : 'file';
      onFileSelect(selectedFile, type);
      onClose();
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        {/* رأس النافذة */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-brand-primary to-brand-yellow-300 text-brand-secondary rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {t('رفع ملف', 'Upload File')}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-brand-secondary hover:bg-brand-yellow-200">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* محتوى النافذة */}
        <div className="p-6 space-y-6">
          {!selectedFile ? (
            <>
              {/* منطقة السحب والإفلات */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                  dragOver 
                    ? 'border-brand-primary bg-brand-yellow-50' 
                    : 'border-gray-300 hover:border-brand-primary hover:bg-brand-yellow-25'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {t('اسحب الملف هنا أو انقر للاختيار', 'Drag file here or click to select')}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {t(`الحد الأقصى: ${maxSize} ميجابايت`, `Max size: ${maxSize}MB`)}
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-brand-primary hover:bg-brand-yellow-400 text-brand-secondary"
                >
                  <Upload className="w-4 h-4 me-2" />
                  {t('اختيار ملف', 'Choose File')}
                </Button>
              </div>

              {/* أنواع الملفات المدعومة */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  {t('الملفات المدعومة:', 'Supported files:')}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    {t('الصور', 'Images')} (JPG, PNG, GIF)
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-red-600" />
                    {t('المستندات', 'Documents')} (PDF, DOC)
                  </div>
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-purple-600" />
                    {t('الصوتيات', 'Audio')} (MP3, WAV)
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-red-600" />
                    {t('الفيديو', 'Video')} (MP4, AVI)
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* معاينة الملف المحدد */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {preview ? (
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="w-16 h-16 object-cover rounded-lg border-2 border-brand-yellow-300"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-white rounded-lg border-2 border-gray-200 flex items-center justify-center">
                        {getFileIcon(selectedFile)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {selectedFile.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatFileSize(selectedFile.size)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {selectedFile.type || t('نوع غير معروف', 'Unknown type')}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* معاينة مفصلة للصور */}
              {preview && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <img 
                    src={preview} 
                    alt="Full preview" 
                    className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </>
          )}

          {/* أزرار الإجراءات */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {selectedFile ? (
              <>
                <Button
                  onClick={sendFile}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Upload className="w-4 h-4 me-2" />
                  {t('إرسال الملف', 'Send File')}
                </Button>
                <Button
                  onClick={clearSelection}
                  variant="ghost"
                  className="flex-1"
                >
                  {t('اختيار ملف آخر', 'Choose Another')}
                </Button>
              </>
            ) : (
              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full"
              >
                {t('إلغاء', 'Cancel')}
              </Button>
            )}
          </div>
        </div>

        {/* حقل الإدخال المخفي */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={allowedTypes.join(',')}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};