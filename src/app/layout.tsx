import type { Metadata } from "next"
import { Inter, Noto_Sans_Arabic } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

const notoSansArabic = Noto_Sans_Arabic({ 
  subsets: ["arabic"],
  variable: "--font-noto-arabic"
})

export const metadata: Metadata = {
  title: "نظام إدارة مركز تشخيص السيارات",
  description: "نظام متطور لإدارة مراكز تشخيص السيارات مع مساعد ذكي مدعوم بالذكاء الاصطناعي",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.variable} ${notoSansArabic.variable} font-sans antialiased`}>
        <AuthProvider>
          <SidebarProvider>
            {children}
            <Toaster />
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  )
}