import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface FacturacionSummaryProps {
  month: string
  year: string
}

export function FacturacionSummary({ month, year }: FacturacionSummaryProps) {
  // Datos de ejemplo para el resumen de facturación
  const summaryData = {
    totalFacturado: 29075,
    totalPendiente: 12475,
    totalCobrado: 16600,
    totalHoras: 455,
    tarifaPromedio: 63.9,
    proyectosActivos: 5,
    clientesActivos: 5,
    facturasPendientes: 3,
    facturasCobradas: 2,
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>
          Resumen {month} {year}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Facturación</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total facturado:</span>
              <span className="text-sm font-medium">{summaryData.totalFacturado.toLocaleString()} €</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pendiente de cobro:</span>
              <span className="text-sm font-medium text-amber-600">
                {summaryData.totalPendiente.toLocaleString()} €
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cobrado:</span>
              <span className="text-sm font-medium text-green-600">{summaryData.totalCobrado.toLocaleString()} €</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Horas</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total horas:</span>
              <span className="text-sm font-medium">{summaryData.totalHoras}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Tarifa promedio:</span>
              <span className="text-sm font-medium">{summaryData.tarifaPromedio.toFixed(2)} €/h</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Proyectos y Clientes</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Proyectos activos:</span>
              <span className="text-sm font-medium">{summaryData.proyectosActivos}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Clientes activos:</span>
              <span className="text-sm font-medium">{summaryData.clientesActivos}</span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Estado de Facturas</h4>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pendientes:</span>
              <span className="text-sm font-medium text-amber-600">{summaryData.facturasPendientes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cobradas:</span>
              <span className="text-sm font-medium text-green-600">{summaryData.facturasCobradas}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
