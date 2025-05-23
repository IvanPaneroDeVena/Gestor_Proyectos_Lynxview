import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

export function EquipoFacturacionFilters() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Filtros</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="search-miembros">Buscar miembros</Label>
            <Button variant="ghost" size="icon" className="h-4 w-4">
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex w-full items-center space-x-2">
            <Input id="search-miembros" placeholder="Nombre o ID..." />
            <Button type="submit" size="sm" className="px-3">
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Rol</Label>
          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="rol-frontend" />
              <label htmlFor="rol-frontend" className="text-sm font-normal">
                Frontend
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="rol-backend" />
              <label htmlFor="rol-backend" className="text-sm font-normal">
                Backend
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="rol-ux" />
              <label htmlFor="rol-ux" className="text-sm font-normal">
                UX/UI
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="rol-devops" />
              <label htmlFor="rol-devops" className="text-sm font-normal">
                DevOps
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="rol-qa" />
              <label htmlFor="rol-qa" className="text-sm font-normal">
                QA
              </label>
            </div>
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Utilización</Label>
          <RadioGroup defaultValue="todos">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="todos" id="utilizacion-todos" />
              <Label htmlFor="utilizacion-todos" className="font-normal">
                Todos
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="alta" id="utilizacion-alta" />
              <Label htmlFor="utilizacion-alta" className="font-normal">
                Alta &gt;95%
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="media" id="utilizacion-media" />
              <Label htmlFor="utilizacion-media" className="font-normal">
                Media 80-95%
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="baja" id="utilizacion-baja" />
              <Label htmlFor="utilizacion-baja" className="font-normal">
                Baja &lt;80%
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label>Rango de horas</Label>
            <span className="text-xs text-muted-foreground">0-200</span>
          </div>
          <Slider defaultValue={[0, 200]} max={200} step={1} />
        </div>

        <div className="grid gap-2">
          <Label>Proyectos</Label>
          <div className="grid gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="proyecto-banco" />
              <label htmlFor="proyecto-banco" className="text-sm font-normal">
                Portal Banco Nacional
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="proyecto-elearning" />
              <label htmlFor="proyecto-elearning" className="text-sm font-normal">
                Plataforma e-learning
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="proyecto-app" />
              <label htmlFor="proyecto-app" className="text-sm font-normal">
                App móvil Seguros
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="proyecto-notificaciones" />
              <label htmlFor="proyecto-notificaciones" className="text-sm font-normal">
                Sistema Notificaciones
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm">
            Limpiar filtros
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700" size="sm">
            Aplicar filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
