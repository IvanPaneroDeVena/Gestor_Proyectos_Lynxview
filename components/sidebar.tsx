"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Calendar,
  CreditCard,
  FileText,
  Home,
  Layers,
  LayoutDashboard,
  Settings,
  Users,
  UserCheck,
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-white md:block">
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 rounded-lg bg-gray-100/80 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <div className="grid gap-0.5">
            <div className="text-sm font-medium">Lynx View</div>
            <div className="text-xs text-gray-500">Gestión de Proyectos</div>
          </div>
        </div>
      </div>
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-2">
        <Link
          href="/"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
            isActive("/") ? "bg-gray-100 text-gray-900" : ""
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Inicio</span>
        </Link>
        <Link
          href="/proyectos"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
            isActive("/proyectos") ? "bg-gray-100 text-gray-900" : ""
          }`}
        >
          <Layers className="h-5 w-5" />
          <span>Proyectos</span>
        </Link>
        <Link
          href="/equipo"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
            isActive("/equipo") ? "bg-gray-100 text-gray-900" : ""
          }`}
        >
          <Users className="h-5 w-5" />
          <span>Equipo</span>
        </Link>
        <Link
          href="/calendario"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
            isActive("/calendario") ? "bg-gray-100 text-gray-900" : ""
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span>Calendario</span>
        </Link>
        <Link
          href="/facturacion"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
            isActive("/facturacion") ? "bg-gray-100 text-gray-900" : ""
          }`}
        >
          <CreditCard className="h-5 w-5" />
          <span>Facturación</span>
        </Link>
        <Link
          href="/facturacion-equipo"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
            isActive("/facturacion-equipo") ? "bg-gray-100 text-gray-900" : ""
          }`}
        >
          <UserCheck className="h-5 w-5" />
          <span>Facturación Equipo</span>
        </Link>
        <Link
          href="/informes"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
            isActive("/informes") ? "bg-gray-100 text-gray-900" : ""
          }`}
        >
          <BarChart3 className="h-5 w-5" />
          <span>Informes</span>
        </Link>
        <Link
          href="/documentos"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
            isActive("/documentos") ? "bg-gray-100 text-gray-900" : ""
          }`}
        >
          <FileText className="h-5 w-5" />
          <span>Documentos</span>
        </Link>
      </nav>
      <div className="mt-auto px-2 pb-4">
        <Link
          href="/configuracion"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 ${
            isActive("/configuracion") ? "bg-gray-100 text-gray-900" : ""
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Configuración</span>
        </Link>
      </div>
    </aside>
  )
}
