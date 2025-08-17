import { defineFlow } from '@genkit-ai/flow'
import { gemini20Flash } from '@genkit-ai/googleai'
import { z } from 'zod'

const ElectricalRepairSchema = z.object({
  dtcCodes: z.string().describe('أكواد الأعطال الكهربائية'),
  symptoms: z.string().describe('الأعراض المرصودة'),
  vehicleInfo: z.string().describe('معلومات المركبة'),
  testResults: z.string().optional().describe('نتائج الفحوصات الكهربائية'),
})

export const electricalRepairFlow = defineFlow(
  {
    name: 'getElectricalRepairRecommendations',
    inputSchema: ElectricalRepairSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const prompt = `
أنت خبير في الأنظمة الكهربائية للسيارات. قم بتحليل العطل الكهربائي التالي:

معلومات المركبة: ${input.vehicleInfo}
أكواد الأعطال: ${input.dtcCodes}
الأعراض: ${input.symptoms}
${input.testResults ? `نتائج الفحوصات: ${input.testResults}` : ''}

يرجى تقديم:
1. تفسير مفصل لأكواد الأعطال
2. تحليل الأعراض وربطها بالأسباب المحتملة
3. خطة فحص منهجية للنظام الكهربائي
4. الأدوات والمعدات المطلوبة للفحص
5. خطوات الإصلاح المفصلة
6. قطع الغيار الكهربائية المطلوبة
7. احتياطات السلامة الضرورية
8. طرق التحقق من نجاح الإصلاح
9. التكلفة التقديرية والوقت المطلوب

اجعل التوصيات عملية ومناسبة لفني كهرباء السيارات.
`

    const response = await gemini20Flash.generate({
      prompt,
      config: {
        temperature: 0.2,
        maxOutputTokens: 2500,
      },
    })

    return response.text()
  }
)

export async function getElectricalRepairRecommendations(input: z.infer<typeof ElectricalRepairSchema>) {
  return await electricalRepairFlow(input)
}