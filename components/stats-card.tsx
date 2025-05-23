import React from "react"
import type { ReactNode } from "react"
import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: ReactNode
  trend: "up" | "down" | "same"
}

export function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  const getGradientClass = () => {
    if (icon && typeof icon === "object" && "props" in icon && React.isValidElement(icon)) {
      const iconProps = icon.props
      if (iconProps.className) {
        if (iconProps.className.includes("text-emerald-500")) return "from-emerald-500/10 to-emerald-500/5"
        if (iconProps.className.includes("text-blue-500")) return "from-blue-500/10 to-blue-500/5"
        if (iconProps.className.includes("text-orange-500")) return "from-orange-500/10 to-orange-500/5"
        if (iconProps.className.includes("text-purple-500")) return "from-purple-500/10 to-purple-500/5"
      }
    }
    return "from-brand-purple/10 to-brand-purple/5"
  }

  return (
    <Card className="card-hover overflow-hidden bg-white">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${getGradientClass()} opacity-30 rounded-lg pointer-events-none`}
      ></div>
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="bg-white/80 p-1 rounded-full">{icon}</div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold">{value}</div>
        <CardDescription className="flex items-center text-xs">
          {description}
          <span
            className={cn("ml-1 flex items-center justify-center", {
              "text-emerald-500": trend === "up",
              "text-red-500": trend === "down",
              "text-gray-500": trend === "same",
            })}
          >
            {trend === "up" && <ArrowUp className="h-3 w-3" />}
            {trend === "down" && <ArrowDown className="h-3 w-3" />}
            {trend === "same" && <ArrowRight className="h-3 w-3" />}
          </span>
        </CardDescription>
      </CardContent>
    </Card>
  )
}
