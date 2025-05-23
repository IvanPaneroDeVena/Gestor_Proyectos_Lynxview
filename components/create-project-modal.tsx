"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { createProject } from "@/lib/api/projects"

export function CreateProjectModal() {
  const [projectName, setProjectName] = useState("")
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingresa un nombre para el proyecto",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Usamos un ID de usuario simulado ya que no tenemos autenticación configurada
      await createProject({ name: projectName, createdBy: "user-123" })

      toast({
        title: "Proyecto creado!",
        description: "Redirigiendo...",
      })

      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error: any) {
      toast({
        title: "Algo salió mal.",
        description: error.message || "Error al crear el proyecto",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full px-2 py-1.5 text-sm">Crear proyecto rápido</div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear proyecto rápido</DialogTitle>
          <DialogDescription>Crea un nuevo proyecto para empezar a organizar tus tareas.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input
              id="name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <Button
          onClick={handleCreateProject}
          disabled={isLoading}
          className="bg-purple-700 hover:bg-purple-800 text-white font-medium"
        >
          {isLoading ? "Creando..." : "Crear proyecto"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
