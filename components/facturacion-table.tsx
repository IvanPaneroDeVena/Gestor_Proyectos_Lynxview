"use client"

import { useState } from "react"
import { ArrowUpDown, MoreHorizontal, FileText, Send, Download, AlertCircle, Eye, Printer } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { FacturaPreviewModal } from "@/components/factura-preview-modal"

interface FacturacionTableProps {
  month: string
  year: string
}

export function FacturacionTable({ month, year }: FacturacionTableProps) {
  const [sortColumn, setSortColumn] = useState("proyecto")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedFactura, setSelectedFactura] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Datos de ejemplo para la facturación
  const facturacionData = [
    {
      id: "FAC-001",
      proyecto: "AYR sistema de domótica",
      cliente: "Empresa AYR",
      clienteInfo: {
        nombre: "Empresa AYR S.L.",
        direccion: "Calle Innovación, 123",
        ciudad: "Madrid",
        codigoPostal: "28001",
        cif: "B12345678",
        email: "facturacion@ayr.com",
        telefono: "+34 910 123 456",
      },
      horas: 120,
      tarifa: 65,
      importe: 7800,
      estado: "Pendiente",
      fechaEmision: "15/05/2025",
      fechaVencimiento: "15/06/2025",
      progreso: 0,
      detalles: [
        { concepto: "Desarrollo Frontend", horas: 45, tarifa: 65, importe: 2925 },
        { concepto: "Desarrollo Backend", horas: 35, tarifa: 65, importe: 2275 },
        { concepto: "Diseño UX/UI", horas: 40, tarifa: 65, importe: 2600 },
      ],
      impuestos: 21,
    },
    {
      id: "FAC-002",
      proyecto: "GSW Tienda de pinceles",
      cliente: "GSW Artesanía",
      clienteInfo: {
        nombre: "GSW Artesanía S.L.",
        direccion: "Avenida de los Artesanos, 45",
        ciudad: "Barcelona",
        codigoPostal: "08001",
        cif: "B87654321",
        email: "contabilidad@gsw.com",
        telefono: "+34 933 456 789",
      },
      horas: 85,
      tarifa: 55,
      importe: 4675,
      estado: "Enviada",
      fechaEmision: "10/05/2025",
      fechaVencimiento: "10/06/2025",
      progreso: 0,
      detalles: [
        { concepto: "Desarrollo Frontend", horas: 40, tarifa: 55, importe: 2200 },
        { concepto: "Desarrollo Backend", horas: 45, tarifa: 55, importe: 2475 },
      ],
      impuestos: 21,
    },
    {
      id: "FAC-003",
      proyecto: "ADPOINT Pádel",
      cliente: "Club Deportivo ADPOINT",
      clienteInfo: {
        nombre: "Club Deportivo ADPOINT",
        direccion: "Calle del Deporte, 78",
        ciudad: "Valencia",
        codigoPostal: "46001",
        cif: "G12345678",
        email: "administracion@adpoint.com",
        telefono: "+34 960 789 123",
      },
      horas: 150,
      tarifa: 60,
      importe: 9000,
      estado: "Pagada parcialmente",
      fechaEmision: "05/05/2025",
      fechaVencimiento: "05/06/2025",
      progreso: 50,
      detalles: [
        { concepto: "Desarrollo Frontend", horas: 50, tarifa: 60, importe: 3000 },
        { concepto: "Desarrollo Backend", horas: 60, tarifa: 60, importe: 3600 },
        { concepto: "DevOps", horas: 40, tarifa: 60, importe: 2400 },
      ],
      impuestos: 21,
    },
    {
      id: "FAC-004",
      proyecto: "Sistema de Notificaciones",
      cliente: "Tecnologías Avanzadas S.L.",
      clienteInfo: {
        nombre: "Tecnologías Avanzadas S.L.",
        direccion: "Parque Tecnológico, Edificio 4",
        ciudad: "Sevilla",
        codigoPostal: "41001",
        cif: "B98765432",
        email: "pagos@tecnoavanzadas.com",
        telefono: "+34 954 321 654",
      },
      horas: 40,
      tarifa: 70,
      importe: 2800,
      estado: "Pagada",
      fechaEmision: "01/05/2025",
      fechaVencimiento: "01/06/2025",
      progreso: 100,
      detalles: [{ concepto: "Desarrollo Backend", horas: 40, tarifa: 70, importe: 2800 }],
      impuestos: 21,
    },
    {
      id: "FAC-005",
      proyecto: "Migración Base de Datos",
      cliente: "Banco Nacional",
      clienteInfo: {
        nombre: "Banco Nacional S.A.",
        direccion: "Plaza Financiera, 1",
        ciudad: "Madrid",
        codigoPostal: "28004",
        cif: "A12345678",
        email: "proveedores@banconacional.com",
        telefono: "+34 910 987 654",
      },
      horas: 60,
      tarifa: 80,
      importe: 4800,
      estado: "Retrasada",
      fechaEmision: "20/04/2025",
      fechaVencimiento: "20/05/2025",
      progreso: 0,
      detalles: [
        { concepto: "Desarrollo Backend", horas: 30, tarifa: 80, importe: 2400 },
        { concepto: "DevOps", horas: 30, tarifa: 80, importe: 2400 },
      ],
      impuestos: 21,
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

  const sortedData = [...facturacionData].sort((a, b) => {
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

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80 border border-amber-200"
      case "Enviada":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 border border-blue-200"
      case "Pagada parcialmente":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80 border border-purple-200"
      case "Pagada":
        return "bg-green-100 text-green-800 hover:bg-green-100/80 border border-green-200"
      case "Retrasada":
        return "bg-red-100 text-red-800 hover:bg-red-100/80 border border-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 border border-gray-200"
    }
  }

  const handlePreviewFactura = (factura: any) => {
    setSelectedFactura(factura)
    setIsPreviewOpen(true)
  }

  return (
    <div className="rounded-md border bg-white">
      <TooltipProvider>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("proyecto")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Proyecto
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("horas")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Horas
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Tarifa (€/h)</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("importe")}
                  className="flex items-center gap-1 p-0 font-medium"
                >
                  Importe (€)
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((factura) => (
              <TableRow key={factura.id}>
                <TableCell className="font-medium">{factura.id}</TableCell>
                <TableCell>{factura.proyecto}</TableCell>
                <TableCell>{factura.cliente}</TableCell>
                <TableCell>{factura.horas}</TableCell>
                <TableCell>{factura.tarifa} €/h</TableCell>
                <TableCell className="font-medium">{factura.importe.toLocaleString()} €</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge className={getEstadoColor(factura.estado)}>{factura.estado}</Badge>
                    {factura.progreso > 0 && <Progress value={factura.progreso} className="h-1 w-16" />}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {factura.estado === "Retrasada" ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {factura.fechaVencimiento}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Factura vencida</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      factura.fechaVencimiento
                    )}
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
                      <DropdownMenuItem className="flex items-center" onClick={() => handlePreviewFactura(factura)}>
                        <Eye className="h-4 w-4 mr-2" /> Previsualizar factura
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" /> Editar factura
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <Printer className="h-4 w-4 mr-2" /> Imprimir factura
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <Send className="h-4 w-4 mr-2" /> Enviar al cliente
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <Download className="h-4 w-4 mr-2" /> Descargar PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TooltipProvider>

      {selectedFactura && (
        <FacturaPreviewModal factura={selectedFactura} open={isPreviewOpen} onOpenChange={setIsPreviewOpen} />
      )}
    </div>
  )
}
