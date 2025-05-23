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

interface ProjectsCalendarProps {
  currentDate: Date
  projects: Project[]
  teamMembers: TeamMember[]
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

export function ProjectsCalendar({ currentDate, projects, teamMembers }: ProjectsCalendarProps) {
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
              title: member.name,
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
              title: member.name,
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
              title: member.name,
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
            title: `${member.name} - Vacaciones`,
            date: daysInMonth[vacationStartDay + i],
            memberId: member.id,
            type: "vacation",
          })
        }
      }
    })

    setCalendarEvents(events)
  }, [currentDate, teamMembers, projects])

  // Función para obtener eventos de un día específico para un proyecto
  const getEventsForDay = (date: Date, projectId: string) => {
    return calendarEvents.filter((event) => isSameDay(event.date, date) && event.projectId === projectId)
  }

  // Función para calcular la asignación total de un proyecto en un día
  const calculateDailyAllocation = (date: Date, projectId: string) => {
    const events = getEventsForDay(date, projectId)

    // Sumar todas las asignaciones (ponderadas por la disponibilidad del miembro)
    return events.reduce((sum, event) => {
      const member = teamMembers.find((m) => m.id === event.memberId)
      const memberAvailability = member ? member.availability / 100 : 1
      return sum + (event.allocation || 0) * memberAvailability
    }, 0)
  }

  // Función para renderizar el contenido de una celda del calendario
  const renderCellContent = (date: Date, projectId: string) => {
    const events = getEventsForDay(date, projectId)
    const project = projects.find((p) => p.id === projectId)

    if (!project) return null

    return (
      <div className="h-full w-full p-1" style={{ backgroundColor: `${project.color}10` }}>
        <div className="flex flex-col h-full">
          <div className="text-xs font-medium mb-1">{format(date, "d")}</div>
          <div className="flex-1 overflow-hidden">
            {events.map((event) => {
              const member = teamMembers.find((m) => m.id === event.memberId)

              if (!member) return null

              return (
                <div key={event.id} className="flex items-center gap-1 mb-1">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback className="text-[8px]">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Badge
                    variant="outline"
                    className="text-[8px] truncate"
                    style={{
                      backgroundColor: `${project.color}20`,
                      borderColor: `${project.color}40`,
                      color: project.color,
                    }}
                  >
                    {event.allocation}%
                  </Badge>
                </div>
              )
            })}
          </div>
          <div className="mt-auto">
            <Progress
              value={calculateDailyAllocation(date, projectId)}
              className="h-1"
              indicatorClassName={`bg-[${project.color}]`}
            />
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
            <th className="p-2 border bg-muted/50 w-[200px]">Proyecto</th>
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
          {projects.map((project) => (
            <tr key={project.id}>
              <td className="p-2 border">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: project.color }}></div>
                  <div>
                    <div className="text-sm font-medium">{project.name}</div>
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
                            {renderCellContent(day, project.id)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-2">
                            <div className="font-medium">{format(day, "EEEE d 'de' MMMM", { locale: es })}</div>
                            <div className="text-sm">{project.name}</div>
                            <div className="text-xs">
                              Asignación total: {calculateDailyAllocation(day, project.id)}%
                            </div>
                            {getEventsForDay(day, project.id).map((event) => {
                              const member = teamMembers.find((m) => m.id === event.memberId)
                              if (!member) return null

                              return (
                                <div key={event.id} className="text-xs flex items-center gap-1">
                                  <Avatar className="h-4 w-4">
                                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                    <AvatarFallback className="text-[8px]">
                                      {member.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>
                                    {member.name} ({event.allocation}%)
                                  </span>
                                </div>
                              )
                            })}
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
