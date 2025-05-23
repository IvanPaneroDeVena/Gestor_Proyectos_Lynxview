"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FacturacionChartProps {
  month: string
  year: string
}

export function FacturacionChart({ month, year }: FacturacionChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const pieChartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Importar Chart.js dinámicamente para evitar problemas de SSR
    const loadCharts = async () => {
      const { Chart, registerables } = await import("chart.js")
      Chart.register(...registerables)

      // Destruir gráficos existentes si los hay
      let barChart: any
      let pieChart: any

      // Crear gráfico de barras
      if (chartRef.current) {
        const ctx = chartRef.current.getContext("2d")
        if (ctx) {
          barChart = new Chart(ctx, {
            type: "bar",
            data: {
              labels: ["AYR", "GSW", "ADPOINT", "Tecnologías", "Banco"],
              datasets: [
                {
                  label: "Facturado (€)",
                  data: [7800, 4675, 9000, 2800, 4800],
                  backgroundColor: [
                    "rgba(109, 40, 217, 0.7)",
                    "rgba(37, 99, 235, 0.7)",
                    "rgba(16, 185, 129, 0.7)",
                    "rgba(249, 115, 22, 0.7)",
                    "rgba(139, 92, 246, 0.7)",
                  ],
                  borderColor: [
                    "rgba(109, 40, 217, 1)",
                    "rgba(37, 99, 235, 1)",
                    "rgba(16, 185, 129, 1)",
                    "rgba(249, 115, 22, 1)",
                    "rgba(139, 92, 246, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            },
          })
        }
      }

      // Crear gráfico circular
      if (pieChartRef.current) {
        const ctx = pieChartRef.current.getContext("2d")
        if (ctx) {
          pieChart = new Chart(ctx, {
            type: "pie",
            data: {
              labels: ["Pendiente", "Enviada", "Pagada parcialmente", "Pagada", "Retrasada"],
              datasets: [
                {
                  data: [7800, 4675, 9000, 2800, 4800],
                  backgroundColor: [
                    "rgba(245, 158, 11, 0.7)",
                    "rgba(59, 130, 246, 0.7)",
                    "rgba(139, 92, 246, 0.7)",
                    "rgba(16, 185, 129, 0.7)",
                    "rgba(239, 68, 68, 0.7)",
                  ],
                  borderColor: [
                    "rgba(245, 158, 11, 1)",
                    "rgba(59, 130, 246, 1)",
                    "rgba(139, 92, 246, 1)",
                    "rgba(16, 185, 129, 1)",
                    "rgba(239, 68, 68, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
            },
          })
        }
      }

      // Cleanup function
      return () => {
        if (barChart) {
          barChart.destroy()
        }
        if (pieChart) {
          pieChart.destroy()
        }
      }
    }

    loadCharts()
  }, [month, year])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Análisis de Facturación</CardTitle>
        <CardDescription>Visualización de datos de facturación</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="proyectos" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="proyectos">Por Proyecto</TabsTrigger>
            <TabsTrigger value="estado">Por Estado</TabsTrigger>
          </TabsList>

          <TabsContent value="proyectos" className="space-y-4">
            <div className="h-80">
              <canvas ref={chartRef}></canvas>
            </div>
          </TabsContent>

          <TabsContent value="estado" className="space-y-4">
            <div className="h-80">
              <canvas ref={pieChartRef}></canvas>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
