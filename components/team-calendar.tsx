"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWeekend } from "date-fns"
import { es } from "date-fns/locale"

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

interface TeamCalendarProps {
  currentDate: Date
  teamMembers: TeamMember[]
  projects: Project[]
}

interface CalendarEvent {
  id: string
  title: string
  date: Date
  memberId: string
  projectId?: string
  type: "assignment" | "vacation" | "holiday" | "meeting"
  allocation?: number
}

export function TeamCalendar({ currentDate, teamMembers, projects }: TeamCalendarProps) {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

  // Generar eventos de ejemplo
  useEffect(() => {
    const events: CalendarEvent[] = []
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Asignaciones a proyectos
    teamMembers.forEach((member) => {
      // Proyecto 1 - AYR sistema de domótica
      if (member.id === "1" || member.id === "2" || member.id === "3") {
        const startDay = Math.floor(Math.random() * 10) + 1
        const endDay = Math.min(startDay + 14, daysInMonth.length)
        for (let i = startDay; i < endDay; i++) {
          if (!isWeekend(daysInMonth[i])) {
            events.push({
              id: `assignment-${member.id}-PRJ001-${i}`,
              title: "AYR sistema de domótica",
              date: daysInMonth[i],
              memberId: member.id,
              projectId: "PRJ001",
              type: "assignment",
              allocation: member.id === "1" ? 100 : member.id === "2" ? 50 : 25,
            })
          }
        }
      }

      // Proyecto 2 - GSW Tienda de pinceles
      if (member.id === "2" || member.id === "4") {
        const startDay = Math.floor(Math.random() * 5) + 10
        const endDay = Math.min(startDay + 10, daysInMonth.length)
        for (let i = startDay; i < endDay; i++) {
          if (!isWeekend(daysInMonth[i])) {
            events.push({
              id: `assignment-${member.id}-PRJ002-${i}`,
              title: "GSW Tienda de pinceles",
              date: daysInMonth[i],
              memberId: member.id,
              projectId: "PRJ002",
              type: "assignment",
              allocation: member.id === "2" ? 50 : 75,
            })
          }
        }
      }

      // Proyecto 3 - ADPOINT Pádel
      if (member.id === "3" || member.id === "5") {
        const startDay = Math.floor(Math.random() * 5) + 15
        const endDay = Math.min(startDay + 12, daysInMonth.length)
        for (let i = startDay; i < endDay; i++) {
          if (!isWeekend(daysInMonth[i])) {
            events.push({
              id: `assignment-${member.id}-PRJ003-${i}`,
              title: "ADPOINT Pádel",
              date: daysInMonth[i],
              memberId: member.id,
              projectId: "PRJ003",
              type: "assignment",
              allocation: member.id === "3" ? 75 : 50,
            })
          }
        }
      }

      // Vacaciones
      const vacationStartDay = Math.floor(Math.random() * 20) + 1
      const vacationLength = Math.floor(Math.random() * 5) + 1
      for (let i = 0; i < vacationLength; i++) {
        if (vacationStartDay + i < daysInMonth.length) {
          events.push({
            id: `vacation-${member.id}-${vacationStartDay + i}`,
            title: "Vacaciones",
            date: daysInMonth[vacationStartDay + i],
            memberId: member.id,
            type: "vacation",
          })
        }
      }

      // Reuniones
      const meetingDays = [5, 12, 19, 26] // Reuniones semanales
      meetingDays.forEach((day) => {
        if (day < daysInMonth.length) {
          events.push({
            id: `meeting-${member.id}-${day}`,
            title: "Reunión de equipo",
            date: daysInMonth[day],
            memberId: member.id,
            type: "meeting",
          })
        }
      })
    })

    // Días festivos (para todos los miembros)
    const holidays = [15, 25] // Días festivos del mes
    holidays.forEach((day) => {
      if (day < daysInMonth.length) {
        teamMembers.forEach((member) => {
          events.push({
            id: `holiday-${member.id}-${day}`,
            title: "Día festivo",
            date: daysInMonth[day],
            memberId: member.id,
            type: "holiday",
          })
        })
      }
    })

    setCalendarEvents(events)
  }, [currentDate, teamMembers, projects])

  // Función para obtener eventos de un día específico para un miembro
  const getEventsForDay = (date: Date, memberId: string) => {
    return calendarEvents.filter((event) => isSameDay(event.date, date) && event.memberId === memberId)
  }

  // Función para calcular la disponibilidad total de un miembro en un día
  const calculateDailyAvailability = (date: Date, memberId: string) => {
    const events = getEventsForDay(date, memberId)

    // Si hay vacaciones o día festivo, disponibilidad 0%
    if (events.some((event) => event.type === "vacation" || event.type === "holiday")) {
      return 0
    }

    // Sumar todas las asignaciones
    const totalAllocation = events.reduce((sum, event) => {
      return sum + (event.allocation || 0)
    }, 0)

    return Math.max(0, 100 - totalAllocation)
  }

  // Función para obtener el color de fondo según la disponibilidad
  const getAvailabilityColor = (availability: number) => {
    if (availability === 0) return "bg-red-100"
    if (availability <= 25) return "bg-red-50"
    if (availability <= 50) return "bg-amber-50"
    if (availability <= 75) return "bg-green-50"
    return "bg-emerald-50"
  }

  // Función para renderizar el contenido de una celda del calendario
  const renderCellContent = (date: Date, memberId: string) => {
    const events = getEventsForDay(date, memberId)
    const availability = calculateDailyAvailability(date, memberId)

    return (
      <div className={`h-full w-full p-1 ${getAvailabilityColor(availability)}`}>
        <div className="flex flex-col h-full">
          <div className="text-xs font-medium mb-1">{format(date, "d")}</div>
          <div className="flex-1 overflow-hidden">
            {events.map((event) => {
              const project = projects.find((p) => p.id === event.projectId)

              if (event.type === "vacation") {
                return (
                  <Badge
                    key={event.id}
                    variant="outline"
                    className="bg-blue-100 border-blue-200 text-[8px] mb-1 block truncate"
                  >
                    Vacaciones
                  </Badge>
                )
              }

              if (event.type === "holiday") {
                return (
                  <Badge
                    key={event.id}
                    variant="outline"
                    className="bg-purple-100 border-purple-200 text-[8px] mb-1 block truncate"
                  >
                    Festivo
                  </Badge>
                )
              }

              if (event.type === "meeting") {
                return (
                  <Badge
                    key={event.id}
                    variant="outline"
                    className="bg-gray-100 border-gray-200 text-[8px] mb-1 block truncate"
                  >
                    Reunión
                  </Badge>
                )
              }

              if (project) {
                return (
                  <Badge
                    key={event.id}
                    variant="outline"
                    className="text-[8px] mb-1 block truncate"
                    style={{
                      backgroundColor: `${project.color}20`,
                      borderColor: `${project.color}40`,
                      color: project.color,
                    }}
                  >
                    {event.allocation}% {project.name.split(" ")[0]}
                  </Badge>
                )
              }

              return null
            })}
          </div>
          <div className="mt-auto">
            <Progress value={100 - availability} className="h-1" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 border bg-muted/50 w-[200px]">Miembro</th>
            {Array.from({ length: 31 }, (_, i) => {
              const day = addDays(startOfMonth(currentDate), i)
              if (day.getMonth() !== currentDate.getMonth()) return null
              return (
                <th
                  key={i}
                  className={`p-2 border text-center w-[40px] ${isWeekend(day) ? "bg-muted/30" : "bg-muted/10"}`}
                >
                  <div className="text-xs font-medium">{format(day, "EEE", { locale: es })}</div>
                  <div className="text-xs">{format(day, "d")}</div>
                </th>
              )
            }).filter(Boolean)}
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((member) => (
            <tr key={member.id}>
              <td className="p-2 border">
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
                  <div>
                    <div className="text-sm font-medium">{member.name}</div>
                    <div className="text-xs text-muted-foreground">{member.role}</div>
                  </div>
                </div>
              </td>
              {Array.from({ length: 31 }, (_, i) => {
                const day = addDays(startOfMonth(currentDate), i)
                if (day.getMonth() !== currentDate.getMonth()) return null

                return (
                  <td key={i} className={`border p-0 ${isWeekend(day) ? "bg-muted/20" : ""}`}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className="h-[60px] w-[40px] cursor-pointer"
                            onMouseEnter={() => setHoveredDate(day)}
                            onMouseLeave={() => setHoveredDate(null)}
                          >
                            {renderCellContent(day, member.id)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-2">
                            <div className="font-medium">{format(day, "EEEE d 'de' MMMM", { locale: es })}</div>
                            <div className="text-sm">{member.name}</div>
                            <div className="text-xs">Disponibilidad: {calculateDailyAvailability(day, member.id)}%</div>
                            {getEventsForDay(day, member.id).map((event) => (
                              <div key={event.id} className="text-xs flex items-center gap-1">
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{
                                    backgroundColor: event.projectId
                                      ? projects.find((p) => p.id === event.projectId)?.color || "#888"
                                      : event.type === "vacation"
                                        ? "#3b82f6"
                                        : event.type === "holiday"
                                          ? "#8b5cf6"
                                          : "#6b7280",
                                  }}
                                ></div>
                                <span>
                                  {event.title}
                                  {event.allocation ? ` (${event.allocation}%)` : ""}
                                </span>
                              </div>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                )
              }).filter(Boolean)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
