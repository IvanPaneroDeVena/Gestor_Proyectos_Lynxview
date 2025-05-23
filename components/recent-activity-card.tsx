import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

interface RecentActivityCardProps {
  user: string
  action: string
  item: string
  project: string
  time: string
  avatar: string
}

export function RecentActivityCard({ user, action, item, project, time, avatar }: RecentActivityCardProps) {
  // Obtener iniciales para el fallback del avatar
  const initials = user
    ? user
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "LV" // Fallback a las iniciales de Lynx View si no hay usuario

  return (
    <Card className="hover:border-brand-purple/30 transition-colors bg-white">
      <CardContent className="p-4 flex items-start gap-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar || "/placeholder.svg"} alt={user || "Usuario"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <p className="text-sm">
            <span className="font-medium">{user || "Usuario"}</span> {action}{" "}
            <span className="font-medium">{item}</span>
            {project && (
              <>
                {" "}
                en <span className="font-medium">{project}</span>
              </>
            )}
          </p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </CardContent>
    </Card>
  )
}
