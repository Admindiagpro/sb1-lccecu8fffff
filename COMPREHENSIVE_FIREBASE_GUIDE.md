# 🚗 الدليل الشامل لنقل نظام إدارة مركز تشخيص السيارات إلى Firebase

## 🎯 وصف المشروع الكامل

### تحليل مفصل للنظام الحالي

#### 🏗️ **البنية التقنية الأساسية**

**Frontend Architecture:**
- **React 18.3.1** - مكتبة JavaScript حديثة مع Concurrent Features
- **TypeScript 5.5.3** - نظام أنواع قوي مع strict mode
- **Vite 5.4.2** - أداة بناء سريعة مع Hot Module Replacement (HMR)
- **ES Modules** - نظام وحدات حديث للأداء الأمثل

**State Management:**
- **React Context API** - إدارة الحالة العامة للتطبيق
- **useReducer Hook** - إدارة الحالة المعقدة (AuthContext)
- **useState Hook** - إدارة الحالة المحلية للمكونات
- **Custom Hooks** - منطق قابل لإعادة الاستخدام (useLanguage, useToast)

**Styling & UI Framework:**
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **PostCSS 8.4.35** - معالج CSS مع Autoprefixer
- **Custom CSS Variables** - نظام ألوان متقدم مع Brand Colors
- **Responsive Design** - تصميم متجاوب لجميع الشاشات
- **RTL Support** - دعم كامل للغة العربية واتجاه RTL

**Icon System:**
- **Lucide React 0.344.0** - مكتبة أيقونات SVG محسنة
- **Tree Shaking** - تحميل الأيقونات المستخدمة فقط
- **Consistent Design** - نظام أيقونات موحد

**Development Tools:**
- **ESLint 9.9.1** - فحص جودة الكود مع قواعد React
- **TypeScript ESLint** - قواعد خاصة بـ TypeScript
- **React Hooks ESLint** - قواعد خاصة بـ React Hooks
- **Prettier Integration** - تنسيق الكود التلقائي

#### 🔐 **نظام المصادقة والأمان الحالي**

**Authentication Service (src/services/auth.ts):**
```typescript
export class AuthService {
  private static instance: AuthService;
  
  // Singleton Pattern للتأكد من وجود نسخة واحدة
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // نظام تسجيل الدخول مع التحقق
  async login(credentials: LoginCredentials): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // محاكاة تأخير الشبكة
    
    const user = USERS_DB.find(
      u => u.email.toLowerCase() === credentials.email.toLowerCase() && 
           u.password === credentials.password
    );

    if (!user) {
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    if (!user.isActive) {
      throw new Error('الحساب غير مفعل. يرجى التواصل مع الإدارة');
    }

    // تحديث آخر تسجيل دخول
    user.lastLogin = new Date();
    
    // حفظ في localStorage مع Token
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('auth_token', this.generateToken(user.id));

    return userWithoutPassword;
  }

  // نظام الصلاحيات المتقدم
  getUserPermissions(user: User): string[] {
    const permissions: string[] = [];

    switch (user.role) {
      case 'admin':
        permissions.push(
          'manage_users', 'manage_tasks', 'view_tasks', 'create_tasks',
          'update_tasks', 'delete_tasks', 'view_reports', 'manage_settings',
          'access_ai_assistant', 'manage_employees', 'view_analytics'
        );
        break;
      case 'manager':
        permissions.push(
          'manage_tasks', 'view_tasks', 'create_tasks', 'update_tasks',
          'delete_tasks', 'view_reports', 'access_ai_assistant',
          'manage_employees', 'view_analytics'
        );
        break;
      case 'technician':
        permissions.push('view_tasks', 'update_tasks', 'access_ai_assistant');
        break;
    }
    return permissions;
  }
}
```

**Context-based State Management:**
```typescript
// AuthContext مع useReducer للحالة المعقدة
const AuthContext = createContext<AuthContextType | undefined>(undefined);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
    // المزيد من الحالات...
  }
}
```

#### 🤖 **نظام الذكاء الاصطناعي المتقدم**

**OpenAI Integration (src/services/openai.ts):**
```typescript
export class OpenAIService {
  private static instance: OpenAIService;
  
  // تشخيص ذكي متقدم للأعطال
  async diagnoseProblem(request: DiagnosticRequest): Promise<string> {
    const prompt = `
أنت خبير تشخيص سيارات محترف. قم بتحليل المشكلة التالية:

معلومات السيارة:
- الموديل: ${request.carModel}
- السنة: ${request.year}
- المسافة: ${request.mileage || 'غير محدد'}

الأعراض: ${request.symptoms}
أكواد الأعطال: ${request.dtcCodes || 'لا توجد'}

قدم تشخيصاً شاملاً مع:
1. التشخيص المحتمل
2. الأسباب الأكثر احتمالاً
3. خطوات الفحص المطلوبة
4. الحلول مرتبة حسب الأولوية
5. التكلفة التقديرية
6. نصائح وقائية
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'أنت خبير تشخيص سيارات محترف متخصص في جميع أنواع السيارات.'
        },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.3
    });

    return response.choices[0]?.message?.content || 'عذراً، لم أتمكن من تحليل المشكلة.';
  }

  // شرح أكواد DTC المتقدم
  async explainDTCCode(code: string): Promise<string> {
    // منطق شرح أكواد الأعطال مع تفاصيل شاملة
  }

  // معلومات قطع الغيار الذكية
  async getPartInfo(partName: string, carModel: string): Promise<string> {
    // منطق الحصول على معلومات قطع الغيار
  }

  // جداول صيانة مخصصة
  async getMaintenanceSchedule(carModel: string, year: string, mileage: string): Promise<string> {
    // منطق إنشاء جداول الصيانة المخصصة
  }
}
```

#### 💬 **نظام الدردشة المتطور**

**Chat System Architecture:**
```typescript
// نظام دردشة شامل مع دعم الوسائط المتعددة
export const ChatSystem: React.FC<ChatSystemProps> = ({ isOpen, onClose }) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // دعم أنواع مختلفة من الرسائل
  const sendMessage = () => {
    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      receiverId: selectedChat?.replace('direct-', '') || selectedChat,
      content: newMessage,
      timestamp: new Date(),
      isRead: false,
      type: 'text',
      category: 'general',
      priority: 'normal',
      replyTo: replyToMessage?.id
    };
    
    setMessages(prev => [...prev, message]);
    // محاكاة رد تلقائي للتفاعل
  };

  // دعم الملفات والوسائط
  const sendMediaFile = (file: File, type: 'audio' | 'video' | 'voice' | 'image' | 'file') => {
    const fileUrl = URL.createObjectURL(file);
    const message: Message = {
      // تفاصيل الرسالة مع الملف
      type: type,
      fileUrl: fileUrl,
      fileName: file.name,
      fileSize: file.size,
      duration: type === 'audio' || type === 'voice' || type === 'video' ? 30 : undefined
    };
  };
};
```

**Media Recording System:**
```typescript
// تسجيل الوسائط المتقدم
export const MediaRecorder: React.FC<MediaRecorderProps> = ({ onSendMedia, type }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const startRecording = async () => {
    const constraints = type === 'video' 
      ? { video: true, audio: true }
      : { audio: true };

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const mediaRecorder = new MediaRecorder(stream);
    
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
    };
  };
};
```

#### 📋 **نظام إدارة المهام المتقدم**

**Task Management System:**
```typescript
// إدارة المهام مع الذكاء الاصطناعي
export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState(sampleTasks);
  const [aiHelpTask, setAiHelpTask] = useState<Task | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  
  // الحصول على مساعدة ذكية للمهمة
  const getAIHelp = async (task: Task) => {
    const openAIService = OpenAIService.getInstance();
    
    const diagnosticRequest = {
      carModel: task.customerInfo?.carModel || 'غير محدد',
      year: task.customerInfo?.carYear || 'غير محدد',
      symptoms: task.description,
      dtcCodes: task.dtcCodes?.join(', ') || '',
      mileage: 'غير محدد'
    };

    const response = await openAIService.diagnoseProblem(diagnosticRequest);
    setAiResponse(response);
  };

  // إنشاء مهمة جديدة مع اقتراحات ذكية
  const createTaskWithAI = async (formData: TaskFormData) => {
    const prompt = `
أنا أعمل في مركز تشخيص السيارات وأريد إنشاء مهمة تشخيص:

معلومات السيارة:
- الموديل: ${formData.carModel}
- السنة: ${formData.carYear}
- العميل: ${formData.customerName}
- أكواد الأعطال: ${formData.dtcCodes}

اقترح:
1. عنوان مناسب للمهمة
2. وصف تفصيلي
3. تحديد الأولوية
4. خطوات التشخيص
5. الأدوات المطلوبة
6. تقدير الوقت
    `;
    
    const aiSuggestion = await openAIService.chat([
      { role: 'user', content: prompt }
    ]);
  };
};
```

#### 👥 **نظام إدارة الموظفين المتطور**

**Employee Management System:**
```typescript
// إدارة شاملة للموظفين مع الصلاحيات
export const EmployeeManager: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const authService = AuthService.getInstance();
  
  // التحقق من الصلاحيات قبل العرض
  const canManageEmployees = user && authService.hasPermission(user, 'manage_employees');
  
  if (!canManageEmployees) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-brand-secondary mb-2">
            {t('ليس لديك صلاحية للوصول', 'Access Denied')}
          </h3>
        </div>
      </div>
    );
  }

  // إضافة موظف جديد مع التحقق
  const handleCreateEmployee = async (userData: CreateEmployeeData) => {
    try {
      await authService.addUser({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        isActive: userData.isActive,
        password: userData.password
      });
      
      loadEmployees();
      showToast('تم إنشاء الموظف بنجاح', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'فشل في إنشاء الموظف';
      showToast(errorMessage, 'error');
    }
  };

  // إحصائيات الموظفين
  const getEmployeeStats = () => {
    const total = employees.length;
    const active = employees.filter(emp => emp.isActive).length;
    const admins = employees.filter(emp => emp.role === 'admin').length;
    const managers = employees.filter(emp => emp.role === 'manager').length;
    const technicians = employees.filter(emp => emp.role === 'technician').length;
    
    return { total, active, admins, managers, technicians };
  };
};
```

#### 📊 **نظام التقارير والإحصائيات**

**Advanced Reporting System:**
```typescript
// نظام تقارير متقدم مع رسوم بيانية
export const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  
  // بيانات التقارير المحسوبة ديناميكياً
  const reportData = {
    overview: {
      totalTasks: 156,
      completedTasks: 142,
      pendingTasks: 14,
      totalRevenue: 45600,
      activeEmployees: 8,
      customerSatisfaction: 94
    },
    performance: {
      weekly: [
        { day: 'السبت', tasks: 18, revenue: 5400 },
        { day: 'الأحد', tasks: 22, revenue: 6600 },
        // المزيد من البيانات...
      ]
    },
    employees: [
      { name: 'أبو مانع', tasks: 45, completion: 98, revenue: 13500 },
      { name: 'شهاب', tasks: 52, completion: 96, revenue: 15600 },
      // المزيد من البيانات...
    ]
  };

  // رسم بياني تفاعلي للأداء
  const renderPerformanceChart = () => (
    <div className="h-64 flex items-end justify-between gap-2">
      {reportData.performance.weekly.map((day, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className="w-full bg-gradient-to-t from-brand-primary to-brand-yellow-300 rounded-t-md transition-all duration-500"
            style={{ height: `${(day.tasks / 30) * 100}%` }}
          />
          <span className="text-xs text-brand-black-500 mt-2">{day.day}</span>
        </div>
      ))}
    </div>
  );
};
```

#### 🔍 **نظام البحث الذكي**

**Smart Search System:**
```typescript
// بحث ذكي مع تصنيفات متعددة
export const SearchSystem: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const searchCategories = [
    { id: 'all', label: t('الكل', 'All'), icon: Search },
    { id: 'parts', label: t('قطع الغيار', 'Parts'), icon: Wrench },
    { id: 'dtc', label: t('أكواد الأعطال', 'DTC Codes'), icon: AlertTriangle },
    { id: 'manuals', label: t('الدلائل', 'Manuals'), icon: Book },
    { id: 'tips', label: t('نصائح', 'Tips'), icon: Lightbulb }
  ];

  // نتائج البحث مع روابط خارجية
  const mockSearchResults = [
    {
      title: 'حساس تدفق الهواء - Mass Air Flow Sensor',
      description: 'موقع حساس تدفق الهواء في محرك تويوتا كامري 2018',
      category: 'parts',
      url: 'https://www.toyota.com/owners/parts-service',
      type: 'external'
    },
    {
      title: 'DTC P0171 - System Too Lean Bank 1',
      description: 'شرح مفصل لكود العطل P0171 وطرق الإصلاح',
      category: 'dtc',
      url: 'https://www.obd-codes.com/p0171',
      type: 'external'
    }
  ];
};
```

#### 🎨 **نظام التصميم المتقدم**

**Design System Components:**
```typescript
// مكونات UI قابلة لإعادة الاستخدام
export const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', disabled = false
}) => {
  const variantClasses = {
    primary: 'bg-brand-primary text-brand-secondary hover:bg-brand-yellow-400 focus:ring-brand-yellow-300 font-semibold shadow-md hover:shadow-lg',
    secondary: 'bg-brand-secondary text-brand-primary hover:bg-brand-black-800 focus:ring-brand-black-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    // المزيد من المتغيرات...
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {children}
    </button>
  );
};

