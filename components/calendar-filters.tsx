import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function CalendarFilters() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Opciones de visualización</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Mostrar eventos</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-assignments" className="text-xs">
                Asignaciones
              </Label>
              <Switch id="show-assignments" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-vacations" className="text-xs">
                Vacaciones
              </Label>
              <Switch id="show-vacations" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-holidays" className="text-xs">
                Días festivos
              </Label>
              <Switch id="show-holidays" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-meetings" className="text-xs">
                Reuniones
              </Label>
              <Switch id="show-meetings" defaultChecked />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Opciones de disponibilidad</h4>
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="availability-threshold" className="text-xs">
                Umbral de alerta
              </Label>
              <Select defaultValue="25">
                <SelectTrigger id="availability-threshold">
                  <SelectValue placeholder="Seleccionar umbral" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10% o menos</SelectItem>
                  <SelectItem value="25">25% o menos</SelectItem>
                  <SelectItem value="50">50% o menos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="highlight-conflicts" className="text-xs">
                Resaltar conflictos
              </Label>
              <Switch id="highlight-conflicts" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-weekends" className="text-xs">
                Mostrar fines de semana
              </Label>
              <Switch id="show-weekends" defaultChecked />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Exportar</h4>
          <div className="grid grid-cols-2 gap-2">
            <Select defaultValue="month">
              <SelectTrigger>
                <SelectValue placeholder="Periodo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mes</SelectItem>
                <SelectItem value="quarter">Este trimestre</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="pdf">
              <SelectTrigger>
                <SelectValue placeholder="Formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
