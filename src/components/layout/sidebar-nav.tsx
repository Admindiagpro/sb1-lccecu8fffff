"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { 
  LayoutDashboard, 
  Car, 
  Zap, 
  Users, 
  Settings, 
  LogOut,
  Shield
} from "lucide-react"

const navigation = [
  {
    name: "لوحة التحكم",
    href: "/",
    icon: LayoutDashboard,
    requireAuth: false
  },
  {
    name: "تسجيل مركبة",
    href: "/vehicles/register",
    icon: Car,
    requireAuth: true
  },
  {
    name: "الإصلاح الكهربائي",
    href: "/electrical-repair",
    icon: Zap,
    requireAuth: true
  },
  {
    name: "لوحة الإدارة",
    href: "/admin",
    icon: Shield,
    requireAuth: true,
    adminOnly: true
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const filteredNavigation = navigation.filter(item => {
    if (item.requireAuth && !user) return false
    if (item.adminOnly && user?.email !== 'admin@example.com') return false
    return true
  })

  return (
    <nav className="space-y-2">
      {filteredNavigation.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        )
      })}
      
      {user && (
        <>
          <div className="border-t pt-2 mt-4">
            <Link
              href="/login"
              onClick={() => signOut()}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Link>
          </div>
        </>
      )}
    </nav>
  )
}