// نظام الألوان المتقدم
const brandColors = {
  primary: '#FFD100',    // الأصفر الذهبي
  secondary: '#000000',  // الأسود
  yellow: {
    50: '#FFFEF7',
    100: '#FFFAEB',
    200: '#FFF3C4',
    300: '#FFEC9C',
    400: '#FFE066',
    500: '#FFD100',
    600: '#E6BC00',
    700: '#CC9900',
    800: '#B38600',
    900: '#996600'
  }
};
```

#### 🌐 **نظام اللغات المتعدد**

**Multi-language Support:**
```typescript
// دعم كامل للغة العربية والإنجليزية
export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages.find(lang => lang.code === (localStorage.getItem('language') || 'ar')) || languages[0]
  );

  useEffect(() => {
    localStorage.setItem('language', currentLanguage.code);
    document.documentElement.dir = currentLanguage.direction;
    document.documentElement.lang = currentLanguage.code;
  }, [currentLanguage]);

  const t = (ar: string, en: string) => {
    return currentLanguage.code === 'ar' ? ar : en;
  };

  return {
    currentLanguage,
    toggleLanguage,
    t,
    isRTL: currentLanguage.direction === 'rtl'
  };
};
```

#### 🔔 **نظام الإشعارات المتقدم**

**Toast Notification System:**
```typescript
// نظام إشعارات متطور مع أنواع متعددة
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // إزالة تلقائية بعد 5 ثوان
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};
```

### 🎨 تفاصيل النظام الحالي

#### الواجهة الأمامية (Frontend)
- **إطار العمل**: React 18.3.1 مع TypeScript 5.5.3
- **أداة البناء**: Vite 5.4.2 للتطوير والبناء السريع
- **التصميم**: Tailwind CSS 3.4.1 مع نظام ألوان مخصص
- **الأيقونات**: Lucide React 0.344.0 مع أكثر من 1000 أيقونة
- **الخطوط**: Noto Sans Arabic للعربية، Inter للإنجليزية
- **الاتجاه**: دعم كامل لـ RTL (من اليمين لليسار)

#### نظام إدارة الحالة
- **React Context API**: لإدارة الحالة العامة
- **useReducer**: لإدارة الحالات المعقدة
- **Custom Hooks**: خطافات مخصصة للمنطق المشترك
- **Local Storage**: تخزين مؤقت للإعدادات والجلسات

#### نظام المصادقة الحالي
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'technician';
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}
```

### 🛠️ التقنيات المستخدمة بالتفصيل

#### Frontend Technologies
```json
{
  "dependencies": {
    "react": "^18.3.1",           // مكتبة React الأساسية
    "react-dom": "^18.3.1",      // DOM renderer لـ React
    "typescript": "^5.5.3",      // لغة TypeScript
    "tailwindcss": "^3.4.1",     // إطار عمل CSS
    "lucide-react": "^0.344.0",  // مكتبة الأيقونات
    "openai": "^5.10.1"          // SDK للذكاء الاصطناعي
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",  // إضافة React لـ Vite
    "autoprefixer": "^10.4.18",        // بادئات CSS تلقائية
    "postcss": "^8.4.35",              // معالج CSS
    "eslint": "^9.9.1",                // فحص جودة الكود
    "typescript-eslint": "^8.3.0"      // قواعد TypeScript
  }
}
```

#### أدوات التطوير والبناء
- **Vite**: أداة بناء سريعة مع Hot Module Replacement
- **ESLint**: فحص جودة الكود مع قواعد TypeScript
- **PostCSS**: معالجة CSS مع Autoprefixer
- **TypeScript**: نظام أنواع قوي للـ JavaScript

#### نظام التصميم
```css
/* نظام الألوان المخصص */
:root {
  --brand-primary: #FFD100;      /* الأصفر الذهبي */
  --brand-secondary: #000000;    /* الأسود */
  --background: #FFFFFF;         /* الخلفية البيضاء */
}

/* نظام الخطوط */
.font-arabic {
  font-family: 'Noto Sans Arabic', sans-serif;
}

/* نظام التدرجات */
.gradient-brand {
  background: linear-gradient(135deg, #FFD100 0%, #FFF3C4 100%);
}
```

### 📁 هيكل المشروع بالتفصيل

```
car-diagnostic-system/
├── public/                          # الملفات العامة
│   ├── index.html                   # صفحة HTML الرئيسية
│   └── vite.svg                     # أيقونة Vite
├── src/                             # مجلد الكود المصدري
│   ├── components/                  # مكونات React
│   │   ├── AI/                      # مكونات الذكاء الاصطناعي
│   │   │   └── AIAssistant.tsx      # المساعد الذكي الرئيسي
│   │   ├── Auth/                    # نظام المصادقة
│   │   │   ├── LoginForm.tsx        # نموذج تسجيل الدخول
│   │   │   ├── UserProfile.tsx      # الملف الشخصي
│   │   │   └── ProtectedRoute.tsx   # حماية الصفحات
│   │   ├── Chat/                    # نظام الدردشة
│   │   │   ├── ChatSystem.tsx       # النظام الرئيسي
│   │   │   ├── MessageBubble.tsx    # فقاعات الرسائل
│   │   │   ├── MediaRecorder.tsx    # تسجيل الوسائط
│   │   │   ├── FileUploader.tsx     # رفع الملفات
│   │   │   └── ChatRoomManager.tsx  # إدارة الغرف
│   │   ├── Dashboard/               # لوحة التحكم
│   │   │   └── Dashboard.tsx        # الصفحة الرئيسية
│   │   ├── Employees/               # إدارة الموظفين
│   │   │   └── EmployeeManager.tsx  # إدارة شاملة للموظفين
│   │   ├── Layout/                  # مكونات التخطيط
│   │   │   ├── Header.tsx           # رأس الصفحة
│   │   │   └── Sidebar.tsx          # الشريط الجانبي
│   │   ├── Reports/                 # التقارير والإحصائيات
│   │   │   └── ReportsPage.tsx      # صفحة التقارير
│   │   ├── Search/                  # البحث الذكي
│   │   │   └── SearchSystem.tsx     # نظام البحث
│   │   ├── Settings/                # الإعدادات
│   │   │   └── SettingsPage.tsx     # صفحة الإعدادات
│   │   ├── Tasks/                   # إدارة المهام
│   │   │   └── TaskManager.tsx      # مدير المهام
│   │   └── ui/                      # مكونات UI أساسية
│   │       ├── Button.tsx           # أزرار مخصصة
│   │       ├── Card.tsx             # بطاقات
│   │       ├── Badge.tsx            # شارات
│   │       ├── Modal.tsx            # نوافذ منبثقة
│   │       ├── Toast.tsx            # إشعارات
│   │       └── LoadingSpinner.tsx   # مؤشر التحميل
│   ├── contexts/                    # React Contexts
│   │   └── AuthContext.tsx          # سياق المصادقة
│   ├── hooks/                       # Custom Hooks
│   │   └── useLanguage.ts           # خطاف اللغة
│   ├── services/                    # خدمات API
│   │   ├── auth.ts                  # خدمة المصادقة
│   │   └── openai.ts                # خدمة OpenAI
│   ├── types/                       # تعريفات TypeScript
│   │   ├── index.ts                 # الأنواع الرئيسية
│   │   └── auth.ts                  # أنواع المصادقة
│   ├── data/                        # البيانات الوهمية
│   │   └── mockData.ts              # بيانات للاختبار
│   ├── styles/                      # ملفات التصميم
│   │   └── index.css                # CSS الرئيسي
│   ├── main.tsx                     # نقطة دخول التطبيق
│   └── vite-env.d.ts               # تعريفات Vite
├── .github/workflows/               # GitHub Actions
│   └── webpack.yml                  # سير عمل CI/CD
├── package.json                     # تبعيات المشروع
├── tsconfig.json                    # إعدادات TypeScript
├── tailwind.config.js               # إعدادات Tailwind
├── vite.config.ts                   # إعدادات Vite
├── vercel.json                      # إعدادات Vercel
└── README.md                        # دليل المشروع
```

### 🚀 جميع المميزات والوظائف مع أمثلة الكود

#### 🤖 **1. المساعد الذكي المتطور**

**الوظائف الرئيسية:**
- **تشخيص ذكي للأعطال** مع تحليل شامل
- **شرح أكواد DTC** مع الأسباب والحلول
- **معلومات قطع الغيار** مع المواقع والأسعار
- **جداول صيانة مخصصة** حسب نوع السيارة
- **محادثة تقنية ذكية** مع السياق

