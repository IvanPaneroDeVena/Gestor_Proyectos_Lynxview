"use client"

import Link from "next/link"
import { Bell, Menu, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 backdrop-blur-sm px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
      <Link href="/" className="flex items-center gap-2 md:gap-3">
        <span className="font-bold text-xl hidden md:inline-flex gradient-text">Lynx View</span>
        <span className="font-bold text-xl md:hidden">LV</span>
      </Link>
      <div className="relative flex-1 md:grow-0 md:basis-1/3">
        {isSearchOpen ? (
          <div className="absolute inset-0 flex items-center">
            <Input
              type="search"
              placeholder="Buscar proyectos, personas..."
              className="w-full"
              autoFocus
              onBlur={() => setIsSearchOpen(false)}
            />
          </div>
        ) : (
          <Button variant="outline" size="icon" className="ml-auto md:hidden" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Button>
        )}
        <div className="hidden md:flex relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar proyectos, personas..." className="w-full pl-8" />
        </div>
      </div>
      <div className="flex items-center gap-2 md:ml-auto">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificaciones</span>
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
            5
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                <AvatarFallback>LV</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configuración</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="hidden md:flex gap-2">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white font-medium shadow-sm" asChild>
            <Link href="/proyectos/nuevo">
              <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
            </Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Proyecto Rápido</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Crear Proyecto Rápido</DialogTitle>
                <DialogDescription>
                  Crea un nuevo proyecto con la información básica. Podrás completar los detalles más tarde.
                </DialogDescription>
              </DialogHeader>
              <form>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre-rapido">Nombre del Proyecto</Label>
                    <Input id="nombre-rapido" placeholder="Ej: Portal de Clientes v2.0" autoFocus />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion-rapido">Descripción</Label>
                    <Textarea
                      id="descripcion-rapido"
                      placeholder="Describe el proyecto y sus objetivos principales"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Estado</Label>
                      <Select defaultValue="planificacion">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planificacion">Planificación</SelectItem>
                          <SelectItem value="progreso">En Progreso</SelectItem>
                          <SelectItem value="revision">En Revisión</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Prioridad</Label>
                      <Select defaultValue="media">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="baja">Baja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-medium">
                    Crear Proyecto
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}
