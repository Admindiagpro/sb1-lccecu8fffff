import { PageHeader } from "@/components/layout/page-header"
import { ElectricalRepairForm } from "@/components/forms/electrical-repair-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export default function ElectricalRepairPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="مساعد الإصلاح الكهربائي"
        description="تشخيص وإصلاح الأعطال الكهربائية بمساعدة الذكاء الاصطناعي"
      />
      
      {/* إحصائيات سريعة */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">أعطال كهربائية</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">هذا الأسبوع</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حالات طارئة</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">تحتاج تدخل فوري</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تم الإصلاح</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">معدل نجاح 78%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">متوسط الوقت</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5</div>
            <p className="text-xs text-muted-foreground">ساعة للإصلاح</p>
          </CardContent>
        </Card>
      </div>

      {/* نموذج التشخيص */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>تشخيص العطل الكهربائي</CardTitle>
            <CardDescription>
              أدخل أكواد الأعطال والأعراض للحصول على توصيات الإصلاح
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ElectricalRepairForm />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>أكواد الأعطال الشائعة</CardTitle>
            <CardDescription>أكثر أكواد الأعطال الكهربائية تكراراً</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">P0171 - System Too Lean</p>
                  <p className="text-sm text-muted-foreground">مشكلة في نظام الوقود</p>
                </div>
                <span className="text-sm text-red-600">عالي</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">P0300 - Random Misfire</p>
                  <p className="text-sm text-muted-foreground">خلل في الإشعال</p>
                </div>
                <span className="text-sm text-orange-600">متوسط</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">P0420 - Catalyst Efficiency</p>
                  <p className="text-sm text-muted-foreground">مشكلة في المحول الحفاز</p>
                </div>
                <span className="text-sm text-yellow-600">منخفض</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}