**مثال كود - واجهة المساعد الذكي:**
```typescript
export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AssistantMode>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  
  // أوضاع المساعد المختلفة
  const modes = [
    { id: 'chat', label: t('دردشة', 'Chat'), icon: MessageSquare },
    { id: 'diagnostic', label: t('تشخيص', 'Diagnostic'), icon: Wrench },
    { id: 'dtc', label: t('أكواد الأعطال', 'DTC Codes'), icon: AlertTriangle },
    { id: 'parts', label: t('قطع الغيار', 'Parts'), icon: Settings },
    { id: 'maintenance', label: t('الصيانة', 'Maintenance'), icon: Calendar }
  ];

  // إرسال رسالة للمساعد الذكي
  const sendMessage = async () => {
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
  };

  // تشخيص ذكي متقدم
  const runDiagnostic = async () => {
    const response = await openAIService.diagnoseProblem(diagnosticForm);
    const diagnosticMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `🔧 **تشخيص ذكي للسيارة:**\n\n${response}`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, diagnosticMessage]);
  };
};
```

#### 💬 **2. نظام الدردشة المتطور**

**الوظائف الرئيسية:**
- **دردشات مباشرة** بين الموظفين
- **غرف دردشة جماعية** للفرق
- **قنوات إعلانات** للإدارة
- **دعم الوسائط المتعددة** (صور، فيديو، صوت، ملفات)
- **تسجيل رسائل صوتية** مباشرة
- **إشعارات فورية** للرسائل الجديدة
- **بحث في المحادثات** والرسائل
- **إجراءات متقدمة** (رد، إعادة توجيه، نجمة، حذف)

**مثال كود - نظام الدردشة:**
```typescript
export const ChatSystem: React.FC<ChatSystemProps> = ({ isOpen, onClose }) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  // تهيئة غرف الدردشة
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
        isActive: true
      }
    ];
    setChatRooms(rooms);
  };

  // إرسال رسالة مع دعم الوسائط
  const sendMessage = () => {
    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      receiverId: selectedChat?.startsWith('direct-') ? selectedChat.replace('direct-', '') : selectedChat,
      content: newMessage,
      timestamp: new Date(),
      isRead: false,
      type: 'text',
      category: 'general',
      priority: 'normal',
      replyTo: replyToMessage?.id
    };
    
    setMessages(prev => [...prev, message]);
    
    // محاكاة رد تلقائي
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
    }, 2000);
  };

  // إرسال ملفات وسائط
  const sendMediaFile = (file: File, type: 'audio' | 'video' | 'voice' | 'image' | 'file') => {
    const fileUrl = URL.createObjectURL(file);
    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      receiverId: selectedChat?.startsWith('direct-') ? selectedChat.replace('direct-', '') : selectedChat,
      content: '',
      timestamp: new Date(),
      isRead: false,
      type: type,
      fileUrl: fileUrl,
      fileName: file.name,
      fileSize: file.size,
      duration: type === 'audio' || type === 'voice' || type === 'video' ? 30 : undefined
    };
    
    setMessages(prev => [...prev, message]);
  };
};
```

#### 📋 **3. إدارة المهام المتقدمة**

**الوظائف الرئيسية:**
- **إنشاء مهام مفصلة** مع معلومات العملاء
- **تعيين المهام للموظفين** حسب الخبرة
- **تتبع حالة المهام** (معلقة، جارية، مكتملة، ملغاة)
- **نظام أولوية متقدم** (منخفضة، متوسطة، مرتفعة، عاجلة)
- **دمج أكواد DTC** مع الحلول المقترحة
- **مساعدة ذكية لكل مهمة** من ChatGPT
- **رفع صور للمهام** والأعطال
- **معلومات العملاء الشاملة**

**مثال كود - إدارة المهام:**
```typescript
export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState(sampleTasks);
  const [aiHelpTask, setAiHelpTask] = useState<Task | null>(null);
  
  // الحصول على مساعدة ذكية للمهمة
  const getAIHelp = async (task: Task) => {
    setAiHelpTask(task);
    setIsLoadingAI(true);
    
    const diagnosticRequest = {
      carModel: task.customerInfo?.carModel || 'غير محدد',
      year: task.customerInfo?.carYear || 'غير محدد',
      symptoms: task.description,
      dtcCodes: task.dtcCodes?.join(', ') || '',
      mileage: 'غير محدد'
    };

    const response = await openAIService.diagnoseProblem(diagnosticRequest);
    setAiResponse(response);
  };

  // إنشاء مهمة جديدة مع اقتراحات ذكية
  const CreateTaskModal = () => {
    const [formData, setFormData] = useState({
      title: '', description: '', assignedTo: '3',
      priority: 'medium' as Task['priority'],
      customerName: '', customerPhone: '',
      carModel: '', carYear: '', licensePlate: '', dtcCodes: ''
    });

    // الحصول على اقتراحات ذكية للمهمة
    const getAIHelp = async () => {
      const prompt = `
أنا أعمل في مركز تشخيص السيارات وأريد إنشاء مهمة تشخيص جديدة.

معلومات السيارة:
- الموديل: ${formData.carModel}
- السنة: ${formData.carYear}
- العميل: ${formData.customerName}
- أكواد الأعطال: ${formData.dtcCodes}

يرجى مساعدتي في:
1. اقتراح عنوان مناسب للمهمة
2. كتابة وصف تفصيلي
3. تحديد الأولوية المناسبة
4. اقتراح خطوات التشخيص
5. تحديد الأدوات المطلوبة
6. تقدير الوقت اللازم
      `;
      
      const response = await openAIService.chat([{ role: 'user', content: prompt }]);
      setAiSuggestion(response);
    };
  };
};
```

#### 👥 **4. إدارة الموظفين الشاملة**

**الوظائف الرئيسية:**
- **إضافة موظفين جدد** مع جميع التفاصيل
- **نظام أدوار متقدم** (Admin, Manager, Technician)
- **إدارة الصلاحيات** لكل دور
- **تتبع أداء الموظفين** مع إحصائيات
- **تفعيل وإلغاء تفعيل الحسابات**
- **بحث وتصفية متقدم**
- **ملفات شخصية مفصلة**
- **إحصائيات الأداء** لكل موظف

**مثال كود - إدارة الموظفين:**
```typescript
export const EmployeeManager: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const authService = AuthService.getInstance();
  
  // التحقق من الصلاحيات
  const canManageEmployees = user && authService.hasPermission(user, 'manage_employees');
  
  // إحصائيات الموظفين
  const getEmployeeStats = () => {
    const total = employees.length;
    const active = employees.filter(emp => emp.isActive).length;
    const admins = employees.filter(emp => emp.role === 'admin').length;
    const managers = employees.filter(emp => emp.role === 'manager').length;
    const technicians = employees.filter(emp => emp.role === 'technician').length;
    
    return { total, active, admins, managers, technicians };
  };

  // إضافة موظف جديد
  const CreateEmployeeModal = () => {
    const handleSubmit = async (formData: CreateEmployeeData) => {
      await authService.addUser({
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        isActive: formData.isActive,
        password: formData.password
      });
      
      loadEmployees();
      showToast('تم إنشاء الموظف بنجاح', 'success');
    };
  };

  // تفاصيل الموظف مع الأداء
  const EmployeeDetailsModal = () => {
    const permissions = authService.getUserPermissions(employee);
    
    return (
      <div className="space-y-6">
        {/* معلومات أساسية */}
        <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-brand-yellow-50 to-brand-yellow-100 rounded-xl">
          <img src={employee.avatar} className="w-20 h-20 rounded-full" />
          <div>
            <h3 className="text-2xl font-bold">{employee.name}</h3>
            <Badge variant={getRoleBadgeVariant(employee.role)}>
              {getRoleLabel(employee.role)}
            </Badge>
          </div>
        </div>
        
        {/* إحصائيات الأداء */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-700">24</div>
            <div className="text-sm text-green-600">المهام المكتملة</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">5</div>
            <div className="text-sm text-blue-600">المهام الجارية</div>
          </div>
          <div className="text-center p-4 bg-brand-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-brand-secondary">92%</div>
            <div className="text-sm text-brand-black-600">معدل الإنجاز</div>
          </div>
        </div>
        
        {/* الصلاحيات */}
        <div>
          <h4 className="text-lg font-bold mb-4">الصلاحيات</h4>
          <div className="flex flex-wrap gap-2">
            {permissions.map((permission, index) => (
              <Badge key={index} variant="gray" size="sm">
                {permission.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  };
};
```

#### 📊 **5. نظام التقارير والإحصائيات التفاعلي**

**الوظائف الرئيسية:**
- **تقارير شاملة** (نظرة عامة، مهام، أداء، موظفين، مالي)
- **رسوم بيانية تفاعلية** مع Tailwind CSS
- **تصفية حسب الفترة الزمنية** (أسبوع، شهر، ربع، سنة)
- **إحصائيات مفصلة** لكل قسم
- **تصدير التقارير** بصيغ مختلفة
- **مقارنات زمنية** مع الفترات السابقة
- **مؤشرات الأداء الرئيسية** (KPIs)

**مثال كود - نظام التقارير:**
```typescript
export const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');
  
  // بيانات التقارير المحسوبة
  const reportData = {
    overview: {
      totalTasks: 156,
      completedTasks: 142,
      pendingTasks: 14,
      totalRevenue: 45600,
      activeEmployees: 8,
      customerSatisfaction: 94
    },
    performance: {
      weekly: [
        { day: 'السبت', tasks: 18, revenue: 5400 },
        { day: 'الأحد', tasks: 22, revenue: 6600 },
        { day: 'الاثنين', tasks: 25, revenue: 7500 }
      ]
    }
  };

  // رسم بياني تفاعلي للأداء الأسبوعي
  const renderPerformanceChart = () => (
    <div className="h-64 flex items-end justify-between gap-2">
      {reportData.performance.weekly.map((day, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div 
            className="w-full bg-gradient-to-t from-brand-primary to-brand-yellow-300 rounded-t-md transition-all duration-500 hover:from-brand-yellow-400"
            style={{ height: `${(day.tasks / 30) * 100}%` }}
          />
          <span className="text-xs text-brand-black-500 mt-2">{day.day}</span>
          <span className="text-xs text-gray-500">{day.tasks}</span>
        </div>
      ))}
    </div>
  );

  // تقرير أداء الموظفين
  const renderEmployeeReport = () => (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-start py-3 px-4">الموظف</th>
          <th className="text-start py-3 px-4">المهام</th>
          <th className="text-start py-3 px-4">معدل الإنجاز</th>
          <th className="text-start py-3 px-4">الإيرادات</th>
        </tr>
      </thead>
      <tbody>
        {reportData.employees.map((employee, index) => (
          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
            <td className="py-4 px-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-yellow-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">{employee.name.charAt(0)}</span>
                </div>
                <span className="font-medium">{employee.name}</span>
              </div>
            </td>
            <td className="py-4 px-4">{employee.tasks}</td>
            <td className="py-4 px-4">
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${employee.completion}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{employee.completion}%</span>
              </div>
            </td>
            <td className="py-4 px-4">{employee.revenue.toLocaleString()} ر.س</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

#### ⚙️ **6. نظام الإعدادات المتقدم**

**الوظائف الرئيسية:**
- **إعدادات عامة** (اللغة، المظهر، الحفظ التلقائي)
- **إعدادات الأمان** (المصادقة الثنائية، انتهاء الجلسة)
- **إعدادات الإشعارات** مع تحكم مفصل
- **إعدادات النظام** (النسخ الاحتياطي، مستوى السجلات)
- **تصدير وإعادة تعيين الإعدادات**
- **مراقبة حالة النظام**

**مثال كود - نظام الإعدادات:**
```typescript
export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    language: 'ar', theme: 'light', autoSave: true,
    notifications: true, soundEnabled: true,
    twoFactorAuth: false, sessionTimeout: 30,
    autoBackup: true, backupFrequency: 'daily'
  });

  // حفظ الإعدادات
  const handleSaveSettings = () => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
    showToast('تم حفظ الإعدادات بنجاح', 'success');
  };

  // تصدير الإعدادات
  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settings.json';
    link.click();
  };

  // إعدادات الأمان
  const renderSecuritySettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-red-600" />
          <div>
            <p className="font-medium">المصادقة الثنائية</p>
            <p className="text-sm text-gray-600">حماية إضافية للحساب</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.twoFactorAuth}
            onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </label>
      </div>
    </div>
  );
};
```

#### 🔍 **7. نظام البحث الذكي**

**الوظائف الرئيسية:**
- **بحث في قطع الغيار** مع المواقع والأسعار
- **شرح أكواد الأعطال** مع الحلول
- **دلائل الصيانة** التقنية
- **نصائح الخبراء** العملية
- **روابط خارجية** للمراجع
- **تصنيف النتائج** حسب النوع
- **اقتراحات سريعة** للبحث

#### 🌐 **8. نظام اللغات المتعدد**

**الوظائف الرئيسية:**
- **دعم كامل للعربية** مع اتجاه RTL
- **دعم الإنجليزية** مع اتجاه LTR
- **تبديل فوري للغة** بدون إعادة تحميل
- **حفظ تفضيل اللغة** في localStorage
- **خطوط مخصصة** لكل لغة
- **تخطيط متجاوب** لكلا الاتجاهين

#### 🎨 **9. نظام التصميم المتقدم**

**الوظائف الرئيسية:**
- **نظام ألوان متقدم** مع Brand Colors
- **مكونات قابلة لإعادة الاستخدام**
- **تصميم متجاوب** لجميع الشاشات
- **انتقالات وحركات سلسة**
- **ظلال وتدرجات احترافية**
- **أيقونات متسقة** من Lucide React
- **تحسينات الأداء** مع CSS Variables

#### 1. 🤖 المساعد الذكي (AI Assistant)
```typescript
// المميزات الحالية
- تشخيص ذكي للأعطال
- شرح أكواد DTC
- معلومات قطع الغيار
- جداول الصيانة المخصصة
- محادثة تفاعلية
- اقتراحات ذكية للمهام

