import OpenAI from 'openai';

// تكوين OpenAI - سيتم إنشاؤه عند الحاجة
let openai: OpenAI | null = null;

const getOpenAIClient = (): OpenAI => {
  if (!openai) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('مفتاح OpenAI API غير متوفر. يرجى إضافة VITE_OPENAI_API_KEY في ملف .env');
    }
    openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });
  }
  return openai;
};

export interface DiagnosticRequest {
  carModel: string;
  year: string;
  symptoms: string;
  dtcCodes?: string;
  mileage?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class OpenAIService {
  private static instance: OpenAIService;
  
  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }
    return OpenAIService.instance;
  }

  // تشخيص ذكي للأعطال
  async diagnoseProblem(request: DiagnosticRequest): Promise<string> {
    const prompt = `
أنت خبير تشخيص سيارات محترف. قم بتحليل المشكلة التالية وقدم تشخيصاً شاملاً:

معلومات السيارة:
- الموديل: ${request.carModel}
- السنة: ${request.year}
- المسافة المقطوعة: ${request.mileage || 'غير محدد'}

الأعراض المبلغ عنها:
${request.symptoms}

أكواد الأعطال (إن وجدت):
${request.dtcCodes || 'لا توجد أكواد'}

يرجى تقديم:
1. التشخيص المحتمل للمشكلة
2. الأسباب الأكثر احتمالاً
3. خطوات الفحص المطلوبة
4. الحلول المقترحة مرتبة حسب الأولوية
5. التكلفة التقديرية للإصلاح
6. نصائح وقائية لتجنب تكرار المشكلة

اجعل الإجابة مفصلة وعملية ومناسبة لفني السيارات.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'أنت خبير تشخيص سيارات محترف متخصص في جميع أنواع السيارات. تقدم تشخيصاً دقيقاً وحلولاً عملية.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      });

      return response.choices[0]?.message?.content || 'عذراً، لم أتمكن من تحليل المشكلة.';
    } catch (error) {
      console.error('خطأ في تشخيص المشكلة:', error);
      throw new Error('فشل في الاتصال بخدمة التشخيص الذكي');
    }
  }

  // شرح أكواد DTC
  async explainDTCCode(code: string): Promise<string> {
    const prompt = `
اشرح كود العطل التالي بالتفصيل: ${code}

يرجى تقديم:
1. معنى الكود ووصفه
2. الأسباب المحتملة
3. الأعراض المتوقعة
4. خطوات التشخيص
5. طرق الإصلاح
6. القطع التي قد تحتاج استبدال
7. التكلفة التقديرية
8. مستوى خطورة العطل

اجعل الشرح مفصلاً وعملياً.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'أنت خبير في أكواد أعطال السيارات (DTC) وتقدم شروحات مفصلة ودقيقة.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.2
      });

      return response.choices[0]?.message?.content || 'عذراً، لم أتمكن من شرح هذا الكود.';
    } catch (error) {
      console.error('خطأ في شرح كود DTC:', error);
      throw new Error('فشل في الحصول على شرح الكود');
    }
  }

  // معلومات عن قطع الغيار
  async getPartInfo(partName: string, carModel: string): Promise<string> {
    const prompt = `
قدم معلومات شاملة عن قطعة الغيار التالية:
القطعة: ${partName}
السيارة: ${carModel}

يرجى تقديم:
1. وصف القطعة ووظيفتها
2. موقعها في السيارة
3. علامات التلف أو الأعطال
4. طريقة الفحص
5. خطوات الاستبدال
6. الأدوات المطلوبة
7. التكلفة التقديرية
8. نصائح الصيانة
9. القطع البديلة المتوافقة

اجعل المعلومات عملية ومفيدة للفني.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'أنت خبير في قطع غيار السيارات وتقدم معلومات تقنية دقيقة ومفصلة.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1200,
        temperature: 0.3
      });

      return response.choices[0]?.message?.content || 'عذراً، لم أتمكن من العثور على معلومات عن هذه القطعة.';
    } catch (error) {
      console.error('خطأ في الحصول على معلومات القطعة:', error);
      throw new Error('فشل في الحصول على معلومات القطعة');
    }
  }

  // جدول صيانة مخصص
  async getMaintenanceSchedule(carModel: string, year: string, mileage: string): Promise<string> {
    const prompt = `
أنشئ جدول صيانة مخصص للسيارة التالية:
- الموديل: ${carModel}
- السنة: ${year}
- المسافة الحالية: ${mileage} كم

يرجى تقديم:
1. الصيانة المطلوبة حالياً
2. الصيانة القادمة (التواريخ والمسافات)
3. قائمة بالقطع التي تحتاج فحص
4. السوائل التي تحتاج تغيير
5. الفلاتر المطلوب استبدالها
6. فحوصات السلامة
7. التكلفة التقديرية لكل عملية
8. نصائح للحفاظ على السيارة

رتب الجدول حسب الأولوية والمسافة.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'أنت خبير صيانة سيارات وتقدم جداول صيانة مخصصة ودقيقة حسب نوع السيارة.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.3
      });

      return response.choices[0]?.message?.content || 'عذراً، لم أتمكن من إنشاء جدول الصيانة.';
    } catch (error) {
      console.error('خطأ في إنشاء جدول الصيانة:', error);
      throw new Error('فشل في إنشاء جدول الصيانة');
    }
  }

  // محادثة عامة
  async chat(messages: ChatMessage[]): Promise<string> {
    try {
      const systemMessage: ChatMessage = {
        role: 'system',
        content: `أنت مساعد ذكي متخصص في تشخيص وصيانة السيارات. تعمل في مركز تشخيص احترافي.
        
مهامك:
- تقديم المساعدة في تشخيص أعطال السيارات
- شرح أكواد الأعطال (DTC)
- تقديم معلومات عن قطع الغيار
- إنشاء جداول صيانة مخصصة
- الإجابة على الأسئلة التقنية
- تقديم نصائح الصيانة الوقائية

اجعل إجاباتك:
- دقيقة ومفصلة
- عملية وقابلة للتطبيق
- مناسبة لفنيي السيارات
- باللغة العربية بشكل أساسي`
      };

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [systemMessage, ...messages],
        max_tokens: 1000,
        temperature: 0.4
      });

      return response.choices[0]?.message?.content || 'عذراً، لم أتمكن من الإجابة على سؤالك.';
    } catch (error) {
      console.error('خطأ في المحادثة:', error);
      throw new Error('فشل في الاتصال بالمساعد الذكي');
    }
  }

  // فحص حالة الاتصال
  async testConnection(): Promise<boolean> {
    try {
      const openai = getOpenAIClient();
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'مرحبا'
          }
        ],
        max_tokens: 10
      });

      return !!response.choices[0]?.message?.content;
    } catch (error) {
      console.error('فشل في اختبار الاتصال:', error);
      return false;
    }
  }
}

export default OpenAIService;