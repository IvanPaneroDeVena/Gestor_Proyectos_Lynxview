"use client"

import { useState } from "react"
import { Download, FileSpreadsheet, Filter, Printer, RefreshCw, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { HorasEquipoMensualTable } from "@/components/horas-equipo-mensual-table"
import { HorasEquipoTotalTable } from "@/components/horas-equipo-total-table"
import { EquipoFacturacionFilters } from "@/components/equipo-facturacion-filters"
import { EquipoFacturacionSummary } from "@/components/equipo-facturacion-summary"
import { EquipoFacturacionChart } from "@/components/equipo-facturacion-chart"

export default function FacturacionEquipoPage() {
  const [selectedMonth, setSelectedMonth] = useState("5")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedView, setSelectedView] = useState("mensual")

  // Datos de ejemplo para los meses
  const months = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ]

  // Datos de ejemplo para los años
  const years = [
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ]

  // Función para obtener el nombre del mes
  const getMonthName = (monthValue: string) => {
    const month = months.find((m) => m.value === monthValue)
    return month ? month.label : ""
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Facturación Equipo</h1>
        <p className="text-muted-foreground">
          Gestiona y analiza las horas facturables por miembro del equipo, tanto mensuales como totales.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-md">
            <Download className="mr-2 h-4 w-4" /> Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1 space-y-6">
          <EquipoFacturacionFilters />
          <EquipoFacturacionSummary month={getMonthName(selectedMonth)} year={selectedYear} />
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-teal-600" />
                    <CardTitle>
                      Horas del Equipo - {getMonthName(selectedMonth)} {selectedYear}
                    </CardTitle>
                  </div>
                  <CardDescription>
                    Datos importados de Jira{" "}
                    <Badge variant="outline" className="ml-2">
                      Última actualización: Hoy, 10:30
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="mensual">Horas Mensuales</TabsTrigger>
                  <TabsTrigger value="total">Horas Totales</TabsTrigger>
                </TabsList>

                <TabsContent value="mensual" className="space-y-4">
                  <HorasEquipoMensualTable month={selectedMonth} year={selectedYear} />
                  <EquipoFacturacionChart type="mensual" month={selectedMonth} year={selectedYear} />
                </TabsContent>

                <TabsContent value="total" className="space-y-4">
                  <HorasEquipoTotalTable year={selectedYear} />
                  <EquipoFacturacionChart type="total" year={selectedYear} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