// الوظائف المطلوبة في Firebase
- Cloud Functions للمعالجة
- تخزين تاريخ المحادثات
- تحليل البيانات التلقائي
- إشعارات ذكية
```

#### 2. 👥 إدارة الموظفين
```typescript
// النظام الحالي
interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'technician';
  phone?: string;
  avatar?: string;
  isActive: boolean;
  permissions: string[];
  createdAt: Date;
  lastLogin?: Date;
}

// المطلوب في Firebase
- Firebase Authentication للمصادقة
- Custom Claims للأدوار
- Firestore للبيانات الإضافية
- Real-time status updates
- Advanced permission system
```

#### 3. 📋 إدارة المهام
```typescript
// نموذج المهمة الحالي
interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
  customerInfo?: CustomerInfo;
  dtcCodes?: string[];
  images?: string[];
}

// المطلوب في Firebase
- Real-time task updates
- File attachments in Storage
- Automated notifications
- Task history tracking
- Performance analytics
```

#### 4. 💬 نظام الدردشة المتطور
```typescript
// الميزات الحالية
- دردشة مباشرة بين الموظفين
- غرف جماعية
- دعم الوسائط المتعددة (صور، فيديو، صوت)
- رسائل صوتية
- مشاركة الملفات
- الرد على الرسائل
- إعادة التوجيه
- التفاعلات (إعجاب، نجمة)

// المطلوب في Firebase
- Real-time messaging مع Firestore
- Cloud Storage للوسائط
- Push notifications
- Message encryption
- Typing indicators
- Read receipts
```

#### 5. 📊 التقارير والإحصائيات
```typescript
// التقارير الحالية
- نظرة عامة على الأداء
- إحصائيات المهام
- أداء الموظفين
- التقارير المالية
- الرسوم البيانية التفاعلية

// المطلوب في Firebase
- Real-time analytics
- Advanced querying
- Data aggregation
- Export capabilities
- Scheduled reports
```

#### 6. 🔍 البحث الذكي
```typescript
// الميزات الحالية
- البحث في قطع الغيار
- البحث في أكواد DTC
- البحث في الدلائل التقنية
- اقتراحات ذكية

// المطلوب في Firebase
- Full-text search مع Algolia
- Indexed search في Firestore
- Search analytics
- Personalized results
```

#### 7. ⚙️ الإعدادات المتقدمة
```typescript
// الإعدادات الحالية
- إعدادات اللغة والمظهر
- إعدادات الأمان
- إعدادات الإشعارات
- إعدادات النظام
- النسخ الاحتياطي

// المطلوب في Firebase
- Cloud-based settings
- User preferences sync
- Admin configuration panel
- System monitoring
```

## 🔥 متطلبات Firebase المحددة

### 1. Firebase Authentication المتقدم

#### إعداد المصادقة
```typescript
// firebase/auth.ts
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

#### نظام الأدوار المتقدم
```typescript
// Custom Claims للأدوار
interface UserClaims {
  role: 'admin' | 'manager' | 'technician';
  permissions: string[];
  centerIds: string[];
  isActive: boolean;
}

// Cloud Function لإدارة الأدوار
exports.setUserRole = functions.https.onCall(async (data, context) => {
  // التحقق من صلاحيات المدير
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can set roles');
  }

  await admin.auth().setCustomUserClaims(data.uid, {
    role: data.role,
    permissions: data.permissions,
    centerIds: data.centerIds,
    isActive: data.isActive
  });

  return { success: true };
});
```

### 2. Firestore مع نماذج البيانات الكاملة

#### هيكل قاعدة البيانات
```typescript
// Collections Structure
/users/{userId}
/tasks/{taskId}
/messages/{messageId}
/chatRooms/{roomId}
/customers/{customerId}
/dtcCodes/{codeId}
/reports/{reportId}
/settings/{settingId}
/notifications/{notificationId}
/auditLogs/{logId}
```

#### نماذج البيانات المفصلة
```typescript
// نموذج المستخدم المحسن
interface User {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'technician';
  avatar?: string;
  phone?: string;
  isActive: boolean;
  isOnline: boolean;
  lastSeen: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  preferences: {
    language: 'ar' | 'en';
    theme: 'light' | 'dark';
    notifications: boolean;
    soundEnabled: boolean;
  };
  stats: {
    totalTasks: number;
    completedTasks: number;
    averageRating: number;
    totalRevenue: number;
  };
  permissions: string[];
  centerIds: string[];
}

// نموذج المهمة المحسن
interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  dueDate?: Timestamp;
  completedAt?: Timestamp;
  estimatedDuration: number; // بالدقائق
  actualDuration?: number;
  customerInfo: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    carModel: string;
    carYear: string;
    licensePlate: string;
    vin?: string;
    mileage?: number;
  };
  dtcCodes: string[];
  images: string[];
  documents: string[];
  notes: TaskNote[];
  aiAnalysis?: {
    diagnosis: string;
    recommendations: string[];
    estimatedCost: number;
    confidence: number;
    generatedAt: Timestamp;
  };
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  tags: string[];
  isUrgent: boolean;
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: Timestamp;
}

// نموذج الرسالة المحسن
interface Message {
  id: string;
  senderId: string;
  receiverId?: string;
  roomId?: string;
  content: string;
  timestamp: Timestamp;
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'voice' | 'location' | 'contact';
  isRead: boolean;
  readBy: { [userId: string]: Timestamp };
  editedAt?: Timestamp;
  deletedAt?: Timestamp;
  replyTo?: string;
  forwardedFrom?: string;
  reactions: { [userId: string]: string };
  mentions: string[];
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileMimeType?: string;
  duration?: number; // للملفات الصوتية/المرئية
  thumbnail?: string;
  metadata?: {
    width?: number;
    height?: number;
    location?: { lat: number; lng: number };
    deviceInfo?: string;
  };
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'general' | 'task' | 'urgent' | 'training' | 'announcement';
  isEncrypted: boolean;
  deliveryStatus: 'sent' | 'delivered' | 'read' | 'failed';
}

// نموذج غرفة الدردشة المحسن
interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  type: 'direct' | 'group' | 'announcement' | 'support';
  participants: string[];
  admins: string[];
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: Timestamp;
    type: string;
  };
  isActive: boolean;
  isArchived: boolean;
  avatar?: string;
  settings: {
    allowFileSharing: boolean;
    allowVoiceMessages: boolean;
    allowVideoMessages: boolean;
    maxFileSize: number;
    retentionDays: number;
    isPublic: boolean;
    requireApproval: boolean;
  };
  stats: {
    totalMessages: number;
    totalParticipants: number;
    activeParticipants: number;
    lastActivity: Timestamp;
  };
  tags: string[];
  pinnedMessages: string[];
}

// نموذج العميل
interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  cars: {
    id: string;
    model: string;
    year: string;
    licensePlate: string;
    vin?: string;
    color?: string;
    mileage?: number;
    lastService?: Timestamp;
  }[];
  totalVisits: number;
  totalSpent: number;
  averageRating: number;
  notes: string;
  isVip: boolean;
  preferredTechnician?: string;
  communicationPreference: 'phone' | 'email' | 'sms' | 'whatsapp';
}

// نموذج كود DTC
interface DTCCode {
  code: string;
  description: string;
  descriptionAr: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  possibleCauses: string[];
  possibleCausesAr: string[];
  suggestedSolutions: string[];
  suggestedSolutionsAr: string[];
  affectedSystems: string[];
  commonVehicles: string[];
  estimatedRepairTime: number; // بالساعات
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  };
  relatedCodes: string[];
  frequency: number; // كم مرة ظهر هذا الكود
  lastUpdated: Timestamp;
}
```

### 3. Firebase Storage لإدارة الملفات

#### هيكل التخزين
```
storage/
├── users/
│   ├── {userId}/
│   │   ├── avatar.jpg
│   │   └── documents/
├── tasks/
│   ├── {taskId}/
│   │   ├── images/
│   │   ├── documents/
│   │   └── reports/
├── chat/
│   ├── {roomId}/
│   │   ├── images/
│   │   ├── videos/
│   │   ├── audio/
│   │   └── files/
├── reports/
│   ├── {reportId}/
│   │   ├── pdf/
│   │   └── excel/
└── system/
    ├── backups/
    └── logs/
```

#### خدمة التخزين المتقدمة
```typescript
class AdvancedStorageService {
  // رفع الملفات مع ضغط تلقائي
  async uploadWithCompression(file: File, path: string, options?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  }): Promise<string>

  // رفع متعدد الملفات
  async uploadMultiple(files: File[], basePath: string): Promise<string[]>

  // إنشاء thumbnails تلقائياً
  async generateThumbnail(imagePath: string): Promise<string>

  // تحويل الفيديو لصيغ متعددة
  async convertVideo(videoPath: string, formats: string[]): Promise<string[]>

  // نسخ احتياطي للملفات
  async backupFiles(paths: string[]): Promise<string>

  // حذف آمن مع سلة المحذوفات
  async safeDelete(path: string, retentionDays: number): Promise<void>

  // مراقبة استخدام التخزين
  async getStorageUsage(userId?: string): Promise<StorageUsage>
}
```

