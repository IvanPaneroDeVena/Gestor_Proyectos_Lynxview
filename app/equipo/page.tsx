import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TeamTable } from "@/components/team-table"
import Link from "next/link"

export default function EquipoPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Equipo</h1>
        <p className="text-muted-foreground">Gestiona los miembros del equipo y sus asignaciones a proyectos.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input placeholder="Buscar miembros..." className="max-w-xs" />
          <Select defaultValue="todos">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los roles</SelectItem>
              <SelectItem value="frontend">Frontend</SelectItem>
              <SelectItem value="backend">Backend</SelectItem>
              <SelectItem value="diseño">Diseño</SelectItem>
              <SelectItem value="devops">DevOps</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-purple-700 hover:bg-purple-800 text-white font-medium shadow-md" asChild>
          <Link href="/equipo/nuevo">
            <Plus className="mr-2 h-4 w-4" /> Añadir Miembro
          </Link>
        </Button>
      </div>

      <TeamTable />
    </div>
  )
}
