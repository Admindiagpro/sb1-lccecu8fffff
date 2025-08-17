import { PageHeader } from "@/components/layout/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Users, Car, Wrench, TrendingUp, Edit, Trash2, UserPlus } from "lucide-react"

const monthlyData = [
  { month: 'يناير', requests: 120, completed: 115 },
  { month: 'فبراير', requests: 135, completed: 128 },
  { month: 'مارس', requests: 148, completed: 142 },
  { month: 'أبريل', requests: 162, completed: 155 },
  { month: 'مايو', requests: 178, completed: 170 },
  { month: 'يونيو', requests: 195, completed: 188 },
]

const serviceTypeData = [
  { name: 'فحص المحرك', value: 35, color: '#0088FE' },
  { name: 'إصلاح كهربائي', value: 25, color: '#00C49F' },
  { name: 'صيانة دورية', value: 20, color: '#FFBB28' },
  { name: 'إصلاح ميكانيكي', value: 15, color: '#FF8042' },
  { name: 'أخرى', value: 5, color: '#8884D8' },
]

const employees = [
  { id: 1, name: 'أحمد محمد', role: 'فني أول', email: 'ahmed@example.com', status: 'نشط', tasksCompleted: 45 },
  { id: 2, name: 'سارة أحمد', role: 'فني كهرباء', email: 'sara@example.com', status: 'نشط', tasksCompleted: 38 },
  { id: 3, name: 'محمد علي', role: 'فني ميكانيكا', email: 'mohamed@example.com', status: 'نشط', tasksCompleted: 42 },
  { id: 4, name: 'فاطمة حسن', role: 'مشرف فني', email: 'fatima@example.com', status: 'نشط', tasksCompleted: 52 },
  { id: 5, name: 'خالد سالم', role: 'فني تشخيص', email: 'khaled@example.com', status: 'غير نشط', tasksCompleted: 28 },
]

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="لوحة الإدارة"
        description="إحصائيات شاملة وإدارة النظام"
      />
      
      {/* إحصائيات رئيسية */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الموظفين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">
              {employees.filter(emp => emp.status === 'نشط').length} موظف نشط
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">طلبات هذا الشهر</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">195</div>
            <p className="text-xs text-muted-foreground">+12% من الشهر الماضي</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المهام المكتملة</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">188</div>
            <p className="text-xs text-muted-foreground">معدل إنجاز 96.4%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,600 ر.س</div>
            <p className="text-xs text-muted-foreground">+8.2% من الشهر الماضي</p>
          </CardContent>
        </Card>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>طلبات الخدمة الشهرية</CardTitle>
            <CardDescription>مقارنة الطلبات والمهام المكتملة</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#8884d8" name="الطلبات" />
                <Bar dataKey="completed" fill="#82ca9d" name="المكتملة" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>توزيع أنواع الخدمات</CardTitle>
            <CardDescription>نسبة كل نوع من أنواع الخدمات</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* جدول الموظفين */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>إدارة الموظفين</CardTitle>
            <CardDescription>قائمة بجميع الموظفين وإحصائياتهم</CardDescription>
          </div>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            إضافة موظف
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>المنصب</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead>المهام المكتملة</TableHead>
                <TableHead>الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.role}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Badge variant={employee.status === 'نشط' ? 'default' : 'secondary'}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.tasksCompleted}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2 space-x-reverse">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}