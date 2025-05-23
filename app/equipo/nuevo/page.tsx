"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function NuevoMiembroPage() {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [bio, setBio] = useState("")
  const [techInput, setTechInput] = useState("")
  const [technologies, setTechnologies] = useState<string[]>([])
  const [availability, setAvailability] = useState("100")

  // Lista de tecnologías sugeridas
  const suggestedTechnologies = [
    "React",
    "Angular",
    "Vue.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Python",
    "Java",
    "PHP",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Docker",
    "Kubernetes",
    "AWS",
    "GCP",
    "Azure",
    "Figma",
    "Sketch",
    "Adobe XD",
  ]

  const handleAddTechnology = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()])
      setTechInput("")
    }
  }

  const handleAddSuggestedTechnology = (tech: string) => {
    if (!technologies.includes(tech)) {
      setTechnologies([...technologies, tech])
    }
  }

  const handleRemoveTechnology = (tech: string) => {
    setTechnologies(technologies.filter((t) => t !== tech))
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/equipo">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight gradient-text">Nuevo Miembro</h1>
          <p className="text-muted-foreground">Añade un nuevo miembro al equipo</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Introduce los datos básicos del nuevo miembro</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                placeholder="Ej: María García López"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Ej: maria.garcia@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  placeholder="Ej: +34 600 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rol">Rol / Puesto</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Desarrollador/a Frontend</SelectItem>
                  <SelectItem value="backend">Desarrollador/a Backend</SelectItem>
                  <SelectItem value="fullstack">Desarrollador/a Full Stack</SelectItem>
                  <SelectItem value="uxui">Diseñador/a UX/UI</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                  <SelectItem value="qa">QA Tester</SelectItem>
                  <SelectItem value="pm">Project Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                placeholder="Breve descripción profesional"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="disponibilidad">Disponibilidad</Label>
              <Select value={availability} onValueChange={setAvailability}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona disponibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100% - Tiempo completo</SelectItem>
                  <SelectItem value="75">75% - Parcial extendido</SelectItem>
                  <SelectItem value="50">50% - Medio tiempo</SelectItem>
                  <SelectItem value="25">25% - Parcial reducido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
              <CardDescription>Así se verá el perfil del miembro</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt={name || "Nuevo miembro"} />
                <AvatarFallback>{name ? getInitials(name) : "NM"}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-medium">{name || "Nombre del miembro"}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {role === "frontend"
                  ? "Desarrollador/a Frontend"
                  : role === "backend"
                    ? "Desarrollador/a Backend"
                    : role === "fullstack"
                      ? "Desarrollador/a Full Stack"
                      : role === "uxui"
                        ? "Diseñador/a UX/UI"
                        : role === "devops"
                          ? "DevOps"
                          : role === "qa"
                            ? "QA Tester"
                            : role === "pm"
                              ? "Project Manager"
                              : "Rol / Puesto"}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-1">
                {technologies.length > 0 ? (
                  technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs bg-blue-50">
                      {tech}
                    </Badge>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No hay tecnologías añadidas</p>
                )}
              </div>
              <div className="mt-4 text-sm">
                <span className="font-medium">Disponibilidad:</span> {availability}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tecnologías</CardTitle>
              <CardDescription>Añade las tecnologías que domina</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Añadir tecnología..."
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddTechnology()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTechnology}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="flex items-center gap-1 p-1 pr-2">
                    {tech}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 rounded-full"
                      onClick={() => handleRemoveTechnology(tech)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>

              <Separator />

              <div>
                <Label className="mb-2 block">Tecnologías sugeridas</Label>
                <div className="flex flex-wrap gap-2">
                  {suggestedTechnologies
                    .filter((tech) => !technologies.includes(tech))
                    .slice(0, 12)
                    .map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={() => handleAddSuggestedTechnology(tech)}
                      >
                        {tech}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" asChild>
          <Link href="/equipo">Cancelar</Link>
        </Button>
        <Button className="bg-brand-purple hover:bg-brand-purple/90">Guardar Miembro</Button>
      </div>
    </div>
  )
}