### 4. Cloud Functions للمساعد الذكي

#### وظائف الذكاء الاصطناعي
```javascript
// functions/ai/diagnosis.js
exports.diagnoseProblem = functions.https.onCall(async (data, context) => {
  // التحقق من المصادقة
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { carModel, year, symptoms, dtcCodes, mileage } = data;

  try {
    // استدعاء OpenAI API
    const openai = new OpenAI({
      apiKey: functions.config().openai.key
    });

    const prompt = `
    تشخيص ذكي للسيارة:
    الموديل: ${carModel}
    السنة: ${year}
    الأعراض: ${symptoms}
    أكواد الأعطال: ${dtcCodes}
    المسافة: ${mileage}
    
    قدم تشخيصاً شاملاً مع:
    1. التشخيص المحتمل
    2. الأسباب المحتملة
    3. خطوات الإصلاح
    4. التكلفة التقديرية
    5. نصائح وقائية
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'أنت خبير تشخيص سيارات محترف'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3
    });

    // حفظ التشخيص في Firestore
    await admin.firestore().collection('aiDiagnoses').add({
      userId: context.auth.uid,
      input: data,
      output: response.choices[0].message.content,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      model: 'gpt-4',
      tokensUsed: response.usage.total_tokens
    });

    return {
      diagnosis: response.choices[0].message.content,
      confidence: 0.85,
      tokensUsed: response.usage.total_tokens
    };

  } catch (error) {
    console.error('AI Diagnosis Error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to generate diagnosis');
  }
});

// functions/ai/dtcExplainer.js
exports.explainDTCCode = functions.https.onCall(async (data, context) => {
  const { code } = data;
  
  // البحث في قاعدة البيانات أولاً
  const dtcDoc = await admin.firestore().collection('dtcCodes').doc(code).get();
  
  if (dtcDoc.exists) {
    return dtcDoc.data();
  }

  // إذا لم يوجد، استخدم AI لتوليد الشرح
  const aiExplanation = await generateDTCExplanation(code);
  
  // حفظ النتيجة للاستخدام المستقبلي
  await admin.firestore().collection('dtcCodes').doc(code).set(aiExplanation);
  
  return aiExplanation;
});

// functions/notifications/taskNotifications.js
exports.onTaskCreated = functions.firestore
  .document('tasks/{taskId}')
  .onCreate(async (snap, context) => {
    const task = snap.data();
    const assignedUser = await admin.firestore()
      .collection('users')
      .doc(task.assignedTo)
      .get();

    if (assignedUser.exists) {
      const userData = assignedUser.data();
      
      // إرسال إشعار push
      if (userData.fcmToken) {
        await admin.messaging().send({
          token: userData.fcmToken,
          notification: {
            title: 'مهمة جديدة',
            body: task.title
          },
          data: {
            taskId: context.params.taskId,
            type: 'new_task'
          }
        });
      }

      // إرسال إشعار في التطبيق
      await admin.firestore().collection('notifications').add({
        userId: task.assignedTo,
        type: 'task_assigned',
        title: 'مهمة جديدة',
        message: `تم تعيين مهمة جديدة: ${task.title}`,
        data: { taskId: context.params.taskId },
        isRead: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
  });
```

### 5. Real-time Features للدردشة المباشرة

#### نظام الدردشة المباشر
```typescript
// hooks/useRealtimeChat.ts
import { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  where,
  limit,
  startAfter,
  Timestamp 
} from 'firebase/firestore';

export const useRealtimeChat = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    const q = query(
      collection(db, 'messages'),
      where('roomId', '==', roomId),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages: Message[] = [];
      
      snapshot.docChanges().forEach((change) => {
        const messageData = { id: change.doc.id, ...change.doc.data() } as Message;
        
        if (change.type === 'added') {
          newMessages.push(messageData);
        } else if (change.type === 'modified') {
          setMessages(prev => prev.map(msg => 
            msg.id === messageData.id ? messageData : msg
          ));
        } else if (change.type === 'removed') {
          setMessages(prev => prev.filter(msg => msg.id !== messageData.id));
        }
      });

      if (newMessages.length > 0) {
        setMessages(prev => [...newMessages.reverse(), ...prev]);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId]);

  return { messages, loading, hasMore };
};

// hooks/useTypingIndicator.ts
export const useTypingIndicator = (roomId: string, userId: string) => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const startTyping = async () => {
    await updateDoc(doc(db, 'chatRooms', roomId), {
      [`typing.${userId}`]: serverTimestamp()
    });
  };

  const stopTyping = async () => {
    await updateDoc(doc(db, 'chatRooms', roomId), {
      [`typing.${userId}`]: deleteField()
    });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'chatRooms', roomId), (doc) => {
      const data = doc.data();
      if (data?.typing) {
        const now = Timestamp.now();
        const activeTypers = Object.entries(data.typing)
          .filter(([uid, timestamp]) => {
            const timeDiff = now.seconds - (timestamp as Timestamp).seconds;
            return timeDiff < 3 && uid !== userId; // 3 ثواني timeout
          })
          .map(([uid]) => uid);
        
        setTypingUsers(activeTypers);
      }
    });

    return () => unsubscribe();
  }, [roomId, userId]);

  return { typingUsers, startTyping, stopTyping };
};
```

## 🛡️ قواعد الأمان المفصلة

### Firestore Security Rules الشاملة
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // قواعد المستخدمين
    match /users/{userId} {
      // المستخدم يمكنه قراءة وتعديل بياناته فقط
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // المدراء والمشرفون يمكنهم قراءة جميع المستخدمين
      allow read: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.token.role == 'manager');
      
      // المدراء فقط يمكنهم إنشاء مستخدمين جدد
      allow create: if request.auth != null && request.auth.token.role == 'admin';
      
      // منع تعديل الدور إلا من المدير
      allow update: if request.auth != null && 
        (request.auth.uid == userId || request.auth.token.role == 'admin') &&
        (!('role' in request.resource.data) || request.auth.token.role == 'admin');
    }

    // قواعد المهام
    match /tasks/{taskId} {
      // جميع المستخدمين المصادق عليهم يمكنهم قراءة المهام
      allow read: if request.auth != null;
      
      // المدراء والمشرفون يمكنهم إنشاء مهام
      allow create: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.token.role == 'manager');
      
      // المهمة يمكن تعديلها من قبل المنشئ أو المكلف أو المدراء
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.createdBy || 
         request.auth.uid == resource.data.assignedTo ||
         request.auth.token.role == 'admin' ||
         request.auth.token.role == 'manager');
      
      // المدراء فقط يمكنهم حذف المهام
      allow delete: if request.auth != null && request.auth.token.role == 'admin';
    }

    // قواعد الرسائل
    match /messages/{messageId} {
      // قراءة الرسائل للمشاركين في الغرفة
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.uid == resource.data.receiverId ||
         (resource.data.roomId != null && 
          request.auth.uid in get(/databases/$(database)/documents/chatRooms/$(resource.data.roomId)).data.participants));
      
      // إنشاء رسائل جديدة
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.senderId &&
        validateMessageContent(request.resource.data);
      
      // تعديل الرسائل (فقط المرسل خلال 5 دقائق)
      allow update: if request.auth != null && 
        request.auth.uid == resource.data.senderId &&
        (request.time.toMillis() - resource.data.timestamp.toMillis()) < 300000 &&
        onlyUpdatingContent(request.resource.data, resource.data);
      
      // حذف الرسائل (المرسل أو المدير)
      allow delete: if request.auth != null && 
        (request.auth.uid == resource.data.senderId || 
         request.auth.token.role == 'admin');
    }

    // قواعد غرف الدردشة
    match /chatRooms/{roomId} {
      // قراءة الغرف للمشاركين
      allow read: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      
      // إنشاء غرف جديدة
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.createdBy &&
        request.auth.uid in request.resource.data.participants;
      
      // تعديل الغرف (المدراء أو منشئ الغرفة)
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.createdBy ||
         request.auth.uid in resource.data.admins ||
         request.auth.token.role == 'admin');
    }

    // قواعد العملاء
    match /customers/{customerId} {
      allow read, write: if request.auth != null;
      allow delete: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.token.role == 'manager');
    }

    // قواعد أكواد DTC
    match /dtcCodes/{codeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.token.role == 'manager');
    }

    // قواعد التقارير
    match /reports/{reportId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.token.role == 'manager');
      allow delete: if request.auth != null && request.auth.token.role == 'admin';
    }

    // قواعد الإشعارات
    match /notifications/{notificationId} {
      allow read, update: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && 
        (request.auth.uid == resource.data.userId || request.auth.token.role == 'admin');
    }

    // قواعد سجلات المراجعة
    match /auditLogs/{logId} {
      allow read: if request.auth != null && request.auth.token.role == 'admin';
      allow create: if request.auth != null;
    }

    // وظائف مساعدة للتحقق
    function validateMessageContent(data) {
      return data.content is string && 
             data.content.size() <= 5000 &&
             data.type in ['text', 'image', 'file', 'audio', 'video', 'voice'];
    }

    function onlyUpdatingContent(newData, oldData) {
      return newData.diff(oldData).affectedKeys().hasOnly(['content', 'editedAt']);
    }
  }
}
```

### Storage Security Rules المتقدمة
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // ملفات المستخدمين
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.uid == userId || request.auth.token.role == 'admin') &&
        request.resource.size < 10 * 1024 * 1024 && // 10MB max
        request.resource.contentType.matches('image/.*|application/pdf|text/.*');
    }

    // ملفات المهام
    match /tasks/{taskId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        request.resource.size < 50 * 1024 * 1024 && // 50MB max
        request.resource.contentType.matches('image/.*|video/.*|application/.*|text/.*');
    }

    // ملفات الدردشة
    match /chat/{roomId}/{userId}/{allPaths=**} {
      allow read: if request.auth != null && 
        request.auth.uid in firestore.get(/databases/(default)/documents/chatRooms/$(roomId)).data.participants;
      
      allow write: if request.auth != null && 
        request.auth.uid == userId &&
        request.resource.size < 25 * 1024 * 1024 && // 25MB max
        request.resource.contentType.matches('image/.*|video/.*|audio/.*|application/.*');
    }

    // ملفات التقارير
    match /reports/{reportId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (request.auth.token.role == 'admin' || request.auth.token.role == 'manager');
    }

    // النسخ الاحتياطية
    match /backups/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
