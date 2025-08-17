import { PageHeader } from "@/components/layout/page-header"
import { VehicleRegistrationForm } from "@/components/forms/vehicle-registration-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Calendar, MapPin, FileText } from "lucide-react"

export default function VehicleRegisterPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="تسجيل مركبة جديدة"
        description="إضافة مركبة جديدة إلى قاعدة البيانات"
      />
      
      {/* إرشادات التسجيل */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">معلومات المركبة</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              الماركة، الموديل، سنة الصنع
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">بيانات المالك</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              الاسم، رقم الهوية، معلومات الاتصال
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تاريخ التسجيل</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              تاريخ أول تسجيل وآخر فحص
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الموقع</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              مكان التسجيل والفحص
            </p>
          </CardContent>
        </Card>
      </div>

      {/* نموذج التسجيل */}
      <Card>
        <CardHeader>
          <CardTitle>نموذج تسجيل المركبة</CardTitle>
          <CardDescription>
            يرجى ملء جميع البيانات المطلوبة بدقة
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VehicleRegistrationForm />
        </CardContent>
      </Card>
    </div>
  )
}