"use client"

import type React from "react"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function CreateProjectFAB() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpen(false)
    // En una aplicación real, aquí enviaríamos los datos a la API
    // Por ahora, simplemente redirigimos a la página de proyectos
    router.push("/proyectos")
  }

  return (
    <div className="fixed bottom-6 right-6 z-10">
      <div className="fixed bottom-4 right-4 md:hidden">
        <Button asChild size="icon" className="h-14 w-14 rounded-full bg-teal-600 hover:bg-teal-700 shadow-lg">
          <Link href="/proyectos/nuevo">
            <Plus className="h-6 w-6" />
            <span className="sr-only">Crear nuevo proyecto</span>
          </Link>
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg bg-purple-700 hover:bg-purple-800 text-white border-2 border-white hidden md:block"
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Crear nuevo</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link href="/proyectos/nuevo" className="cursor-pointer">
              Crear proyecto completo
            </Link>
          </DropdownMenuItem>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Crear proyecto rápido</DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Crear Proyecto Rápido</DialogTitle>
                <DialogDescription>
                  Crea un nuevo proyecto con la información básica. Podrás completar los detalles más tarde.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre-fab">Nombre del Proyecto</Label>
                    <Input id="nombre-fab" placeholder="Ej: Portal de Clientes v2.0" autoFocus />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion-fab">Descripción</Label>
                    <Textarea
                      id="descripcion-fab"
                      placeholder="Describe el proyecto y sus objetivos principales"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Estado</Label>
                      <Select defaultValue="planificacion">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planificacion">Planificación</SelectItem>
                          <SelectItem value="progreso">En Progreso</SelectItem>
                          <SelectItem value="revision">En Revisión</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Prioridad</Label>
                      <Select defaultValue="media">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="baja">Baja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white font-medium">
                    Crear Proyecto
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