```

## 💻 الخدمات المطلوبة - أمثلة كود كاملة

### 1. خدمة المصادقة المتقدمة
```typescript
// services/firebaseAuth.ts
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export class FirebaseAuthService {
  private static instance: FirebaseAuthService;
  
  public static getInstance(): FirebaseAuthService {
    if (!FirebaseAuthService.instance) {
      FirebaseAuthService.instance = new FirebaseAuthService();
    }
    return FirebaseAuthService.instance;
  }

  // تسجيل الدخول
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // الحصول على بيانات المستخدم من Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('بيانات المستخدم غير موجودة');
      }

      const userData = userDoc.data() as User;
      
      // تحديث آخر تسجيل دخول
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        lastLogin: serverTimestamp(),
        isOnline: true
      });

      return userData;
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      throw this.handleAuthError(error);
    }
  }

  // إنشاء حساب جديد
  async register(userData: {
    email: string;
    password: string;
    name: string;
    role: string;
    phone?: string;
  }): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const firebaseUser = userCredential.user;
      
      // تحديث الملف الشخصي في Firebase Auth
      await updateProfile(firebaseUser, {
        displayName: userData.name
      });

      // إنشاء مستند المستخدم في Firestore
      const newUser: User = {
        uid: firebaseUser.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role as any,
        phone: userData.phone,
        isActive: true,
        isOnline: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        preferences: {
          language: 'ar',
          theme: 'light',
          notifications: true,
          soundEnabled: true
        },
        stats: {
          totalTasks: 0,
          completedTasks: 0,
          averageRating: 0,
          totalRevenue: 0
        },
        permissions: this.getDefaultPermissions(userData.role),
        centerIds: []
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      
      return newUser;
    } catch (error) {
      console.error('خطأ في إنشاء الحساب:', error);
      throw this.handleAuthError(error);
    }
  }

  // تسجيل الخروج
  async logout(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (user) {
        // تحديث حالة الاتصال
        await updateDoc(doc(db, 'users', user.uid), {
          isOnline: false,
          lastSeen: serverTimestamp()
        });
      }
      
      await signOut(auth);
    } catch (error) {
      console.error('خطأ في تسجيل الخروج:', error);
      throw error;
    }
  }

  // مراقبة حالة المصادقة
  onAuthStateChange(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            callback(userData);
          } else {
            callback(null);
          }
        } catch (error) {
          console.error('خطأ في جلب بيانات المستخدم:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  // تحديث الملف الشخصي
  async updateProfile(updates: Partial<User>): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('المستخدم غير مسجل دخول');

    try {
      // تحديث Firebase Auth إذا لزم الأمر
      if (updates.name) {
        await updateProfile(user, { displayName: updates.name });
      }

      // تحديث Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('خطأ في تحديث الملف الشخصي:', error);
      throw error;
    }
  }

  // تغيير كلمة المرور
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error('المستخدم غير مسجل دخول');

    try {
      // إعادة المصادقة
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      
      // تحديث كلمة المرور
      await updatePassword(user, newPassword);
    } catch (error) {
      console.error('خطأ في تغيير كلمة المرور:', error);
      throw this.handleAuthError(error);
    }
  }

  // إعادة تعيين كلمة المرور
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('خطأ في إعادة تعيين كلمة المرور:', error);
      throw this.handleAuthError(error);
    }
  }

  // الحصول على الصلاحيات الافتراضية
  private getDefaultPermissions(role: string): string[] {
    const permissions: { [key: string]: string[] } = {
      admin: [
        'manage_users', 'manage_tasks', 'view_tasks', 'create_tasks', 
        'update_tasks', 'delete_tasks', 'view_reports', 'manage_settings',
        'access_ai_assistant', 'manage_employees', 'view_analytics',
        'manage_customers', 'export_data', 'manage_system'
      ],
      manager: [
        'manage_tasks', 'view_tasks', 'create_tasks', 'update_tasks',
        'delete_tasks', 'view_reports', 'access_ai_assistant',
        'manage_employees', 'view_analytics', 'manage_customers'
      ],
      technician: [
        'view_tasks', 'update_tasks', 'access_ai_assistant', 'view_customers'
      ]
    };

    return permissions[role] || permissions.technician;
  }

  // معالجة أخطاء المصادقة
  private handleAuthError(error: any): Error {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'المستخدم غير موجود',
      'auth/wrong-password': 'كلمة المرور غير صحيحة',
      'auth/email-already-in-use': 'البريد الإلكتروني مستخدم مسبقاً',
      'auth/weak-password': 'كلمة المرور ضعيفة',
      'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
      'auth/too-many-requests': 'محاولات كثيرة، حاول لاحقاً'
    };

    const message = errorMessages[error.code] || 'حدث خطأ غير متوقع';
    return new Error(message);
  }
}
```

### 2. خدمة Firestore الشاملة
```typescript
// services/firestoreService.ts
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  writeBatch,
  runTransaction
} from 'firebase/firestore';
import { db } from '../firebase/config';

export class FirestoreService {
  private static instance: FirestoreService;
  
  public static getInstance(): FirestoreService {
    if (!FirestoreService.instance) {
      FirestoreService.instance = new FirestoreService();
    }
    return FirestoreService.instance;
  }

  // ==================== إدارة المستخدمين ====================
  
  async createUser(userData: Omit<User, 'uid'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('خطأ في إنشاء المستخدم:', error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      return userDoc.exists() ? { uid: userDoc.id, ...userDoc.data() } as User : null;
    } catch (error) {
      console.error('خطأ في جلب المستخدم:', error);
      throw error;
    }
  }

  async getUsers(filters?: {
    role?: string;
    isActive?: boolean;
    centerIds?: string[];
  }): Promise<User[]> {
    try {
      let q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));

      if (filters?.role) {
        q = query(q, where('role', '==', filters.role));
      }
      if (filters?.isActive !== undefined) {
        q = query(q, where('isActive', '==', filters.isActive));
      }
      if (filters?.centerIds?.length) {
        q = query(q, where('centerIds', 'array-contains-any', filters.centerIds));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
    } catch (error) {
      console.error('خطأ في جلب المستخدمين:', error);
      throw error;
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        ...updates,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('خطأ في تحديث المستخدم:', error);
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error('خطأ في حذف المستخدم:', error);
      throw error;
    }
  }

  // ==================== إدارة المهام ====================
  
  async createTask(taskData: Omit<Task, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        ...taskData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // تحديث إحصائيات المستخدم
      await this.updateUserStats(taskData.assignedTo, {
        totalTasks: increment(1)
      });

      return docRef.id;
    } catch (error) {
      console.error('خطأ في إنشاء المهمة:', error);
      throw error;
    }
  }

  async getTasks(filters?: {
    assignedTo?: string;
    status?: string;
    priority?: string;
    createdBy?: string;
    dateRange?: { start: Date; end: Date };
  }): Promise<Task[]> {
    try {
      let q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));

      if (filters?.assignedTo) {
        q = query(q, where('assignedTo', '==', filters.assignedTo));
      }
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.priority) {
        q = query(q, where('priority', '==', filters.priority));
      }
      if (filters?.createdBy) {
        q = query(q, where('createdBy', '==', filters.createdBy));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
    } catch (error) {
      console.error('خطأ في جلب المهام:', error);
      throw error;
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      await runTransaction(db, async (transaction) => {
        const taskRef = doc(db, 'tasks', taskId);
        const taskDoc = await transaction.get(taskRef);
        
        if (!taskDoc.exists()) {
          throw new Error('المهمة غير موجودة');
        }

        const currentTask = taskDoc.data() as Task;
        
        // إذا تم تغيير الحالة إلى مكتملة
        if (updates.status === 'completed' && currentTask.status !== 'completed') {
          updates.completedAt = serverTimestamp() as any;
          
          // تحديث إحصائيات المستخدم
          transaction.update(doc(db, 'users', currentTask.assignedTo), {
            'stats.completedTasks': increment(1)
          });
        }

        transaction.update(taskRef, {
          ...updates,
          updatedAt: serverTimestamp()
        });
      });
    } catch (error) {
      console.error('خطأ في تحديث المهمة:', error);
      throw error;
    }
  }

  // ==================== نظام الدردشة ====================
  
  async sendMessage(messageData: Omit<Message, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        ...messageData,
        timestamp: serverTimestamp(),
        deliveryStatus: 'sent'
      });

      // تحديث آخر رسالة في الغرفة
      if (messageData.roomId) {
        await updateDoc(doc(db, 'chatRooms', messageData.roomId), {
          lastMessage: {
            content: messageData.content,
            senderId: messageData.senderId,
            timestamp: serverTimestamp(),
            type: messageData.type
          },
          updatedAt: serverTimestamp()
        });
      }

      return docRef.id;
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error);
      throw error;
    }
  }

  async getMessages(roomId: string, lastMessage?: Message): Promise<Message[]> {
    try {
      let q = query(
        collection(db, 'messages'),
        where('roomId', '==', roomId),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      if (lastMessage) {
        q = query(q, startAfter(lastMessage.timestamp));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
    } catch (error) {
      console.error('خطأ في جلب الرسائل:', error);
      throw error;
    }
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        [`readBy.${userId}`]: serverTimestamp(),
        isRead: true
      });
    } catch (error) {
      console.error('خطأ في تحديد الرسالة كمقروءة:', error);
      throw error;
    }
  }

  // ==================== إدارة غرف الدردشة ====================
  
  async createChatRoom(roomData: Omit<ChatRoom, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'chatRooms'), {
        ...roomData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('خطأ في إنشاء غرفة الدردشة:', error);
      throw error;
    }
  }

  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    try {
      const q = query(
        collection(db, 'chatRooms'),
        where('participants', 'array-contains', userId),
        where('isActive', '==', true),
        orderBy('updatedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatRoom));
    } catch (error) {
      console.error('خطأ في جلب غرف الدردشة:', error);
      throw error;
    }
  }

  // ==================== التقارير والإحصائيات ====================
  
  async generateReport(type: string, filters: any): Promise<any> {
    try {
      switch (type) {
        case 'tasks':
          return await this.generateTasksReport(filters);
        case 'employees':
          return await this.generateEmployeesReport(filters);
        case 'financial':
          return await this.generateFinancialReport(filters);
        default:
          throw new Error('نوع التقرير غير مدعوم');
      }
    } catch (error) {
      console.error('خطأ في إنشاء التقرير:', error);
      throw error;
    }
  }

  private async generateTasksReport(filters: any) {
    const tasks = await this.getTasks(filters);
    
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      pending: tasks.filter(t => t.status === 'pending').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      byPriority: {
        urgent: tasks.filter(t => t.priority === 'urgent').length,
        high: tasks.filter(t => t.priority === 'high').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        low: tasks.filter(t => t.priority === 'low').length
      },
      averageCompletionTime: this.calculateAverageCompletionTime(tasks),
      topPerformers: await this.getTopPerformers(tasks)
    };
  }

  // ==================== البحث المتقدم ====================
  
  async searchTasks(searchTerm: string, filters?: any): Promise<Task[]> {
    try {
      // البحث النصي الأساسي (يمكن تحسينه مع Algolia)
      const q = query(
        collection(db, 'tasks'),
        orderBy('title'),
        limit(20)
      );

      const snapshot = await getDocs(q);
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));

      // تصفية النتائج محلياً (مؤقت)
      return tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('خطأ في البحث:', error);
      throw error;
    }
  }

  // ==================== الإشعارات ====================
  
  async createNotification(notificationData: {
    userId: string;
    type: string;
    title: string;
    message: string;
    data?: any;
  }): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notificationData,
        isRead: false,
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('خطأ في إنشاء الإشعار:', error);
      throw error;
    }
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
    } catch (error) {
      console.error('خطأ في جلب الإشعارات:', error);
      throw error;
    }
  }

  // ==================== Real-time Subscriptions ====================
  
  subscribeToTasks(
    userId: string, 
    callback: (tasks: Task[]) => void
  ): () => void {
    const q = query(
      collection(db, 'tasks'),
      where('assignedTo', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      callback(tasks);
    });
  }

  subscribeToMessages(
    roomId: string,
    callback: (messages: Message[]) => void
  ): () => void {
    const q = query(
      collection(db, 'messages'),
      where('roomId', '==', roomId),
      orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      callback(messages);
    });
  }

  subscribeToUserStatus(
    userIds: string[],
    callback: (users: { [userId: string]: { isOnline: boolean; lastSeen: Date } }) => void
  ): () => void {
    const q = query(
      collection(db, 'users'),
      where('__name__', 'in', userIds)
    );

    return onSnapshot(q, (snapshot) => {
      const userStatuses: { [userId: string]: { isOnline: boolean; lastSeen: Date } } = {};
      
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        userStatuses[doc.id] = {
          isOnline: data.isOnline || false,
          lastSeen: data.lastSeen?.toDate() || new Date()
        };
      });

      callback(userStatuses);
    });
  }

  // ==================== إدارة العملاء ====================
  
  async createCustomer(customerData: Omit<Customer, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'customers'), {
        ...customerData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('خطأ في إنشاء العميل:', error);
      throw error;
    }
  }

  async getCustomers(filters?: {
    searchTerm?: string;
    isVip?: boolean;
    lastVisitRange?: { start: Date; end: Date };
  }): Promise<Customer[]> {
    try {
      let q = query(collection(db, 'customers'), orderBy('updatedAt', 'desc'));

      if (filters?.isVip !== undefined) {
        q = query(q, where('isVip', '==', filters.isVip));
      }

      const snapshot = await getDocs(q);
      let customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));

      // تصفية البحث النصي محلياً
      if (filters?.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        customers = customers.filter(customer =>
          customer.name.toLowerCase().includes(searchTerm) ||
          customer.phone.includes(searchTerm) ||
          customer.email?.toLowerCase().includes(searchTerm)
        );
      }

      return customers;
    } catch (error) {
      console.error('خطأ في جلب العملاء:', error);
      throw error;
    }
  }

  // ==================== وظائف مساعدة ====================
  
  private async updateUserStats(userId: string, stats: any): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        [`stats.${Object.keys(stats)[0]}`]: Object.values(stats)[0],
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('خطأ في تحديث إحصائيات المستخدم:', error);
    }
  }

  private calculateAverageCompletionTime(tasks: Task[]): number {
    const completedTasks = tasks.filter(t => t.status === 'completed' && t.completedAt && t.createdAt);
    if (completedTasks.length === 0) return 0;

    const totalTime = completedTasks.reduce((sum, task) => {
      const startTime = task.createdAt.toMillis();
      const endTime = task.completedAt!.toMillis();
      return sum + (endTime - startTime);
    }, 0);

    return totalTime / completedTasks.length / (1000 * 60 * 60); // بالساعات
  }

  private async getTopPerformers(tasks: Task[]): Promise<any[]> {
    const performanceMap = new Map();
    
    tasks.forEach(task => {
      if (task.status === 'completed') {
        const current = performanceMap.get(task.assignedTo) || { count: 0, totalTime: 0 };
        current.count++;
        
        if (task.actualDuration) {
          current.totalTime += task.actualDuration;
        }
        
        performanceMap.set(task.assignedTo, current);
      }
    });

    return Array.from(performanceMap.entries())
      .map(([userId, stats]) => ({
        userId,
        completedTasks: stats.count,
        averageTime: stats.totalTime / stats.count
      }))
      .sort((a, b) => b.completedTasks - a.completedTasks)
      .slice(0, 5);
  }
}
```

### 3. خدمة التخزين المتقدمة
```typescript
// services/storageService.ts
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  updateMetadata
} from 'firebase/storage';
import { storage } from '../firebase/config';

