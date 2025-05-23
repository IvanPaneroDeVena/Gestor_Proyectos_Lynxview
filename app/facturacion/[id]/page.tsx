"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Printer, Send, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FacturaTemplate } from "@/components/factura-template"
import { FacturaOptions } from "@/components/factura-options"
import { FacturaEmailForm } from "@/components/factura-email-form"
import { generatePDF } from "@/lib/pdf-generator"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function FacturaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const facturaId = params.id as string
  const [factura, setFactura] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("preview")
  const [facturaOptions, setFacturaOptions] = useState({
    includeCompanyLogo: true,
    includeFooter: true,
    includeBankDetails: true,
    includePaymentTerms: true,
    includeSignature: false,
    template: "standard",
    color: "#6D28D9",
  })
  const [emailData, setEmailData] = useState({
    to: "",
    cc: "",
    subject: "",
    message: "",
  })

  // Simular la carga de datos de la factura
  useEffect(() => {
    const fetchFactura = async () => {
      setLoading(true)
      try {
        // En una implementación real, aquí haríamos una llamada a la API
        // const response = await fetch(`/api/facturas/${facturaId}`);
        // const data = await response.json();

        // Simulamos datos de ejemplo
        const facturaData = {
          id: "FAC-001",
          proyecto: "AYR sistema de domótica",
          cliente: "Empresa AYR",
          clienteInfo: {
            nombre: "Empresa AYR S.L.",
            direccion: "Calle Innovación, 123",
            ciudad: "Madrid",
            codigoPostal: "28001",
            cif: "B12345678",
            email: "facturacion@ayr.com",
            telefono: "+34 910 123 456",
          },
          horas: 120,
          tarifa: 65,
          importe: 7800,
          estado: "Pendiente",
          fechaEmision: "15/05/2025",
          fechaVencimiento: "15/06/2025",
          progreso: 0,
          detalles: [
            { concepto: "Desarrollo Frontend", horas: 45, tarifa: 65, importe: 2925 },
            { concepto: "Desarrollo Backend", horas: 35, tarifa: 65, importe: 2275 },
            { concepto: "Diseño UX/UI", horas: 40, tarifa: 65, importe: 2600 },
          ],
          impuestos: 21,
        }

        setFactura(facturaData)
        setEmailData({
          to: facturaData.clienteInfo.email,
          cc: "",
          subject: `Factura ${facturaData.id} - ${facturaData.proyecto}`,
          message: `Estimado cliente,\n\nAdjunto encontrará la factura ${facturaData.id} correspondiente al proyecto "${facturaData.proyecto}".\n\nPor favor, no dude en contactarnos si tiene alguna pregunta.\n\nSaludos cordiales,\nSoftware Solutions`,
        })
      } catch (error) {
        console.error("Error al cargar la factura:", error)
        toast({
          title: "Error al cargar la factura",
          description: "No se ha podido cargar la información de la factura",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFactura()
  }, [facturaId])

  const handleDownloadPDF = async () => {
    if (!factura) return

    try {
      await generatePDF(factura, facturaOptions, "download")
      toast({
        title: "PDF generado correctamente",
        description: "La factura se ha descargado en tu dispositivo",
      })
    } catch (error) {
      console.error("Error al generar el PDF:", error)
      toast({
        title: "Error al generar el PDF",
        description: "Ha ocurrido un error al generar la factura",
        variant: "destructive",
      })
    }
  }

  const handlePrintPDF = async () => {
    if (!factura) return

    try {
      await generatePDF(factura, facturaOptions, "print")
      toast({
        title: "Preparando impresión",
        description: "La factura se está preparando para imprimir",
      })
    } catch (error) {
      console.error("Error al imprimir el PDF:", error)
      toast({
        title: "Error al imprimir",
        description: "Ha ocurrido un error al preparar la impresión",
        variant: "destructive",
      })
    }
  }

  const handleSendEmail = () => {
    // Aquí iría la lógica para enviar el email con el PDF adjunto
    toast({
      title: "Email enviado",
      description: `La factura ha sido enviada a ${emailData.to}`,
    })
    router.push("/facturacion")
  }

  const handleSavePDF = async () => {
    if (!factura) return

    try {
      await generatePDF(factura, facturaOptions, "save")
      toast({
        title: "Factura guardada",
        description: "La factura se ha guardado en el sistema",
      })
    } catch (error) {
      console.error("Error al guardar el PDF:", error)
      toast({
        title: "Error al guardar",
        description: "Ha ocurrido un error al guardar la factura",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-8 p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/facturacion">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight gradient-text">Cargando factura...</h1>
          </div>
        </div>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4 mx-auto"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!factura) {
    return (
      <div className="flex flex-col gap-8 p-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/facturacion">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Volver</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight gradient-text">Factura no encontrada</h1>
          </div>
        </div>
        <div className="text-center py-12">
          <p>La factura que estás buscando no existe o ha sido eliminada.</p>
          <Button asChild className="mt-4">
            <Link href="/facturacion">Volver a Facturación</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/facturacion">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight gradient-text">
            Factura {factura.id} - {factura.proyecto}
          </h1>
          <p className="text-muted-foreground">
            Cliente: {factura.cliente} | Importe: {factura.importe.toLocaleString()} € | Estado: {factura.estado}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintPDF}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" /> Descargar
          </Button>
          <Button className="bg-purple-700 hover:bg-purple-800" onClick={() => setActiveTab("email")}>
            <Send className="mr-2 h-4 w-4" /> Enviar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-1 mb-4">
                  <TabsTrigger value="preview">Previsualización</TabsTrigger>
                  <TabsTrigger value="options">Opciones</TabsTrigger>
                  <TabsTrigger value="email">Enviar por Email</TabsTrigger>
                </TabsList>
              </Tabs>

              {activeTab === "preview" && (
                <div className="space-y-4">
                  <Button variant="outline" className="w-full" onClick={handlePrintPDF}>
                    <Printer className="mr-2 h-4 w-4" /> Imprimir
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleSavePDF}>
                    <Save className="mr-2 h-4 w-4" /> Guardar
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleDownloadPDF}>
                    <Download className="mr-2 h-4 w-4" /> Descargar PDF
                  </Button>
                  <Button className="w-full bg-purple-700 hover:bg-purple-800" onClick={() => setActiveTab("email")}>
                    <Send className="mr-2 h-4 w-4" /> Enviar
                  </Button>
                </div>
              )}

              {activeTab === "options" && (
                <div className="space-y-4">
                  <Button className="w-full bg-purple-700 hover:bg-purple-800" onClick={() => setActiveTab("preview")}>
                    Ver previsualización
                  </Button>
                </div>
              )}

              {activeTab === "email" && (
                <div className="space-y-4">
                  <Button className="w-full bg-purple-700 hover:bg-purple-800" onClick={handleSendEmail}>
                    <Send className="mr-2 h-4 w-4" /> Enviar factura
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardContent className="p-6">
              <TabsContent value="preview" className="mt-0">
                <div className="border rounded-md p-6 bg-white">
                  <FacturaTemplate factura={factura} options={facturaOptions} />
                </div>
              </TabsContent>

              <TabsContent value="options" className="mt-0">
                <FacturaOptions options={facturaOptions} setOptions={setFacturaOptions} />
              </TabsContent>

              <TabsContent value="email" className="mt-0">
                <FacturaEmailForm emailData={emailData} setEmailData={setEmailData} onSend={handleSendEmail} />
              </TabsContent>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
