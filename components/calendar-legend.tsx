import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CalendarLegend() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Leyenda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Tipos de eventos</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-500"></div>
              <span className="text-xs">Asignación</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-xs">Vacaciones</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-400"></div>
              <span className="text-xs">Día festivo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-500"></div>
              <span className="text-xs">Reunión</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Disponibilidad</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-red-100"></div>
              <span className="text-xs">0% (No disponible)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-red-50"></div>
              <span className="text-xs">1-25% (Baja)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-amber-50"></div>
              <span className="text-xs">26-50% (Media)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-50"></div>
              <span className="text-xs">51-75% (Alta)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-emerald-50"></div>
              <span className="text-xs">76-100% (Completa)</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Proyectos</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#6D28D9" }}></div>
              <span className="text-xs">AYR sistema de domótica</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#2563EB" }}></div>
              <span className="text-xs">GSW Tienda de pinceles</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#10B981" }}></div>
              <span className="text-xs">ADPOINT Pádel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "#F97316" }}></div>
              <span className="text-xs">Sistema de Notificaciones</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
