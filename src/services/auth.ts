import { User, LoginCredentials } from '../types/auth';

// قاعدة بيانات المستخدمين المحلية (في التطبيق الحقيقي ستكون في قاعدة بيانات)
const USERS_DB: Array<User & { password: string }> = [
  {
    id: '1',
    email: 'admin@cardiag.com',
    password: 'admin123',
    name: 'أبو مانع',
    role: 'admin',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '0535473565',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  },
  {
    id: '2',
    email: 'shahab@cardiag.com',
    password: 'shahab123',
    name: 'شهاب',
    role: 'manager',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '059 199 7420',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date()
  },
  {
    id: '3',
    email: 'omar@cardiag.com',
    password: 'omar123',
    name: 'عمر',
    role: 'technician',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '053 516 2651',
    isActive: true,
    createdAt: new Date('2024-02-01'),
    lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000) // أمس
  },
  {
    id: '4',
    email: 'ahmed@cardiag.com',
    password: 'ahmed123',
    name: 'أحمد الفني',
    role: 'technician',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '050 123 4567',
    isActive: true,
    createdAt: new Date('2024-02-15'),
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // قبل يومين
  },
  {
    id: '5',
    email: 'demo@workshop.com',
    password: 'demo123',
    name: 'ورشة تجريبية',
    role: 'manager',
    avatar: 'https://images.pexels.com/photos/3807277/pexels-photo-3807277.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '0535473565',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  }
];

export class AuthService {
  private static instance: AuthService;
  
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // تسجيل الدخول
  async login(credentials: LoginCredentials): Promise<User> {
    // محاكاة تأخير الشبكة
    await new Promise(resolve => setTimeout(resolve, 1000));

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

    // إرجاع المستخدم بدون كلمة المرور
    const { password, ...userWithoutPassword } = user;
    
    // حفظ في localStorage
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('auth_token', this.generateToken(user.id));

    return userWithoutPassword;
  }

  // تسجيل الخروج
  logout(): void {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }

  // الحصول على المستخدم الحالي
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('auth_user');
      const token = localStorage.getItem('auth_token');
      
      if (!userStr || !token) {
        return null;
      }

      const user = JSON.parse(userStr);
      
      // التحقق من صحة التوكن
      if (!this.validateToken(token, user.id)) {
        this.logout();
        return null;
      }

      return user;
    } catch (error) {
      console.error('خطأ في استرجاع المستخدم:', error);
      this.logout();
      return null;
    }
  }

  // التحقق من صحة الجلسة
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // الحصول على جميع المستخدمين (للمدير فقط)
  getAllUsers(): User[] {
    return USERS_DB.map(({ password, ...user }) => user);
  }

  // إضافة مستخدم جديد (للمدير فقط)
  async addUser(userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<User> {
    // التحقق من عدم وجود البريد الإلكتروني
    const existingUser = USERS_DB.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      throw new Error('البريد الإلكتروني مستخدم مسبقاً');
    }

    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    USERS_DB.push(newUser);

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  // تحديث معلومات المستخدم
  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const userIndex = USERS_DB.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('المستخدم غير موجود');
    }

    USERS_DB[userIndex] = { ...USERS_DB[userIndex], ...updates };
    const { password, ...userWithoutPassword } = USERS_DB[userIndex];
    
    // تحديث localStorage إذا كان المستخدم الحالي
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
    }

    return userWithoutPassword;
  }

  // حذف مستخدم (للمدير فقط)
  async deleteUser(userId: string): Promise<void> {
    const userIndex = USERS_DB.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('المستخدم غير موجود');
    }

    USERS_DB.splice(userIndex, 1);
  }

  // تغيير كلمة المرور
  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = USERS_DB.find(u => u.id === userId);
    if (!user) {
      throw new Error('المستخدم غير موجود');
    }

    if (user.password !== oldPassword) {
      throw new Error('كلمة المرور الحالية غير صحيحة');
    }

    if (newPassword.length < 6) {
      throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    }

    user.password = newPassword;
  }

  // إنشاء توكن بسيط
  private generateToken(userId: string): string {
    const timestamp = Date.now();
    const data = `${userId}:${timestamp}`;
    return btoa(data); // تشفير base64 بسيط
  }

  // التحقق من صحة التوكن
  private validateToken(token: string, userId: string): boolean {
    try {
      const decoded = atob(token);
      const [tokenUserId, timestamp] = decoded.split(':');
      
      // التحقق من المستخدم
      if (tokenUserId !== userId) {
        return false;
      }

      // التحقق من انتهاء الصلاحية (7 أيام)
      const tokenTime = parseInt(timestamp);
      const now = Date.now();
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      
      return (now - tokenTime) < sevenDays;
    } catch (error) {
      return false;
    }
  }

  // الحصول على صلاحيات المستخدم
  getUserPermissions(user: User): string[] {
    const permissions: string[] = [];

    switch (user.role) {
      case 'admin':
        permissions.push(
          'manage_users',
          'manage_tasks',
          'view_tasks',
          'create_tasks',
          'update_tasks',
          'delete_tasks',
          'view_reports',
          'manage_settings',
          'access_ai_assistant',
          'manage_employees',
          'view_analytics'
        );
        break;
      
      case 'manager':
        permissions.push(
          'manage_tasks',
          'view_tasks',
          'create_tasks',
          'update_tasks',
          'delete_tasks',
          'view_reports',
          'access_ai_assistant',
          'manage_employees',
          'view_analytics'
        );
        break;
      
      case 'technician':
        permissions.push(
          'view_tasks',
          'update_tasks',
          'access_ai_assistant'
        );
        break;
    }

    return permissions;
  }

  // التحقق من صلاحية معينة
  hasPermission(user: User, permission: string): boolean {
    const permissions = this.getUserPermissions(user);
    return permissions.includes(permission);
  }
}

export default AuthService;