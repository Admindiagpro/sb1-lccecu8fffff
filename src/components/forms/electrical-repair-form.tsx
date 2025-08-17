"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getElectricalRepairRecommendations } from "@/ai/flows/electrical-repair-assistant"
import { Loader2, Zap } from "lucide-react"

const electricalRepairSchema = z.object({
  dtcCodes: z.string().min(1, "يرجى إدخال أكواد الأعطال"),
  symptoms: z.string().min(10, "يرجى وصف الأعراض بالتفصيل"),
  vehicleInfo: z.string().min(1, "يرجى إدخال معلومات المركبة"),
  testResults: z.string().optional(),
})

type ElectricalRepairFormData = z.infer<typeof electricalRepairSchema>

export function ElectricalRepairForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<string | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ElectricalRepairFormData>({
    resolver: zodResolver(electricalRepairSchema),
  })

  const onSubmit = async (data: ElectricalRepairFormData) => {
    setIsLoading(true)
    setRecommendations(null)
    
    try {
      const result = await getElectricalRepairRecommendations({
        dtcCodes: data.dtcCodes,
        symptoms: data.symptoms,
        vehicleInfo: data.vehicleInfo,
        testResults: data.testResults || "",
      })
      
      setRecommendations(result)
      toast({
        title: "تم تحليل العطل الكهربائي",
        description: "تم الحصول على توصيات الإصلاح بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ في التحليل",
        description: "حدث خطأ أثناء تحليل العطل، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleInfo">معلومات المركبة</Label>
          <Input
            id="vehicleInfo"
            placeholder="تويوتا كامري 2020"
            {...register("vehicleInfo")}
          />
          {errors.vehicleInfo && (
            <p className="text-sm text-destructive">{errors.vehicleInfo.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dtcCodes">أكواد الأعطال</Label>
          <Input
            id="dtcCodes"
            placeholder="P0171, P0300, P0420"
            {...register("dtcCodes")}
          />
          {errors.dtcCodes && (
            <p className="text-sm text-destructive">{errors.dtcCodes.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="symptoms">الأعراض المرصودة</Label>
          <Textarea
            id="symptoms"
            placeholder="اشرح الأعراض التي لاحظتها..."
            rows={4}
            {...register("symptoms")}
          />
          {errors.symptoms && (
            <p className="text-sm text-destructive">{errors.symptoms.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="testResults">نتائج الفحوصات (اختياري)</Label>
          <Textarea
            id="testResults"
            placeholder="نتائج فحص الفولتية، المقاومة، إلخ..."
            rows={3}
            {...register("testResults")}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Zap className="mr-2 h-4 w-4" />
          تحليل العطل الكهربائي
        </Button>
      </form>

      {recommendations && (
        <Card>
          <CardHeader>
            <CardTitle>توصيات الإصلاح الكهربائي</CardTitle>
            <CardDescription>
              تم تحليل العطل بواسطة الذكاء الاصطناعي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {recommendations}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}