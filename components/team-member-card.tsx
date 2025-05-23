import { Code2, Cpu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TeamMemberCardProps {
  name: string
  role: string
  projects: number
  avatar: string
  technologies?: string[]
}

export function TeamMemberCard({ name, role, projects, avatar, technologies = [] }: TeamMemberCardProps) {
  // Obtener iniciales para el fallback del avatar
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="overflow-hidden card-hover relative bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-brand-purple/5 opacity-20 rounded-lg pointer-events-none"></div>
      <CardHeader className="p-4 pb-0 flex justify-center">
        <Avatar className="h-16 w-16">
          <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent className="p-4 text-center">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">{role}</p>
        <div className="mt-2 flex items-center justify-center gap-1 text-sm">
          <Code2 className="h-3 w-3" />
          <span>{projects} proyectos</span>
        </div>

        {technologies.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-2 flex items-center justify-center">
              <Cpu className="h-3 w-3 mr-1" /> Tecnologías
            </p>
            <div className="flex flex-wrap justify-center gap-1">
              {technologies.slice(0, 5).map((tech, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-blue-50">
                  {tech}
                </Badge>
              ))}
              {technologies.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{technologies.length - 5}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
