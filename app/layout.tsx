import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { CreateProjectFAB } from "@/components/create-project-fab"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Gestión de Proyectos | Lynx View",
  description: "Aplicación de gestión de proyectos y equipos de Lynx View",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-pattern`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col bg-transparent">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 bg-transparent">{children}</main>
            </div>
            <CreateProjectFAB />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
