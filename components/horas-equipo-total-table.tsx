"use client"

import { useState } from "react"
import { ArrowUpDown, MoreHorizontal, FileText, BarChart3, Download, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TooltipProvider } from "@/components/ui/tooltip"

interface HorasEquipoTotalTableProps {
  year: string
}

export function HorasEquipoTotalTable({ year }: HorasEquipoTotalTableProps) {
  const [sortColumn, setSortColumn] = useState("nombre")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Datos de ejemplo para las horas totales por miembro del equipo
  const horasEquipoData = [
    {
      id: "EMP001",
      nombre: "Ana Martínez",
      rol: "Desarrolladora Frontend",
      avatar: "/placeholder.svg?height=40&width=40",
      horasAsignadas: 1920,
      horasRegistradas: 1876,
      utilizacion: 98,
      proyectos: [
        { nombre: "Portal cliente Banco Nacional", horas: 520, id: "PRJ001" },
        { nombre: "App móvil Seguros Unidos", horas: 640, id: "PRJ003" },
        { nombre: "Plataforma e-learning", horas: 180, id: "PRJ002" },
        { nombre: "Formación interna", horas: 120, id: "INT001" },
        { nombre: "Reuniones", horas: 180, id: "INT002" },
        { nombre: "Soporte", horas: 236, id: "SUP001" },
      ],
      mesesActivos: 12,
      rendimiento: 95,
    },
    {
      id: "EMP002",
      nombre: "Carlos Ruiz",
      rol: "Desarrollador Backend",
      avatar: "/placeholder.svg?height=40&width=40",
      horasAsignadas: 1920,
      horasRegistradas: 1890,
      utilizacion: 98,
      proyectos: [
        { nombre: "Portal cliente Banco Nacional", horas: 420, id: "PRJ001" },
        { nombre: "Plataforma e-learning", horas: 580, id: "PRJ002" },
        { nombre: "Sistema de Notificaciones", horas: 480, id: "PRJ004" },
        { nombre: "Migración Base de Datos", horas: 410, id: "PRJ005" },
      ],
      mesesActivos: 12,
      rendimiento: 97,
    },
    {
      id: "EMP003",
      nombre: "Elena Gómez",
      rol: "Diseñadora UX/UI",
      avatar: "/placeholder.svg?height=40&width=40",
      horasAsignadas: 1600,
      horasRegistradas: 1520,
      utilizacion: 95,
      proyectos: [
        { nombre: "Portal cliente Banco Nacional", horas: 380, id: "PRJ001" },
        { nombre: "App móvil Seguros Unidos", horas: 620, id: "PRJ003" },
        { nombre: "Plataforma e-learning", horas: 240, id: "PRJ002" },
        { nombre: "Formación interna", horas: 120, id: "INT001" },
        { nombre: "Reuniones", horas: 160, id: "INT002" },
      ],
      mesesActivos: 10,
      rendimiento: 92,
    },
    {
      id: "EMP004",
      nombre: "Javier López",
      rol: "DevOps",
      avatar: "/placeholder.svg?height=40&width=40",
      horasAsignadas: 1920,
      horasRegistradas: 1950,
      utilizacion: 102,
      proyectos: [
        { nombre: "Plataforma e-learning", horas: 520, id: "PRJ002" },
        { nombre: "App móvil Seguros Unidos", horas: 480, id: "PRJ003" },
        { nombre: "Migración Base de Datos", horas: 450, id: "PRJ005" },
        { nombre: "Soporte", horas: 500, id: "SUP001" },
      ],
      mesesActivos: 12,
      rendimiento: 99,
    },
    {
      id: "EMP005",
      nombre: "Laura Sánchez",
      rol: "QA Tester",
      avatar: "/placeholder.svg?height=40&width=40",
      horasAsignadas: 1920,
      horasRegistradas: 1840,
      utilizacion: 96,
      proyectos: [
        { nombre: "Portal cliente Banco Nacional", horas: 360, id: "PRJ001" },
        { nombre: "Plataforma e-learning", horas: 320, id: "PRJ002" },
        { nombre: "App móvil Seguros Unidos", horas: 420, id: "PRJ003" },
        { nombre: "Sistema de Notificaciones", horas: 280, id: "PRJ004" },
        { nombre: "Migración Base de Datos", horas: 340, id: "PRJ005" },
        { nombre: "Soporte", horas: 120, id: "SUP001" },
      ],
      mesesActivos: 12,
      rendimiento: 94,
    },
    {
      id: "EMP006",
      nombre: "Miguel Torres",
      rol: "Desarrollador Full Stack",
      avatar: "/placeholder.svg?height=40&width=40",
      horasAsignadas: 960,
      horasRegistradas: 980,
      utilizacion: 102,
      proyectos: [
        { nombre: "Portal cliente Banco Nacional", horas: 280, id: "PRJ001" },
        { nombre: "App móvil Seguros Unidos", horas: 320, id: "PRJ003" },
        { nombre: "Sistema de Notificaciones", horas: 380, id: "PRJ004" },
      ],
      mesesActivos: 6,
      rendimiento: 98,
    },
  ]

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedData = [...horasEquipoData].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const getUtilizacionColor = (utilizacion: number) => {
    if (utilizacion > 100) return "text-red-600"
    if (utilizacion > 95) return "text-green-600"
    if (utilizacion > 90) return "text-amber-600"
    return "text-blue-600"
  }

  return (
    <div className="rounded-md border bg-white">
      <div className="p-4 border-b">
        <h3 className="text-lg font-medium">Horas Totales Acumuladas por Miembro del Equipo</h3>
        <p className="text-sm text-gray-500">
          Resumen anual de horas acumuladas durante {year} por cada miembro del equipo
        </p>
      </div>
      <TooltipProvider>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("nombre")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Miembro
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("horasAsignadas")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Horas Asignadas
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("horasRegistradas")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Horas Registradas
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("utilizacion")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Utilización
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("mesesActivos")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Meses Activos
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("rendimiento")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Rendimiento
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((miembro) => (
              <TableRow key={miembro.id}>
                <TableCell className="font-medium">{miembro.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={miembro.avatar || "/placeholder.svg"} alt={miembro.nombre} />
                      <AvatarFallback>
                        {miembro.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{miembro.nombre}</span>
                  </div>
                </TableCell>
                <TableCell>{miembro.rol}</TableCell>
                <TableCell>{miembro.horasAsignadas}</TableCell>
                <TableCell>{miembro.horasRegistradas}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${getUtilizacionColor(miembro.utilizacion)}`}>
                        {miembro.utilizacion}%
                      </span>
                    </div>
                    <Progress
                      value={miembro.utilizacion}
                      className="h-2"
                      indicatorClassName={
                        miembro.utilizacion > 100
                          ? "bg-red-500"
                          : miembro.utilizacion > 95
                            ? "bg-green-500"
                            : miembro.utilizacion > 90
                              ? "bg-amber-500"
                              : "bg-blue-500"
                      }
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{miembro.mesesActivos}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-sm font-medium ${miembro.rendimiento > 95 ? "text-green-600" : "text-amber-600"}`}
                      >
                        {miembro.rendimiento}%
                      </span>
                    </div>
                    <Progress
                      value={miembro.rendimiento}
                      className="h-2"
                      indicatorClassName={
                        miembro.rendimiento > 95
                          ? "bg-green-500"
                          : miembro.rendimiento > 90
                            ? "bg-amber-500"
                            : "bg-blue-500"
                      }
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" /> Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2" /> Ver gráficos
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <Download className="h-4 w-4 mr-2" /> Exportar datos
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TooltipProvider>
      <div className="p-4 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">Mostrando {horasEquipoData.length} miembros del equipo</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-2" /> Ver gráfico anual
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" /> Exportar informe
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
