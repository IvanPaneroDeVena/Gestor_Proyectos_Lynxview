"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  availability: number
}

interface Project {
  id: string
  name: string
  color: string
}

interface AddEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  teamMembers: TeamMember[]
  projects: Project[]
}

export function AddEventDialog({ open, onOpenChange, teamMembers, projects }: AddEventDialogProps) {
  const [eventType, setEventType] = useState<string>("assignment")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [selectedMember, setSelectedMember] = useState<string>("")
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [allocation, setAllocation] = useState<number[]>([100])
  const [title, setTitle] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  const handleSubmit = () => {
    // Aquí iría la lógica para guardar el evento
    console.log({
      type: eventType,
      startDate: selectedDate,
      endDate,
      memberId: selectedMember,
      projectId: selectedProject,
      allocation: allocation[0],
      title,
      description,
    })

    // Reiniciar el formulario
    setEventType("assignment")
    setSelectedDate(new Date())
    setEndDate(new Date())
    setSelectedMember("")
    setSelectedProject("")
    setAllocation([100])
    setTitle("")
    setDescription("")

    // Cerrar el diálogo
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Añadir Evento al Calendario</DialogTitle>
          <DialogDescription>Crea un nuevo evento para gestionar la disponibilidad del equipo.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="event-type">Tipo de Evento</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger id="event-type">
                <SelectValue placeholder="Selecciona un tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assignment">Asignación a proyecto</SelectItem>
                <SelectItem value="vacation">Vacaciones</SelectItem>
                <SelectItem value="holiday">Día festivo</SelectItem>
                <SelectItem value="meeting">Reunión</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha de fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => (selectedDate ? date < selectedDate : false)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="member">Miembro del equipo</Label>
            <Select value={selectedMember} onValueChange={setSelectedMember}>
              <SelectTrigger id="member">
                <SelectValue placeholder="Selecciona un miembro" />
              </SelectTrigger>
              <SelectContent>
                {teamMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span>{member.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {member.role} - Disponibilidad: {member.availability}%
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {eventType === "assignment" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="project">Proyecto</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Selecciona un proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }}></div>
                          <span>{project.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="allocation">Asignación (%)</Label>
                  <span className="font-medium">{allocation[0]}%</span>
                </div>
                <Slider id="allocation" value={allocation} onValueChange={setAllocation} max={100} step={10} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder={
                eventType === "assignment"
                  ? "Ej: Desarrollo de funcionalidad X"
                  : eventType === "vacation"
                    ? "Ej: Vacaciones de verano"
                    : eventType === "holiday"
                      ? "Ej: Día festivo nacional"
                      : "Ej: Reunión semanal de equipo"
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Añade detalles adicionales sobre este evento"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-purple-700 hover:bg-purple-800">
            Guardar Evento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
