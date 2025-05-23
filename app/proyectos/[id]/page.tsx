import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  FileText,
  MessageSquare,
  Plus,
  Code,
  Database,
  Globe,
  Server,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProjectTasksTable } from "@/components/project-tasks-table"
import { Separator } from "@/components/ui/separator"

export default function ProyectoDetallePage({ params }: { params: { id: string } }) {
  // En una aplicación real, aquí cargaríamos los datos del proyecto desde una API o base de datos
  const proyecto = {
    id: params.id,
    nombre: "AYR sistema de domótica",
    descripcion:
      "Sistema de domótica para abrir puertas con reconocimiento facial y control remoto. El proyecto incluye desarrollo de hardware, software de control y aplicación móvil para gestión de accesos.",
    estado: "En progreso",
    progreso: 75,
    fechaInicio: "01/01/2025",
    fechaFin: "15/06/2025",
    prioridad: "Alta",
    cliente: "Empresa AYR",
    presupuesto: "€60,000",
    horasEstimadas: 1200,
    horasRegistradas: 900,
    technologies: {
      frontend: ["React", "TypeScript", "Tailwind CSS", "Redux"],
      backend: ["Node.js", "Express", "WebSockets"],
      database: ["MongoDB", "Redis"],
      other: ["Arduino", "Raspberry Pi", "JWT", "Docker"],
    },
    equipo: [
      {
        nombre: "Ana Martínez",
        rol: "Desarrolladora Frontend (React)",
        avatar: "/placeholder.svg?height=40&width=40",
        technologies: ["React", "TypeScript", "Tailwind CSS", "Redux"],
      },
      {
        nombre: "Carlos Ruiz",
        rol: "Desarrollador Backend (Node.js)",
        avatar: "/placeholder.svg?height=40&width=40",
        technologies: ["Node.js", "Express", "MongoDB", "WebSockets"],
      },
      {
        nombre: "Elena Gómez",
        rol: "Diseñadora UX/UI (Figma)",
        avatar: "/placeholder.svg?height=40&width=40",
        technologies: ["Figma", "Adobe XD", "HTML/CSS"],
      },
      {
        nombre: "Javier López",
        rol: "DevOps (Docker)",
        avatar: "/placeholder.svg?height=40&width=40",
        technologies: ["Docker", "CI/CD", "AWS", "Kubernetes"],
      },
      {
        nombre: "Laura Sánchez",
        rol: "QA Tester (Cypress)",
        avatar: "/placeholder.svg?height=40&width=40",
        technologies: ["Cypress", "Jest", "Selenium", "Postman"],
      },
    ],
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/proyectos">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight gradient-text">{proyecto.nombre}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge>{proyecto.estado}</Badge>
            <span className="text-sm text-muted-foreground">ID: {proyecto.id}</span>
          </div>
        </div>
        <Button className="bg-purple-700 hover:bg-purple-800 text-white font-medium shadow-md">
          <Edit className="mr-2 h-4 w-4" /> Editar Proyecto
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Descripción</h3>
              <p className="text-sm text-muted-foreground">{proyecto.descripcion}</p>
            </div>

            <div>
              <h3 className="font-medium mb-3">Tecnologías</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">Frontend</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {proyecto.technologies.frontend.map((tech, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-sm">Backend</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {proyecto.technologies.backend.map((tech, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-sm">Base de datos</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {proyecto.technologies.database.map((tech, index) => (
                      <Badge key={index} variant="outline" className="bg-purple-50">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-sm">Otras tecnologías</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {proyecto.technologies.other.map((tech, index) => (
                      <Badge key={index} variant="outline" className="bg-orange-50">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-medium mb-2">Detalles</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Cliente:</dt>
                    <dd>{proyecto.cliente}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Prioridad:</dt>
                    <dd>{proyecto.prioridad}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Presupuesto:</dt>
                    <dd>{proyecto.presupuesto}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="font-medium mb-2">Fechas</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Fecha de inicio:</dt>
                    <dd>{proyecto.fechaInicio}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Fecha límite:</dt>
                    <dd>{proyecto.fechaFin}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Duración:</dt>
                    <dd>165 días</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Progreso</h3>
                <span className="text-sm font-medium">{proyecto.progreso}%</span>
              </div>
              <Progress value={proyecto.progreso} className="h-2" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple to-brand-blue text-white">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold">{proyecto.horasRegistradas}</div>
                  <div className="text-sm text-muted-foreground">Horas registradas</div>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-lg border p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-cyan text-white">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-xl font-bold">24</div>
                  <div className="text-sm text-muted-foreground">Tareas totales</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Equipo del Proyecto</CardTitle>
            <CardDescription>{proyecto.equipo.length} miembros asignados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <Button variant="outline" size="sm">
                Ver todos
              </Button>
              <Button size="sm">
                <Plus className="mr-1 h-3 w-3" /> Añadir
              </Button>
            </div>
            <div className="space-y-4">
              {proyecto.equipo.map((miembro, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={miembro.avatar || "/placeholder.svg"} alt={miembro.nombre} />
                      <AvatarFallback>
                        {miembro.nombre
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{miembro.nombre}</div>
                      <div className="text-xs text-muted-foreground">{miembro.rol}</div>
                    </div>
                  </div>
                  <div className="ml-9">
                    <div className="flex flex-wrap gap-1">
                      {miembro.technologies.slice(0, 3).map((tech, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-blue-50">
                          {tech}
                        </Badge>
                      ))}
                      {miembro.technologies.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{miembro.technologies.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tareas" className="w-full">
        <TabsList>
          <TabsTrigger value="tareas">Tareas</TabsTrigger>
          <TabsTrigger value="archivos">Archivos</TabsTrigger>
          <TabsTrigger value="comentarios">Comentarios</TabsTrigger>
          <TabsTrigger value="actividad">Actividad</TabsTrigger>
        </TabsList>
        <TabsContent value="tareas" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Tareas del Proyecto</h2>
            <Button className="bg-purple-700 hover:bg-purple-800 text-white font-medium shadow-sm">
              <Plus className="mr-2 h-4 w-4" /> Nueva Tarea
            </Button>
          </div>
          <ProjectTasksTable projectId={params.id} />
        </TabsContent>
        <TabsContent value="archivos">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No hay archivos todavía</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Sube archivos relacionados con este proyecto</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Subir Archivos
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="comentarios">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No hay comentarios todavía</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Inicia una conversación sobre este proyecto</p>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Añadir Comentario
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="actividad">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Historial de actividad</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Aquí se mostrará el historial de actividad del proyecto
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
