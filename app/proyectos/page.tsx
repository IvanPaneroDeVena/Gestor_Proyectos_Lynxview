import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProjectsTable } from "@/components/projects-table"
import Link from "next/link"

export default function ProyectosPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Proyectos</h1>
        <p className="text-muted-foreground">Gestiona todos los proyectos de software de tu empresa.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input placeholder="Buscar proyectos..." className="max-w-xs" />
          <Select defaultValue="todos">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="activo">Activos</SelectItem>
              <SelectItem value="completado">Completados</SelectItem>
              <SelectItem value="pausado">Pausados</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-purple-700 hover:bg-purple-800 text-white font-medium shadow-md" asChild>
          <Link href="/proyectos/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
          </Link>
        </Button>
      </div>

      <ProjectsTable />
    </div>
  )
}
