import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface EquipoFacturacionSummaryProps {
  month: string
  year: string
}

export function EquipoFacturacionSummary({ month, year }: EquipoFacturacionSummaryProps) {
  // Datos de ejemplo para el resumen
  const summaryData = {
    totalMiembros: 12,
    miembrosActivos: 10,
    horasAsignadas: 1600,
    horasRegistradas: 1550,
    utilizacionPromedio: 97,
    rendimientoPromedio: 95,
    distribucionRoles: [
      { rol: "Desarrollador Frontend", porcentaje: 30 },
      { rol: "Desarrollador Backend", porcentaje: 25 },
      { rol: "Diseñador UX/UI", porcentaje: 15 },
      { rol: "DevOps", porcentaje: 10 },
      { rol: "QA Tester", porcentaje: 15 },
      { rol: "Otros", porcentaje: 5 },
    ],
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Resumen</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Miembros del equipo</span>
            <span className="font-medium">{summaryData.totalMiembros}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Miembros activos</span>
            <span className="font-medium">{summaryData.miembrosActivos}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Horas asignadas</span>
            <span className="font-medium">{summaryData.horasAsignadas}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Horas registradas</span>
            <span className="font-medium">{summaryData.horasRegistradas}</span>
          </div>
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-medium">Utilización promedio</span>
          <div className="flex items-center justify-between">
            <Progress value={summaryData.utilizacionPromedio} className="h-2" />
            <span className="ml-2 text-sm font-medium text-green-600">{summaryData.utilizacionPromedio}%</span>
          </div>
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-medium">Rendimiento promedio</span>
          <div className="flex items-center justify-between">
            <Progress value={summaryData.rendimientoPromedio} className="h-2" />
            <span className="ml-2 text-sm font-medium text-green-600">{summaryData.rendimientoPromedio}%</span>
          </div>
        </div>

        <div className="grid gap-2">
          <span className="text-sm font-medium">Distribución por roles</span>
          {summaryData.distribucionRoles.map((item, index) => (
            <div key={index} className="grid gap-1">
              <div className="flex items-center justify-between text-xs">
                <span>{item.rol}</span>
                <span>{item.porcentaje}%</span>
              </div>
              <Progress value={item.porcentaje} className="h-1" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
