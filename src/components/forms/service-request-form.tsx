"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { suggestRepairSolutions } from "@/ai/flows/repair-solution-assistant"
import { Loader2, Wrench } from "lucide-react"

const serviceRequestSchema = z.object({
  vehicleMake: z.string().min(1, "يرجى اختيار ماركة المركبة"),
  vehicleModel: z.string().min(1, "يرجى إدخال موديل المركبة"),
  vehicleYear: z.string().min(4, "يرجى إدخال سنة صحيحة"),
  mileage: z.string().min(1, "يرجى إدخال المسافة المقطوعة"),
  problemDescription: z.string().min(10, "يرجى وصف المشكلة بالتفصيل"),
  dtcCodes: z.string().optional(),
})

type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>

export function ServiceRequestForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
  })

  const onSubmit = async (data: ServiceRequestFormData) => {
    setIsLoading(true)
    setSuggestions(null)
    
    try {
      const result = await suggestRepairSolutions({
        vehicleInfo: `${data.vehicleMake} ${data.vehicleModel} ${data.vehicleYear}`,
        mileage: parseInt(data.mileage),
        problemDescription: data.problemDescription,
        dtcCodes: data.dtcCodes || "",
      })
      
      setSuggestions(result)
      toast({
        title: "تم تحليل المشكلة",
        description: "تم الحصول على اقتراحات الإصلاح بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ في التحليل",
        description: "حدث خطأ أثناء تحليل المشكلة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleMake">ماركة المركبة</Label>
            <Select onValueChange={(value) => setValue("vehicleMake", value)}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الماركة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="toyota">تويوتا</SelectItem>
                <SelectItem value="honda">هوندا</SelectItem>
                <SelectItem value="nissan">نيسان</SelectItem>
                <SelectItem value="hyundai">هيونداي</SelectItem>
                <SelectItem value="kia">كيا</SelectItem>
                <SelectItem value="ford">فورد</SelectItem>
                <SelectItem value="chevrolet">شيفروليه</SelectItem>
              </SelectContent>
            </Select>
            {errors.vehicleMake && (
              <p className="text-sm text-destructive">{errors.vehicleMake.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleModel">الموديل</Label>
            <Input
              id="vehicleModel"
              placeholder="مثال: كامري"
              {...register("vehicleModel")}
            />
            {errors.vehicleModel && (
              <p className="text-sm text-destructive">{errors.vehicleModel.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleYear">سنة الصنع</Label>
            <Input
              id="vehicleYear"
              placeholder="2020"
              {...register("vehicleYear")}
            />
            {errors.vehicleYear && (
              <p className="text-sm text-destructive">{errors.vehicleYear.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mileage">المسافة المقطوعة (كم)</Label>
            <Input
              id="mileage"
              placeholder="50000"
              {...register("mileage")}
            />
            {errors.mileage && (
              <p className="text-sm text-destructive">{errors.mileage.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="problemDescription">وصف المشكلة</Label>
          <Textarea
            id="problemDescription"
            placeholder="اشرح المشكلة بالتفصيل..."
            rows={4}
            {...register("problemDescription")}
          />
          {errors.problemDescription && (
            <p className="text-sm text-destructive">{errors.problemDescription.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dtcCodes">أكواد الأعطال (اختياري)</Label>
          <Input
            id="dtcCodes"
            placeholder="P0171, P0300"
            {...register("dtcCodes")}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Wrench className="mr-2 h-4 w-4" />
          تحليل المشكلة واقتراح الحلول
        </Button>
      </form>

      {suggestions && (
        <Card>
          <CardHeader>
            <CardTitle>اقتراحات الإصلاح</CardTitle>
            <CardDescription>
              تم تحليل المشكلة بواسطة الذكاء الاصطناعي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {suggestions}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}