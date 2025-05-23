import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function FacturacionFilters() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search-facturacion">Buscar</Label>
          <div className="flex gap-2">
            <Input id="search-facturacion" placeholder="Proyecto, cliente..." />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Estado de facturación</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-pendientes" className="text-xs">
                Pendientes
              </Label>
              <Switch id="show-pendientes" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-enviadas" className="text-xs">
                Enviadas
              </Label>
              <Switch id="show-enviadas" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-parciales" className="text-xs">
                Pagadas parcialmente
              </Label>
              <Switch id="show-parciales" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-pagadas" className="text-xs">
                Pagadas
              </Label>
              <Switch id="show-pagadas" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-retrasadas" className="text-xs">
                Retrasadas
              </Label>
              <Switch id="show-retrasadas" defaultChecked />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Filtrar por cliente</h4>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Todos los clientes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los clientes</SelectItem>
              <SelectItem value="ayr">Empresa AYR</SelectItem>
              <SelectItem value="gsw">GSW Artesanía</SelectItem>
              <SelectItem value="adpoint">Club Deportivo ADPOINT</SelectItem>
              <SelectItem value="tecno">Tecnologías Avanzadas S.L.</SelectItem>
              <SelectItem value="banco">Banco Nacional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Filtrar por proyecto</h4>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Todos los proyectos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los proyectos</SelectItem>
              <SelectItem value="PRJ001">AYR sistema de domótica</SelectItem>
              <SelectItem value="PRJ002">GSW Tienda de pinceles</SelectItem>
              <SelectItem value="PRJ003">ADPOINT Pádel</SelectItem>
              <SelectItem value="PRJ004">Sistema de Notificaciones</SelectItem>
              <SelectItem value="PRJ005">Migración Base de Datos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Rango de importes</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="min-importe" className="text-xs">
                Mínimo (€)
              </Label>
              <Input id="min-importe" type="number" placeholder="0" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="max-importe" className="text-xs">
                Máximo (€)
              </Label>
              <Input id="max-importe" type="number" placeholder="10000" />
            </div>
          </div>
        </div>

        <Button className="w-full">Aplicar filtros</Button>
      </CardContent>
    </Card>
  )
}
