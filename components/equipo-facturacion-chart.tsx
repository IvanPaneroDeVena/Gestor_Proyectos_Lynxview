"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

interface EquipoFacturacionChartProps {
  type: "mensual" | "total"
  month?: string
  year: string
}

export function EquipoFacturacionChart({ type, month, year }: EquipoFacturacionChartProps) {
  const [activeTab, setActiveTab] = useState("distribucion")
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [hoveredTrendPoint, setHoveredTrendPoint] = useState<number | null>(null)

  // Datos simulados para los gráficos
  const miembrosData = [
    {
      nombre: "Ana Martínez",
      horas: type === "mensual" ? 155 : 1876,
      color: "bg-teal-500",
      rol: "Desarrollador Senior",
      proyectos: type === "mensual" ? 3 : 12,
      eficiencia: 94,
      tareas: type === "mensual" ? 28 : 320,
    },
    {
      nombre: "Carlos Ruiz",
      horas: type === "mensual" ? 145 : 1890,
      color: "bg-blue-500",
      rol: "Arquitecto de Software",
      proyectos: type === "mensual" ? 2 : 8,
      eficiencia: 96,
      tareas: type === "mensual" ? 22 : 280,
    },
    {
      nombre: "Elena Gómez",
      horas: type === "mensual" ? 150 : 1520,
      color: "bg-indigo-500",
      rol: "Analista de Datos",
      proyectos: type === "mensual" ? 4 : 15,
      eficiencia: 92,
      tareas: type === "mensual" ? 30 : 310,
    },
    {
      nombre: "Javier López",
      horas: type === "mensual" ? 165 : 1950,
      color: "bg-purple-500",
      rol: "Desarrollador Frontend",
      proyectos: type === "mensual" ? 3 : 10,
      eficiencia: 97,
      tareas: type === "mensual" ? 32 : 350,
    },
    {
      nombre: "Laura Sánchez",
      horas: type === "mensual" ? 140 : 1840,
      color: "bg-pink-500",
      rol: "Desarrollador Backend",
      proyectos: type === "mensual" ? 2 : 9,
      eficiencia: 93,
      tareas: type === "mensual" ? 26 : 290,
    },
    {
      nombre: "Miguel Torres",
      horas: type === "mensual" ? 130 : 980,
      color: "bg-orange-500",
      rol: "Diseñador UX/UI",
      proyectos: type === "mensual" ? 5 : 18,
      eficiencia: 90,
      tareas: type === "mensual" ? 24 : 260,
    },
  ]

  // Datos para el gráfico de tendencia
  const tendenciaData =
    type === "mensual"
      ? [
          { dia: "1-5", horas: 30, completadas: 12, pendientes: 5 },
          { dia: "6-10", horas: 35, completadas: 15, pendientes: 3 },
          { dia: "11-15", horas: 28, completadas: 10, pendientes: 6 },
          { dia: "16-20", horas: 40, completadas: 18, pendientes: 4 },
          { dia: "21-25", horas: 32, completadas: 14, pendientes: 2 },
          { dia: "26-31", horas: 25, completadas: 11, pendientes: 3 },
        ]
      : [
          { mes: "Ene", horas: 1500, completadas: 120, pendientes: 15 },
          { mes: "Feb", horas: 1550, completadas: 125, pendientes: 10 },
          { mes: "Mar", horas: 1600, completadas: 130, pendientes: 12 },
          { mes: "Abr", horas: 1580, completadas: 128, pendientes: 8 },
          { mes: "May", horas: 1620, completadas: 135, pendientes: 5 },
          { mes: "Jun", horas: 1550, completadas: 126, pendientes: 9 },
          { mes: "Jul", horas: 1500, completadas: 122, pendientes: 11 },
          { mes: "Ago", horas: 1450, completadas: 118, pendientes: 14 },
          { mes: "Sep", horas: 1580, completadas: 129, pendientes: 7 },
          { mes: "Oct", horas: 1620, completadas: 134, pendientes: 6 },
          { mes: "Nov", horas: 1650, completadas: 138, pendientes: 4 },
          { mes: "Dic", horas: 1550, completadas: 125, pendientes: 10 },
        ]

  // Calcular el total de horas para el gráfico de distribución
  const totalHoras = miembrosData.reduce((sum, item) => sum + item.horas, 0)

  // Calcular el máximo de horas para el gráfico de barras
  const maxHoras = Math.max(...miembrosData.map((item) => item.horas))

  // Manejador para el movimiento del mouse en el gráfico de tendencia
  const handleTrendMouseMove = (e: React.MouseEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 70, // Ajustar para que el tooltip aparezca encima del cursor
    })
    setHoveredTrendPoint(index)
  }

  // Manejador para el movimiento del mouse en el gráfico de barras
  const handleBarMouseMove = (e: React.MouseEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      x: e.clientX - rect.left + 20, // Ajustar para que el tooltip aparezca a la derecha del cursor
      y: e.clientY - rect.top - 40,
    })
    setHoveredItem(index)
  }

  // Manejador para el movimiento del mouse en el gráfico circular
  const handlePieMouseMove = (e: React.MouseEvent, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 60,
    })
    setHoveredItem(index)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{type === "mensual" ? "Análisis Mensual de Horas" : "Análisis Anual de Horas"}</CardTitle>
        <CardDescription>
          {type === "mensual"
            ? `Visualización de horas por miembro del equipo en ${month} ${year}`
            : `Visualización de horas acumuladas por miembro del equipo en ${year}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="distribucion">Distribución</TabsTrigger>
            <TabsTrigger value="comparativa">Comparativa</TabsTrigger>
            <TabsTrigger value="tendencia">Tendencia</TabsTrigger>
          </TabsList>

          {/* Gráfico de distribución (tipo pie/donut) */}
          <TabsContent value="distribucion" className="pt-4">
            <div className="aspect-[4/3] w-full rounded-lg bg-white p-4">
              <div className="flex h-full">
                {/* Gráfico circular */}
                <div className="w-1/2 flex items-center justify-center relative">
                  <div className="relative w-64 h-64">
                    {/* Crear segmentos del gráfico circular */}
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {miembrosData.map((miembro, index) => {
                        const porcentaje = (miembro.horas / totalHoras) * 100
                        const startAngle =
                          index === 0
                            ? 0
                            : miembrosData
                                .slice(0, index)
                                .reduce((sum, item) => sum + (item.horas / totalHoras) * 360, 0)
                        const endAngle = startAngle + (porcentaje * 360) / 100

                        // Convertir ángulos a coordenadas para el arco
                        const startX = 50 + 40 * Math.cos(((startAngle - 90) * Math.PI) / 180)
                        const startY = 50 + 40 * Math.sin(((startAngle - 90) * Math.PI) / 180)
                        const endX = 50 + 40 * Math.cos(((endAngle - 90) * Math.PI) / 180)
                        const endY = 50 + 40 * Math.sin(((endAngle - 90) * Math.PI) / 180)

                        // Determinar si el arco es mayor que 180 grados
                        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

                        // Calcular punto medio del arco para animación de hover
                        const midAngle = startAngle + (endAngle - startAngle) / 2
                        const midX =
                          50 + (hoveredItem === index ? 42 : 40) * Math.cos(((midAngle - 90) * Math.PI) / 180)
                        const midY =
                          50 + (hoveredItem === index ? 42 : 40) * Math.sin(((midAngle - 90) * Math.PI) / 180)

                        return (
                          <path
                            key={index}
                            d={`M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                            fill={miembro.color.replace("bg-", "var(--")}
                            stroke="white"
                            strokeWidth="1"
                            opacity={hoveredItem === null || hoveredItem === index ? 1 : 0.7}
                            transform={hoveredItem === index ? `translate(${midX - 50} ${midY - 50}) scale(1.05)` : ""}
                            style={{ transition: "all 0.2s ease-in-out" }}
                            onMouseEnter={() => setHoveredItem(index)}
                            onMouseLeave={() => setHoveredItem(null)}
                            onMouseMove={(e) => handlePieMouseMove(e, index)}
                          />
                        )
                      })}
                      <circle cx="50" cy="50" r="25" fill="white" />
                    </svg>
                  </div>

                  {/* Tooltip para el gráfico circular */}
                  {hoveredItem !== null && activeTab === "distribucion" && (
                    <div
                      className="absolute bg-white p-2 rounded-md shadow-lg border border-gray-200 z-10 text-sm"
                      style={{
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y}px`,
                        transform: "translate(-50%, -100%)",
                        minWidth: "180px",
                      }}
                    >
                      <div className="font-medium">{miembrosData[hoveredItem].nombre}</div>
                      <div className="flex justify-between mt-1">
                        <span>Horas:</span>
                        <span className="font-medium">{miembrosData[hoveredItem].horas}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Porcentaje:</span>
                        <span className="font-medium">
                          {((miembrosData[hoveredItem].horas / totalHoras) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rol:</span>
                        <span className="font-medium">{miembrosData[hoveredItem].rol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Proyectos:</span>
                        <span className="font-medium">{miembrosData[hoveredItem].proyectos}</span>
                      </div>
                      <div className="mt-1 pt-1 border-t border-gray-100">
                        <div className="flex justify-between">
                          <span>Eficiencia:</span>
                          <span className="font-medium">{miembrosData[hoveredItem].eficiencia}%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Leyenda */}
                <div className="w-1/2 flex flex-col justify-center">
                  <h4 className="text-sm font-medium mb-4">Distribución de horas por miembro</h4>
                  <div className="space-y-3">
                    {miembrosData.map((miembro, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-1 rounded-md transition-colors duration-200 ${
                          hoveredItem === index ? "bg-gray-100" : ""
                        }`}
                        onMouseEnter={() => setHoveredItem(index)}
                        onMouseLeave={() => setHoveredItem(null)}
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${miembro.color} mr-2`}></div>
                          <span className="text-sm">{miembro.nombre}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm font-medium">{miembro.horas}</span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({((miembro.horas / totalHoras) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Total:</span>
                      <span className="text-sm font-medium">{totalHoras} horas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Gráfico comparativo (barras) */}
          <TabsContent value="comparativa" className="pt-4">
            <div className="aspect-[4/3] w-full rounded-lg bg-white p-4">
              <h4 className="text-sm font-medium mb-4">Comparativa de horas entre miembros</h4>
              <div className="h-[calc(100%-2rem)] flex flex-col justify-end space-y-3">
                {miembrosData.map((miembro, index) => (
                  <div
                    key={index}
                    className="flex items-center"
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onMouseMove={(e) => handleBarMouseMove(e, index)}
                  >
                    <div className="w-24 text-sm truncate pr-2">{miembro.nombre}</div>
                    <div className="flex-1 flex items-center relative">
                      <div
                        className={`h-6 ${miembro.color} rounded-r-sm transition-all duration-200 ${
                          hoveredItem === index ? "brightness-110 shadow-md" : ""
                        }`}
                        style={{
                          width: `${(miembro.horas / maxHoras) * 100}%`,
                          transform: hoveredItem === index ? "scaleY(1.1)" : "scaleY(1)",
                        }}
                      ></div>
                      <span
                        className={`ml-2 text-sm font-medium transition-all duration-200 ${
                          hoveredItem === index ? "font-bold" : ""
                        }`}
                      >
                        {miembro.horas}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tooltip para el gráfico de barras */}
              {hoveredItem !== null && activeTab === "comparativa" && (
                <div
                  className="absolute bg-white p-2 rounded-md shadow-lg border border-gray-200 z-10 text-sm"
                  style={{
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y}px`,
                    transform: "translate(-50%, -100%)",
                    minWidth: "200px",
                  }}
                >
                  <div className="font-medium">{miembrosData[hoveredItem].nombre}</div>
                  <div className="flex justify-between mt-1">
                    <span>Horas registradas:</span>
                    <span className="font-medium">{miembrosData[hoveredItem].horas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rol:</span>
                    <span className="font-medium">{miembrosData[hoveredItem].rol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Proyectos:</span>
                    <span className="font-medium">{miembrosData[hoveredItem].proyectos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tareas completadas:</span>
                    <span className="font-medium">{miembrosData[hoveredItem].tareas}</span>
                  </div>
                  <div className="mt-1 pt-1 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span>% del total:</span>
                      <span className="font-medium">
                        {((miembrosData[hoveredItem].horas / totalHoras) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Gráfico de tendencia (línea) */}
          <TabsContent value="tendencia" className="pt-4">
            <div className="aspect-[4/3] w-full rounded-lg bg-white p-4 relative">
              <h4 className="text-sm font-medium mb-4">
                {type === "mensual" ? "Tendencia de horas durante el mes" : "Tendencia de horas durante el año"}
              </h4>
              <div className="h-[calc(100%-2rem)] flex flex-col">
                <div className="flex-1 relative">
                  {/* Líneas de cuadrícula */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div key={i} className="border-t border-gray-100 w-full h-0"></div>
                    ))}
                  </div>

                  {/* Gráfico de línea */}
                  <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${tendenciaData.length * 10} 100`}>
                    {/* Área bajo la curva con gradiente */}
                    <defs>
                      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--teal-500)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--teal-500)" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>

                    {/* Área bajo la curva */}
                    <path
                      d={`
                        M ${tendenciaData
                          .map((item, i) => {
                            const x = i * 10 + 5
                            const y = 100 - (item.horas / (type === "mensual" ? 50 : 2000)) * 100
                            return `${i === 0 ? "M" : "L"} ${x} ${y}`
                          })
                          .join(" ")} 
                        L ${(tendenciaData.length - 1) * 10 + 5} 100 
                        L 5 100 Z
                      `}
                      fill="url(#areaGradient)"
                    />

                    {/* Línea principal */}
                    <polyline
                      points={tendenciaData
                        .map((item, i) => {
                          const x = i * 10 + 5
                          const y = 100 - (item.horas / (type === "mensual" ? 50 : 2000)) * 100
                          return `${x},${y}`
                        })
                        .join(" ")}
                      fill="none"
                      stroke="var(--teal-500)"
                      strokeWidth="2"
                    />

                    {/* Puntos interactivos */}
                    {tendenciaData.map((item, i) => {
                      const x = i * 10 + 5
                      const y = 100 - (item.horas / (type === "mensual" ? 50 : 2000)) * 100
                      return (
                        <g key={i}>
                          {/* Punto más grande invisible para facilitar la interacción */}
                          <circle
                            cx={x}
                            cy={y}
                            r="5"
                            fill="transparent"
                            onMouseEnter={() => setHoveredTrendPoint(i)}
                            onMouseLeave={() => setHoveredTrendPoint(null)}
                            onMouseMove={(e) => handleTrendMouseMove(e, i)}
                          />
                          {/* Punto visible */}
                          <circle
                            cx={x}
                            cy={y}
                            r={hoveredTrendPoint === i ? "4" : "2.5"}
                            fill={hoveredTrendPoint === i ? "white" : "var(--teal-500)"}
                            stroke="var(--teal-500)"
                            strokeWidth={hoveredTrendPoint === i ? "2" : "0"}
                            className="transition-all duration-200"
                          />
                        </g>
                      )
                    })}
                  </svg>
                </div>

                {/* Etiquetas del eje X */}
                <div className="h-6 flex justify-between mt-2">
                  {tendenciaData.map((item, i) => (
                    <div
                      key={i}
                      className={`text-xs transition-all duration-200 ${
                        hoveredTrendPoint === i ? "text-teal-700 font-medium" : "text-gray-500"
                      }`}
                    >
                      {type === "mensual" ? item.dia : item.mes}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tooltip para el gráfico de tendencia */}
              {hoveredTrendPoint !== null && (
                <div
                  className="absolute bg-white p-2 rounded-md shadow-lg border border-gray-200 z-10 text-sm"
                  style={{
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y}px`,
                    transform: "translate(-50%, -100%)",
                    minWidth: "180px",
                  }}
                >
                  <div className="font-medium">
                    {type === "mensual"
                      ? `Días ${tendenciaData[hoveredTrendPoint].dia}`
                      : `${tendenciaData[hoveredTrendPoint].mes} ${year}`}
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Horas registradas:</span>
                    <span className="font-medium">{tendenciaData[hoveredTrendPoint].horas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tareas completadas:</span>
                    <span className="font-medium">{tendenciaData[hoveredTrendPoint].completadas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tareas pendientes:</span>
                    <span className="font-medium">{tendenciaData[hoveredTrendPoint].pendientes}</span>
                  </div>
                  <div className="mt-1 pt-1 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span>Eficiencia:</span>
                      <span className="font-medium">
                        {Math.round(
                          (tendenciaData[hoveredTrendPoint].completadas /
                            (tendenciaData[hoveredTrendPoint].completadas +
                              tendenciaData[hoveredTrendPoint].pendientes)) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
          <div>
            <Badge variant="outline" className="mr-2">
              {type === "mensual" ? "Datos mensuales" : "Datos anuales"}
            </Badge>
            Última actualización: Hoy, 10:30
          </div>
          <div>
            {activeTab === "distribucion" && "Mostrando distribución porcentual de horas"}
            {activeTab === "comparativa" && "Mostrando comparativa entre miembros del equipo"}
            {activeTab === "tendencia" && `Mostrando tendencia ${type === "mensual" ? "diaria" : "mensual"} de horas`}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
