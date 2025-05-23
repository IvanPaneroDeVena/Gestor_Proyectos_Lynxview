import { cn } from "@/lib/utils"
import { CalendarDays, MoreHorizontal, Users, Code, Database, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ProjectCardProps {
  title: string
  description: string
  progress: number
  dueDate: string
  members: number
  priority: "Alta" | "Media" | "Baja"
  technologies?: {
    frontend: string[]
    backend: string[]
    database: string[]
    other?: string[]
  }
}

export function ProjectCard({
  title,
  description,
  progress,
  dueDate,
  members,
  priority,
  technologies = {
    frontend: ["React"],
    backend: ["Node.js"],
    database: ["MongoDB"],
    other: [],
  },
}: ProjectCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta":
        return "bg-red-100 text-red-800 hover:bg-red-100/80 border border-red-200"
      case "Media":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80 border border-amber-200"
      case "Baja":
        return "bg-green-100 text-green-800 hover:bg-green-100/80 border border-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 border border-gray-200"
    }
  }

  return (
    <TooltipProvider>
      <Card className="overflow-hidden card-hover bg-white h-full">
        <CardHeader className="p-4 pb-0 flex flex-row items-start justify-between space-y-0">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Ver detalles</DropdownMenuItem>
              <DropdownMenuItem>Editar proyecto</DropdownMenuItem>
              <DropdownMenuItem>Archivar proyecto</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-muted-foreground line-clamp-2 h-10">{description}</p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progreso</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-2"
              indicatorClassName={progress > 66 ? "bg-emerald-500" : progress > 33 ? "bg-amber-500" : "bg-red-500"}
            />
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-blue-50">
                    <Globe className="h-3 w-3 mr-1" />
                    {technologies.frontend[0]}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">Frontend:</p>
                  <p>{technologies.frontend.join(", ")}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-green-50">
                    <Code className="h-3 w-3 mr-1" />
                    {technologies.backend[0]}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">Backend:</p>
                  <p>{technologies.backend.join(", ")}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="bg-purple-50">
                    <Database className="h-3 w-3 mr-1" />
                    {technologies.database[0]}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">Base de datos:</p>
                  <p>{technologies.database.join(", ")}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-wrap items-center gap-2 text-xs mt-auto">
          <Badge variant="outline" className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {dueDate}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {members} miembros
          </Badge>
          <Badge className={cn("ml-auto", getPriorityColor(priority))}>{priority}</Badge>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
