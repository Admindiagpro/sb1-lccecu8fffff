"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Car } from "lucide-react"

const vehicleRegistrationSchema = z.object({
  // معلومات المركبة
  make: z.string().min(1, "يرجى اختيار ماركة المركبة"),
  model: z.string().min(1, "يرجى إدخال موديل المركبة"),
  year: z.string().min(4, "يرجى إدخال سنة صحيحة"),
  color: z.string().min(1, "يرجى إدخال لون المركبة"),
  plateNumber: z.string().min(1, "يرجى إدخال رقم اللوحة"),
  chassisNumber: z.string().min(17, "رقم الشاسيه يجب أن يكون 17 رقم"),
  engineNumber: z.string().min(1, "يرجى إدخال رقم المحرك"),
  
  // معلومات المالك
  ownerName: z.string().min(2, "يرجى إدخال اسم المالك"),
  ownerIdNumber: z.string().min(10, "رقم الهوية يجب أن يكون 10 أرقام على الأقل"),
  ownerPhone: z.string().min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل"),
  ownerEmail: z.string().email("البريد الإلكتروني غير صحيح").optional(),
  ownerAddress: z.string().min(10, "يرجى إدخال العنوان كاملاً"),
})

type VehicleRegistrationFormData = z.infer<typeof vehicleRegistrationSchema>

export function VehicleRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<VehicleRegistrationFormData>({
    resolver: zodResolver(vehicleRegistrationSchema),
  })

  const onSubmit = async (data: VehicleRegistrationFormData) => {
    setIsLoading(true)
    
    try {
      // محاكاة حفظ البيانات
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "تم تسجيل المركبة بنجاح",
        description: `تم تسجيل ${data.make} ${data.model} برقم اللوحة ${data.plateNumber}`,
      })
      
      reset()
    } catch (error) {
      toast({
        title: "خطأ في التسجيل",
        description: "حدث خطأ أثناء تسجيل المركبة، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* معلومات المركبة */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">معلومات المركبة</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="make">الماركة</Label>
            <Select onValueChange={(value) => setValue("make", value)}>
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
                <SelectItem value="bmw">بي إم دبليو</SelectItem>
                <SelectItem value="mercedes">مرسيدس</SelectItem>
                <SelectItem value="audi">أودي</SelectItem>
              </SelectContent>
            </Select>
            {errors.make && (
              <p className="text-sm text-destructive">{errors.make.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">الموديل</Label>
            <Input
              id="model"
              placeholder="مثال: كامري"
              {...register("model")}
            />
            {errors.model && (
              <p className="text-sm text-destructive">{errors.model.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">سنة الصنع</Label>
            <Input
              id="year"
              placeholder="2020"
              {...register("year")}
            />
            {errors.year && (
              <p className="text-sm text-destructive">{errors.year.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">اللون</Label>
            <Input
              id="color"
              placeholder="أبيض"
              {...register("color")}
            />
            {errors.color && (
              <p className="text-sm text-destructive">{errors.color.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="plateNumber">رقم اللوحة</Label>
            <Input
              id="plateNumber"
              placeholder="أ ب ج 1234"
              {...register("plateNumber")}
            />
            {errors.plateNumber && (
              <p className="text-sm text-destructive">{errors.plateNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="engineNumber">رقم المحرك</Label>
            <Input
              id="engineNumber"
              placeholder="ENG123456789"
              {...register("engineNumber")}
            />
            {errors.engineNumber && (
              <p className="text-sm text-destructive">{errors.engineNumber.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="chassisNumber">رقم الشاسيه (VIN)</Label>
          <Input
            id="chassisNumber"
            placeholder="1HGBH41JXMN109186"
            maxLength={17}
            {...register("chassisNumber")}
          />
          {errors.chassisNumber && (
            <p className="text-sm text-destructive">{errors.chassisNumber.message}</p>
          )}
        </div>
      </div>

      {/* معلومات المالك */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">معلومات المالك</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ownerName">اسم المالك</Label>
            <Input
              id="ownerName"
              placeholder="أحمد محمد علي"
              {...register("ownerName")}
            />
            {errors.ownerName && (
              <p className="text-sm text-destructive">{errors.ownerName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerIdNumber">رقم الهوية</Label>
            <Input
              id="ownerIdNumber"
              placeholder="1234567890"
              {...register("ownerIdNumber")}
            />
            {errors.ownerIdNumber && (
              <p className="text-sm text-destructive">{errors.ownerIdNumber.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ownerPhone">رقم الهاتف</Label>
            <Input
              id="ownerPhone"
              placeholder="0501234567"
              {...register("ownerPhone")}
            />
            {errors.ownerPhone && (
              <p className="text-sm text-destructive">{errors.ownerPhone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerEmail">البريد الإلكتروني (اختياري)</Label>
            <Input
              id="ownerEmail"
              type="email"
              placeholder="ahmed@example.com"
              {...register("ownerEmail")}
            />
            {errors.ownerEmail && (
              <p className="text-sm text-destructive">{errors.ownerEmail.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ownerAddress">العنوان</Label>
          <Input
            id="ownerAddress"
            placeholder="الرياض، حي النخيل، شارع الملك فهد"
            {...register("ownerAddress")}
          />
          {errors.ownerAddress && (
            <p className="text-sm text-destructive">{errors.ownerAddress.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <Car className="mr-2 h-4 w-4" />
        تسجيل المركبة
      </Button>
    </form>
  )
}