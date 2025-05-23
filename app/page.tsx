import { StatsCard } from "@/components/stats-card"
import { RecentActivityCard } from "@/components/recent-activity-card"
import { ProjectCard } from "@/components/project-card"
import { TeamMemberCard } from "@/components/team-member-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BarChart3, Calendar, Clock, Code2, DollarSign, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido al panel de gestión de proyectos de Lynx View</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Proyectos Activos"
          value="12"
          description="+2 este mes"
          icon={<Code2 className="h-5 w-5 text-teal-600" />}
        />
        <StatsCard
          title="Miembros del Equipo"
          value="24"
          description="80% Senior"
          icon={<Users className="h-5 w-5 text-teal-600" />}
        />
        <StatsCard
          title="Horas Facturables"
          value="1,248"
          description="+12% vs. mes anterior"
          icon={<Clock className="h-5 w-5 text-teal-600" />}
        />
        <StatsCard
          title="Facturación Mensual"
          value="€86,400"
          description="+8% vs. mes anterior"
          icon={<DollarSign className="h-5 w-5 text-teal-600" />}
        />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Proyectos Recientes</h2>
            <Link href="/proyectos" passHref>
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <ProjectCard
              title="Plataforma E-commerce"
              client="Retail Solutions"
              progress={75}
              dueDate="15 Jun 2025"
              status="En progreso"
              team={["Ana S.", "Carlos M.", "Elena R."]}
            />
            <ProjectCard
              title="App Móvil Banca"
              client="Fintech Innovations"
              progress={40}
              dueDate="30 Jul 2025"
              status="En progreso"
              team={["David L.", "Laura P.", "Miguel A."]}
            />
            <ProjectCard
              title="Sistema CRM"
              client="Global Services"
              progress={90}
              dueDate="5 Jun 2025"
              status="Revisión final"
              team={["Javier G.", "Sofía T."]}
            />
            <ProjectCard
              title="Portal Educativo"
              client="EduTech"
              progress={20}
              dueDate="10 Ago 2025"
              status="Iniciado"
              team={["Pablo R.", "Marta S.", "Lucía V."]}
            />
          </div>
        </div>

        <div className="col-span-full lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Actividad Reciente</h2>
            <Button variant="ghost" size="sm" className="gap-1">
              Ver todo <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4 rounded-xl border bg-card p-4">
            <RecentActivityCard
              user="Ana Sánchez"
              action="completó la tarea"
              target="Diseño de UI para dashboard"
              time="Hace 35 minutos"
              project="Plataforma E-commerce"
            />
            <RecentActivityCard
              user="Carlos Martínez"
              action="comentó en"
              target="Implementación de API de pagos"
              time="Hace 1 hora"
              project="App Móvil Banca"
            />
            <RecentActivityCard
              user="Elena Rodríguez"
              action="subió documento"
              target="Especificaciones técnicas v2"
              time="Hace 3 horas"
              project="Sistema CRM"
            />
            <RecentActivityCard
              user="David López"
              action="creó tarea"
              target="Optimización de rendimiento"
              time="Hace 5 horas"
              project="Portal Educativo"
            />
            <RecentActivityCard
              user="Laura Pérez"
              action="actualizó estado"
              target="Integración con proveedores"
              time="Hace 1 día"
              project="Plataforma E-commerce"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Equipo Destacado</h2>
            <Link href="/equipo" passHref>
              <Button variant="ghost" size="sm" className="gap-1">
                Ver todos <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TeamMemberCard
              name="Ana Sánchez"
              role="Desarrolladora Senior"
              availability="Disponible"
              skills={["React", "Node.js", "TypeScript"]}
              projects={["Plataforma E-commerce", "Portal Educativo"]}
            />
            <TeamMemberCard
              name="Carlos Martínez"
              role="Arquitecto de Software"
              availability="Ocupado"
              skills={["AWS", "Microservicios", "Java"]}
              projects={["App Móvil Banca"]}
            />
            <TeamMemberCard
              name="Elena Rodríguez"
              role="UX/UI Designer"
              availability="Parcial"
              skills={["Figma", "Adobe XD", "Investigación"]}
              projects={["Sistema CRM", "Plataforma E-commerce"]}
            />
          </div>
        </div>

        <div className="col-span-full lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Próximos Eventos</h2>
            <Link href="/calendario" passHref>
              <Button variant="ghost" size="sm" className="gap-1">
                Ver calendario <Calendar className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4 rounded-xl border bg-card p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Reunión de Planificación</h3>
                <p className="text-sm text-muted-foreground">Mañana, 10:00 - 11:30</p>
                <p className="mt-1 text-sm">Plataforma E-commerce</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Revisión de Sprint</h3>
                <p className="text-sm text-muted-foreground">Viernes, 15:00 - 16:30</p>
                <p className="mt-1 text-sm">App Móvil Banca</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium">Entrevista Cliente</h3>
                <p className="text-sm text-muted-foreground">Lunes, 11:00 - 12:00</p>
                <p className="mt-1 text-sm">Sistema CRM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
