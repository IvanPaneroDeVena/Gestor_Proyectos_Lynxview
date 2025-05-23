"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateProjectModal } from "@/components/create-project-modal"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function CreateProjectButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg bg-purple-700 hover:bg-purple-800 text-white border-2 border-white"
          >
            <Plus className="h-6 w-6" />
            <span className="sr-only">Crear nuevo</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link href="/proyectos/nuevo" className="cursor-pointer">
              Crear proyecto completo
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <div className="w-full cursor-pointer">
              <CreateProjectModal />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