export class StorageService {
  private static instance: StorageService;
  
  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // رفع ملف واحد مع تتبع التقدم
  async uploadFile(
    file: File, 
    path: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      
      if (onProgress) {
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              onProgress(progress);
            },
            (error) => reject(error),
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            }
          );
        });
      } else {
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      }
    } catch (error) {
      console.error('خطأ في رفع الملف:', error);
      throw error;
    }
  }

  // رفع متعدد الملفات
  async uploadMultipleFiles(
    files: File[],
    basePath: string,
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<string[]> {
    try {
      const uploadPromises = files.map((file, index) => {
        const fileName = `${Date.now()}_${index}_${file.name}`;
        const filePath = `${basePath}/${fileName}`;
        
        return this.uploadFile(file, filePath, (progress) => {
          onProgress?.(index, progress);
        });
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('خطأ في رفع الملفات المتعددة:', error);
      throw error;
    }
  }

  // ضغط الصور قبل الرفع
  async compressAndUploadImage(
    file: File,
    path: string,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    } = {}
  ): Promise<string> {
    try {
      const compressedFile = await this.compressImage(file, options);
      return await this.uploadFile(compressedFile, path);
    } catch (error) {
      console.error('خطأ في ضغط ورفع الصورة:', error);
      throw error;
    }
  }

  // ضغط الصور
  private async compressImage(
    file: File,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    }
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;
        
        let { width, height } = img;
        
        // حساب الأبعاد الجديدة
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob!], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  // إنشاء thumbnail للصور
  async generateThumbnail(imagePath: string): Promise<string> {
    try {
      // هذا يتطلب Cloud Function للمعالجة
      // أو يمكن استخدام مكتبة محلية للضغط
      const thumbnailPath = imagePath.replace(/(\.[^.]+)$/, '_thumb$1');
      
      // استدعاء Cloud Function
      const generateThumbnailFunction = httpsCallable(functions, 'generateThumbnail');
      const result = await generateThumbnailFunction({ imagePath, thumbnailPath });
      
      return result.data.thumbnailUrl;
    } catch (error) {
      console.error('خطأ في إنشاء thumbnail:', error);
      throw error;
    }
  }

  // حذف ملف
  async deleteFile(path: string): Promise<void> {
    try {
      const fileRef = ref(storage, path);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('خطأ في حذف الملف:', error);
      throw error;
    }
  }

  // الحصول على معلومات الملف
  async getFileMetadata(path: string): Promise<any> {
    try {
      const fileRef = ref(storage, path);
      return await getMetadata(fileRef);
    } catch (error) {
      console.error('خطأ في جلب معلومات الملف:', error);
      throw error;
    }
  }

  // حساب استخدام التخزين
  async calculateStorageUsage(basePath: string): Promise<{
    totalFiles: number;
    totalSize: number;
    fileTypes: { [type: string]: number };
  }> {
    try {
      const listRef = ref(storage, basePath);
      const result = await listAll(listRef);
      
      let totalSize = 0;
      const fileTypes: { [type: string]: number } = {};
      
      for (const itemRef of result.items) {
        const metadata = await getMetadata(itemRef);
        totalSize += metadata.size;
        
        const fileType = metadata.contentType || 'unknown';
        fileTypes[fileType] = (fileTypes[fileType] || 0) + 1;
      }

      return {
        totalFiles: result.items.length,
        totalSize,
        fileTypes
      };
    } catch (error) {
      console.error('خطأ في حساب استخدام التخزين:', error);
      throw error;
    }
  }
}
```

## 🚀 خطة الهجرة - 4 مراحل مفصلة

### المرحلة 1: الإعداد الأساسي (الأسبوع 1-2)

#### الأهداف
- إنشاء مشروع Firebase
- إعداد Authentication
- تكوين Firestore الأساسي
- إعداد Security Rules الأولية

#### المهام التفصيلية
```bash
# 1. إنشاء مشروع Firebase
firebase login
firebase projects:create car-diagnostic-system
firebase use car-diagnostic-system

# 2. تفعيل الخدمات المطلوبة
firebase init auth
firebase init firestore
firebase init storage
firebase init functions
firebase init hosting

# 3. تثبيت التبعيات
npm install firebase
npm install @firebase/auth @firebase/firestore @firebase/storage @firebase/functions
```

#### ملفات التكوين
```typescript
// firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
```

#### الجدول الزمني للمرحلة 1
| اليوم | المهمة | المدة المقدرة |
|-------|--------|---------------|
| 1-2 | إنشاء مشروع Firebase وتكوين الخدمات | 4 ساعات |
| 3-4 | إعداد Authentication وإنشاء المستخدمين الأساسيين | 6 ساعات |
| 5-7 | تصميم هيكل Firestore وإنشاء Collections | 8 ساعات |
| 8-10 | كتابة Security Rules الأساسية | 6 ساعات |
| 11-14 | اختبار الإعداد الأساسي وإصلاح المشاكل | 8 ساعات |

### المرحلة 2: نقل البيانات والمصادقة (الأسبوع 3-4)

#### الأهداف
- تحويل نظام المصادقة بالكامل
- نقل بيانات المستخدمين
- تطبيق نظام الصلاحيات
- إنشاء Cloud Functions الأساسية

#### المهام التفصيلية
```typescript
// migration/authMigration.ts
export class AuthMigration {
  async migrateUsers() {
    const currentUsers = this.getCurrentUsers(); // من النظام الحالي
    
    for (const user of currentUsers) {
      try {
        // إنشاء المستخدم في Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          user.email, 
          'temporary_password_123'
        );

        // إنشاء Custom Claims
        await this.setUserRole(userCredential.user.uid, user.role);

        // إنشاء مستند في Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          ...user,
          uid: userCredential.user.uid,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });

        console.log(`تم نقل المستخدم: ${user.name}`);
      } catch (error) {
        console.error(`فشل في نقل المستخدم ${user.name}:`, error);
      }
    }
  }

  private async setUserRole(uid: string, role: string) {
    const setCustomClaims = httpsCallable(functions, 'setUserRole');
    await setCustomClaims({ uid, role });
  }
}
```

#### Cloud Functions للمرحلة 2
```javascript
// functions/auth/userManagement.js
exports.setUserRole = functions.https.onCall(async (data, context) => {
  // التحقق من صلاحيات المدير
  if (!context.auth || !context.auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied', 
      'Only admins can set user roles'
    );
  }

  const { uid, role } = data;
  
  const customClaims = {
    role: role,
    admin: role === 'admin',
    manager: role === 'manager' || role === 'admin',
    technician: role === 'technician' || role === 'manager' || role === 'admin'
  };

  try {
    await admin.auth().setCustomUserClaims(uid, customClaims);
    
    // تحديث Firestore أيضاً
    await admin.firestore().collection('users').doc(uid).update({
      role: role,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, message: 'تم تحديث دور المستخدم بنجاح' };
  } catch (error) {
    console.error('خطأ في تحديث دور المستخدم:', error);
    throw new functions.https.HttpsError('internal', 'فشل في تحديث دور المستخدم');
  }
});

