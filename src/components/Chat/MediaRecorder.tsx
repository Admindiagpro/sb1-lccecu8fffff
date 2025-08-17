import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useToast } from '../ui/Toast';
import { Button } from '../ui/Button';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Square, 
  Play, 
  Pause,
  Trash2,
  Send,
  Camera,
  Download
} from 'lucide-react';

interface MediaRecorderProps {
  onSendMedia: (file: File, type: 'audio' | 'video' | 'voice') => void;
  onClose: () => void;
  type: 'audio' | 'video' | 'voice';
}

export const MediaRecorder: React.FC<MediaRecorderProps> = ({ onSendMedia, onClose, type }) => {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const constraints = type === 'video' 
        ? { video: true, audio: true }
        : { audio: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (type === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: type === 'video' ? 'video/webm' : 'audio/webm'
        });
        setRecordedBlob(blob);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // بدء العداد
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      showToast(t('بدأ التسجيل', 'Recording started'), 'success');
    } catch (error) {
      console.error('خطأ في بدء التسجيل:', error);
      showToast(t('فشل في بدء التسجيل', 'Failed to start recording'), 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (type === 'video' && videoRef.current) {
        videoRef.current.srcObject = null;
      }

      showToast(t('تم إيقاف التسجيل', 'Recording stopped'), 'success');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        // استئناف العداد
        timerRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        // إيقاف العداد
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }
  };

  const playRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      
      if (type === 'video' && videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.play();
        setIsPlaying(true);
        
        videoRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
        };
      } else if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
        
        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
        };
      }
    }
  };

  const stopPlaying = () => {
    if (type === 'video' && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    } else if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const deleteRecording = () => {
    setRecordedBlob(null);
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const sendRecording = () => {
    if (recordedBlob) {
      const file = new File([recordedBlob], `recording-${Date.now()}.webm`, {
        type: recordedBlob.type
      });
      onSendMedia(file, type);
      onClose();
    }
  };

  const downloadRecording = () => {
    if (recordedBlob) {
      const url = URL.createObjectURL(recordedBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${Date.now()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTitle = () => {
    switch (type) {
      case 'video': return t('تسجيل فيديو', 'Video Recording');
      case 'audio': return t('تسجيل صوتي', 'Audio Recording');
      case 'voice': return t('رسالة صوتية', 'Voice Message');
      default: return t('تسجيل', 'Recording');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        {/* رأس النافذة */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-brand-primary to-brand-yellow-300 text-brand-secondary rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{getTitle()}</h2>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-brand-secondary hover:bg-brand-yellow-200">
              ×
            </Button>
          </div>
        </div>

        {/* محتوى النافذة */}
        <div className="p-6 space-y-6">
          {/* منطقة العرض */}
          <div className="bg-gray-100 rounded-xl p-4 min-h-[200px] flex items-center justify-center">
            {type === 'video' ? (
              <video
                ref={videoRef}
                className="w-full h-48 bg-black rounded-lg object-cover"
                muted={isRecording}
                controls={recordedBlob && !isRecording}
              />
            ) : (
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isRecording ? 'bg-red-100 animate-pulse' : 'bg-brand-yellow-100'
                }`}>
                  <Mic className={`w-10 h-10 ${isRecording ? 'text-red-600' : 'text-brand-secondary'}`} />
                </div>
                <p className="text-gray-600">
                  {isRecording 
                    ? t('جاري التسجيل...', 'Recording...') 
                    : recordedBlob 
                      ? t('تم التسجيل', 'Recording completed')
                      : t('اضغط لبدء التسجيل', 'Press to start recording')
                  }
                </p>
              </div>
            )}
            <audio ref={audioRef} className="hidden" />
          </div>

          {/* عداد الوقت */}
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-secondary">
              {formatTime(recordingTime)}
            </div>
            {isRecording && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-red-600 font-medium">
                  {isPaused ? t('متوقف مؤقتاً', 'Paused') : t('جاري التسجيل', 'Recording')}
                </span>
              </div>
            )}
          </div>

          {/* أزرار التحكم */}
          <div className="flex justify-center gap-3">
            {!isRecording && !recordedBlob && (
              <Button
                onClick={startRecording}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full"
              >
                {type === 'video' ? <Video className="w-5 h-5 me-2" /> : <Mic className="w-5 h-5 me-2" />}
                {t('بدء التسجيل', 'Start Recording')}
              </Button>
            )}

            {isRecording && (
              <>
                <Button
                  onClick={pauseRecording}
                  variant="ghost"
                  className="px-4 py-3 rounded-full border-2 border-gray-300"
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </Button>
                <Button
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-full"
                >
                  <Square className="w-5 h-5" />
                </Button>
              </>
            )}

            {recordedBlob && !isRecording && (
              <>
                <Button
                  onClick={isPlaying ? stopPlaying : playRecording}
                  variant="ghost"
                  className="px-4 py-3 rounded-full border-2 border-brand-primary"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button
                  onClick={deleteRecording}
                  variant="ghost"
                  className="px-4 py-3 rounded-full border-2 border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
                <Button
                  onClick={downloadRecording}
                  variant="ghost"
                  className="px-4 py-3 rounded-full border-2 border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  <Download className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>

          {/* أزرار الإجراءات */}
          {recordedBlob && !isRecording && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={sendRecording}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Send className="w-4 h-4 me-2" />
                {t('إرسال', 'Send')}
              </Button>
              <Button
                onClick={() => {
                  deleteRecording();
                  startRecording();
                }}
                variant="ghost"
                className="flex-1"
              >
                {t('إعادة التسجيل', 'Re-record')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};