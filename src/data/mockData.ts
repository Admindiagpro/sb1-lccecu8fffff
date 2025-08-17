import { Employee, Task, DTCCode } from '../types';

export const employees: Employee[] = [
  {
    id: '1',
    name: 'أدمن النظام',
    phone: '0500000000',
    type: 'manager',
    isOnline: true,
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '2',
    name: 'شهاب',
    phone: '059 199 7420',
    type: 'confident',
    isOnline: true,
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  {
    id: '3',
    name: 'عمر',
    phone: '053 516 2651',
    type: 'guided',
    isOnline: false,
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
];

export const dtcCodes: DTCCode[] = [
  {
    code: 'P0171',
    description: 'System Too Lean (Bank 1)',
    possibleCauses: [
      'مشكلة في حساس الهواء',
      'تسريب في نظام السحب',
      'مرشح الهواء متسخ',
      'مشكلة في حاقن الوقود'
    ],
    suggestedSolutions: [
      'فحص فولتية حساس الهواء',
      'تنظيف حساس الهواء',
      'فحص خراطيم السحب',
      'استبدال مرشح الهواء'
    ],
    severity: 'medium'
  },
  {
    code: 'P0300',
    description: 'Random/Multiple Cylinder Misfire Detected',
    possibleCauses: [
      'مشكلة في شمعات الإشعال',
      'مشكلة في الإشعال',
      'مشكلة في حاقن الوقود',
      'انضغاط المحرك منخفض'
    ],
    suggestedSolutions: [
      'فحص شمعات الإشعال',
      'فحص كويلات الإشعال',
      'تنظيف حاقنات الوقود',
      'فحص انضغاط المحرك'
    ],
    severity: 'high'
  }
];

export const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'فحص حساس الهواء - كامري 2018',
    description: 'العميل يشكو من ضعف في التسارع. كود P0171 ظاهر.',
    assignedTo: '3',
    createdBy: '1',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date(),
    updatedAt: new Date(),
    dtcCodes: ['P0171'],
    customerInfo: {
      name: 'محمد أحمد',
      phone: '0501234567',
      carModel: 'Toyota Camry',
      carYear: '2018',
      licensePlate: 'ABC 1234'
    }
  }
];