// functions/auth/onUserCreate.js
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    // إنشاء مستند المستخدم في Firestore تلقائياً
    await admin.firestore().collection('users').doc(user.uid).set({
      uid: user.uid,
      email: user.email,
      name: user.displayName || 'مستخدم جديد',
      role: 'technician', // الدور الافتراضي
      isActive: true,
      isOnline: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      preferences: {
        language: 'ar',
        theme: 'light',
        notifications: true,
        soundEnabled: true
      },
      stats: {
        totalTasks: 0,
        completedTasks: 0,
        averageRating: 0,
        totalRevenue: 0
      }
    });

    console.log(`تم إنشاء مستند للمستخدم: ${user.uid}`);
  } catch (error) {
    console.error('خطأ في إنشاء مستند المستخدم:', error);
  }
});
```

### المرحلة 3: الميزات المتقدمة (الأسبوع 5-6)

#### الأهداف
- تطوير نظام الدردشة المباشر
- دمج المساعد الذكي مع Cloud Functions
- تطبيق Firebase Storage
- إنشاء نظام الإشعارات

#### نظام الدردشة المباشر
```typescript
// services/chatService.ts
export class ChatService {
  private firestoreService = FirestoreService.getInstance();
  private storageService = StorageService.getInstance();

  // إرسال رسالة نصية
  async sendTextMessage(roomId: string, content: string, replyTo?: string): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('المستخدم غير مسجل دخول');

    const messageData: Omit<Message, 'id'> = {
      senderId: user.uid,
      roomId,
      content,
      type: 'text',
      timestamp: serverTimestamp() as any,
      isRead: false,
      readBy: {},
      reactions: {},
      mentions: this.extractMentions(content),
      replyTo,
      priority: 'normal',
      category: 'general',
      isEncrypted: false,
      deliveryStatus: 'sent'
    };

    return await this.firestoreService.sendMessage(messageData);
  }

  // إرسال رسالة مع ملف
  async sendMediaMessage(
    roomId: string, 
    file: File, 
    content?: string,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('المستخدم غير مسجل دخول');

    try {
      // رفع الملف أولاً
      const filePath = `chat/${roomId}/${user.uid}/${Date.now()}_${file.name}`;
      const fileUrl = await this.storageService.uploadFile(file, filePath, onProgress);

      // تحديد نوع الرسالة حسب نوع الملف
      let messageType: Message['type'] = 'file';
      if (file.type.startsWith('image/')) messageType = 'image';
      else if (file.type.startsWith('video/')) messageType = 'video';
      else if (file.type.startsWith('audio/')) messageType = 'audio';

      const messageData: Omit<Message, 'id'> = {
        senderId: user.uid,
        roomId,
        content: content || '',
        type: messageType,
        timestamp: serverTimestamp() as any,
        isRead: false,
        readBy: {},
        reactions: {},
        mentions: [],
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        fileMimeType: file.type,
        priority: 'normal',
        category: 'general',
        isEncrypted: false,
        deliveryStatus: 'sent'
      };

      return await this.firestoreService.sendMessage(messageData);
    } catch (error) {
      console.error('خطأ في إرسال رسالة الوسائط:', error);
      throw error;
    }
  }

  // تسجيل رسالة صوتية
  async sendVoiceMessage(
    roomId: string,
    audioBlob: Blob,
    duration: number
  ): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('المستخدم غير مسجل دخول');

    try {
      const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, {
        type: 'audio/webm'
      });

      const filePath = `chat/${roomId}/${user.uid}/voice/${Date.now()}.webm`;
      const fileUrl = await this.storageService.uploadFile(audioFile, filePath);

      const messageData: Omit<Message, 'id'> = {
        senderId: user.uid,
        roomId,
        content: '',
        type: 'voice',
        timestamp: serverTimestamp() as any,
        isRead: false,
        readBy: {},
        reactions: {},
        mentions: [],
        fileUrl,
        fileName: audioFile.name,
        fileSize: audioFile.size,
        duration,
        priority: 'normal',
        category: 'general',
        isEncrypted: false,
        deliveryStatus: 'sent'
      };

      return await this.firestoreService.sendMessage(messageData);
    } catch (error) {
      console.error('خطأ في إرسال الرسالة الصوتية:', error);
      throw error;
    }
  }

  // استخراج الإشارات (@mentions)
  private extractMentions(content: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }

    return mentions;
  }

  // إنشاء غرفة دردشة جديدة
  async createChatRoom(roomData: {
    name: string;
    type: 'group' | 'announcement';
    participants: string[];
    description?: string;
  }): Promise<string> {
    const user = auth.currentUser;
    if (!user) throw new Error('المستخدم غير مسجل دخول');

    const chatRoomData: Omit<ChatRoom, 'id'> = {
      name: roomData.name,
      description: roomData.description,
      type: roomData.type,
      participants: [user.uid, ...roomData.participants],
      admins: [user.uid],
      createdBy: user.uid,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      isActive: true,
      isArchived: false,
      settings: {
        allowFileSharing: true,
        allowVoiceMessages: true,
        allowVideoMessages: true,
        maxFileSize: 25 * 1024 * 1024, // 25MB
        retentionDays: 365,
        isPublic: false,
        requireApproval: false
      },
      stats: {
        totalMessages: 0,
        totalParticipants: roomData.participants.length + 1,
        activeParticipants: 0,
        lastActivity: serverTimestamp() as any
      },
      tags: [],
      pinnedMessages: []
    };

    return await this.firestoreService.createChatRoom(chatRoomData);
  }
}
```

### المرحلة 4: التحسين والنشر (الأسبوع 7-8)

#### الأهداف
- تحسين الأداء
- اختبار شامل
- نشر على Firebase Hosting
- مراقبة ومتابعة

#### تحسينات الأداء
```typescript
// hooks/useOptimizedQueries.ts
export const useOptimizedTasks = (userId: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // استخدام composite index للاستعلامات المعقدة
    const q = query(
      collection(db, 'tasks'),
      where('assignedTo', '==', userId),
      where('status', 'in', ['pending', 'in-progress']),
      orderBy('priority', 'desc'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Task));
      
      setTasks(tasksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { tasks, loading };
};

// utils/caching.ts
export class CacheManager {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttlMinutes: number = 5): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(): void {
    this.cache.clear();
  }
}
```

#### إعداد Firebase Hosting
```json
// firebase.json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

## 💰 تقدير التكلفة المفصل

### خطة Spark (المجانية)
```
الحدود المجانية:
✅ Authentication: 10,000 مستخدم
✅ Firestore: 50,000 قراءة/يوم، 20,000 كتابة/يوم، 1GB تخزين
✅ Storage: 1GB تخزين، 10GB نقل/شهر
✅ Functions: 125,000 استدعاء/شهر، 40,000 GB-ثانية
✅ Hosting: 10GB تخزين، 10GB نقل/شهر

مناسبة لـ:
- مراكز صغيرة (أقل من 10 موظفين)
- أقل من 1000 مهمة/شهر
- استخدام محدود للدردشة
- تطوير واختبار النظام
```

### خطة Blaze (الدفع حسب الاستخدام)
```
التكلفة المتوقعة لمركز متوسط (20 موظف):

🔥 Firestore:
- القراءات: ~500,000/شهر = $0.36
- الكتابات: ~200,000/شهر = $1.08  
- التخزين: ~5GB = $1.00
المجموع: ~$2.44/شهر

💾 Storage:
- التخزين: ~50GB = $2.60
- النقل: ~100GB = $12.00
المجموع: ~$14.60/شهر

⚡ Functions:
- الاستدعاءات: ~1,000,000/شهر = $0.40
- وقت التنفيذ: ~500,000 GB-ثانية = $8.25
المجموع: ~$8.65/شهر

🌐 Hosting:
- التخزين: ~1GB = $0.026
- النقل: ~50GB = $0.15
المجموع: ~$0.18/شهر

📱 Authentication: مجاني حتى 50,000 مستخدم

إجمالي التكلفة المتوقعة: ~$25.87/شهر
```

### تحسين التكلفة
```typescript
// استراتيجيات تحسين التكلفة
export class CostOptimization {
  // تجميع الكتابات
  async batchWrites(operations: any[]): Promise<void> {
    const batch = writeBatch(db);
    
    operations.forEach(op => {
      batch.set(op.ref, op.data);
    });

    await batch.commit();
  }

  // تخزين مؤقت للاستعلامات المتكررة
  async getCachedData(key: string, queryFn: () => Promise<any>): Promise<any> {
    const cached = localStorage.getItem(`cache_${key}`);
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 5 * 60 * 1000) { // 5 دقائق
        return data;
      }
    }

    const data = await queryFn();
    localStorage.setItem(`cache_${key}`, JSON.stringify({
      data,
      timestamp: Date.now()
    }));

    return data;
  }

  // ضغط البيانات قبل التخزين
  compressData(data: any): string {
    return JSON.stringify(data); // يمكن استخدام مكتبة ضغط
  }
}
```

## 📊 مقارنة شاملة

### الأداء
| المقياس | النظام الحالي | Firebase |
|---------|---------------|----------|
| سرعة التحميل | 2-3 ثانية | 1-2 ثانية |
| Real-time Updates | محاكاة | فوري |
| التزامن | غير مدعوم | مدعوم بالكامل |
| البحث | محدود | متقدم مع فهرسة |
| النسخ الاحتياطي | يدوي | تلقائي |

### الأمان
| الميزة | النظام الحالي | Firebase |
|--------|---------------|----------|
| المصادقة | localStorage | Firebase Auth |
| تشفير البيانات | لا | نعم |
| قواعد الوصول | بسيطة | متقدمة |
| مراجعة الأنشطة | محدودة | شاملة |
| النسخ الاحتياطي | لا | مشفر |

### التوسع
| المقياس | النظام الحالي | Firebase |
|---------|---------------|----------|
| عدد المستخدمين | محدود | غير محدود |
| حجم البيانات | محدود | غير محدود |
| المناطق الجغرافية | واحدة | متعددة |
| التوفر | 95% | 99.95% |

## 🎯 النتيجة المتوقعة

بعد النقل إلى Firebase، ستحصل على:

### ✅ مميزات جديدة
- **Real-time collaboration** - تعاون فوري بين الموظفين
- **Offline support** - عمل النظام بدون إنترنت
- **Auto-scaling** - توسع تلقائي حسب الحاجة
- **Global CDN** - أداء سريع في جميع أنحاء العالم
- **Advanced analytics** - تحليلات متقدمة للاستخدام
- **Push notifications** - إشعارات فورية على الهاتف
- **Multi-device sync** - مزامنة بين الأجهزة
- **Advanced search** - بحث متقدم مع فهرسة

### 🔒 أمان محسن
- **Enterprise-grade security** - أمان على مستوى المؤسسات
- **Data encryption** - تشفير البيانات في الراحة والحركة
- **Audit logs** - سجلات مراجعة شاملة
- **Compliance** - امتثال للمعايير الدولية
- **Backup & recovery** - نسخ احتياطي واستعادة تلقائية

### 📈 أداء محسن
- **99.95% uptime** - توفر عالي للخدمة
- **Global infrastructure** - بنية تحتية عالمية
- **Auto-scaling** - توسع تلقائي
- **CDN optimization** - تحسين شبكة التوصيل
- **Caching** - تخزين مؤقت ذكي

هذا الدليل الشامل يوفر كل ما تحتاجه لنقل النظام بنجاح إلى Firebase! 🚀