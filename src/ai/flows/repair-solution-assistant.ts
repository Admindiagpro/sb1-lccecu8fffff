import { defineFlow } from '@genkit-ai/flow'
import { gemini20Flash } from '@genkit-ai/googleai'
import { z } from 'zod'

const RepairRequestSchema = z.object({
  vehicleInfo: z.string().describe('معلومات المركبة (الماركة، الموديل، السنة)'),
  mileage: z.number().describe('المسافة المقطوعة بالكيلومتر'),
  problemDescription: z.string().describe('وصف مفصل للمشكلة'),
  dtcCodes: z.string().optional().describe('أكواد الأعطال إن وجدت'),
})

export const suggestRepairSolutionsFlow = defineFlow(
  {
    name: 'suggestRepairSolutions',
    inputSchema: RepairRequestSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const prompt = `
أنت خبير تشخيص سيارات محترف في مركز تشخيص متقدم. قم بتحليل المشكلة التالية وقدم حلولاً شاملة:

معلومات المركبة: ${input.vehicleInfo}
المسافة المقطوعة: ${input.mileage} كم
وصف المشكلة: ${input.problemDescription}
${input.dtcCodes ? `أكواد الأعطال: ${input.dtcCodes}` : ''}

يرجى تقديم:
1. تشخيص أولي للمشكلة
2. الأسباب المحتملة مرتبة حسب الاحتمالية
3. خطوات التشخيص المطلوبة
4. الحلول المقترحة مع التكلفة التقديرية
5. قطع الغيار المطلوبة
6. الوقت المتوقع للإصلاح
7. نصائح وقائية لتجنب تكرار المشكلة

اجعل الإجابة مفصلة وعملية ومناسبة لفني السيارات المحترف.
`

    const response = await gemini20Flash.generate({
      prompt,
      config: {
        temperature: 0.3,
        maxOutputTokens: 2000,
      },
    })

    return response.text()
  }
)

export async function suggestRepairSolutions(input: z.infer<typeof RepairRequestSchema>) {
  return await suggestRepairSolutionsFlow(input)
}