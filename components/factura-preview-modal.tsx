"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FacturaTemplate } from "@/components/factura-template"
import { FacturaOptions } from "@/components/factura-options"
import { FacturaEmailForm } from "@/components/factura-email-form"
import { Download, Printer, Send, Save } from "lucide-react"
import { generatePDF } from "@/lib/pdf-generator"
import { toast } from "@/components/ui/use-toast"

interface FacturaPreviewModalProps {
  factura: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FacturaPreviewModal({ factura, open, onOpenChange }: FacturaPreviewModalProps) {
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
    to: factura.clienteInfo?.email || "",
    cc: "",
    subject: `Factura ${factura.id} - ${factura.proyecto}`,
    message: `Estimado cliente,\n\nAdjunto encontrará la factura ${factura.id} correspondiente al proyecto "${factura.proyecto}".\n\nPor favor, no dude en contactarnos si tiene alguna pregunta.\n\nSaludos cordiales,\nSoftware Solutions`,
  })

  const handleDownloadPDF = async () => {
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
    onOpenChange(false)
  }

  const handleSavePDF = async () => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Factura {factura.id}</DialogTitle>
          <DialogDescription>Previsualiza, personaliza y envía la factura para {factura.cliente}</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Previsualización</TabsTrigger>
            <TabsTrigger value="options">Opciones</TabsTrigger>
            <TabsTrigger value="email">Enviar por Email</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-4">
            <div className="border rounded-md p-6 bg-white">
              <FacturaTemplate factura={factura} options={facturaOptions} />
            </div>
          </TabsContent>

          <TabsContent value="options" className="mt-4">
            <FacturaOptions options={facturaOptions} setOptions={setFacturaOptions} />
          </TabsContent>

          <TabsContent value="email" className="mt-4">
            <FacturaEmailForm emailData={emailData} setEmailData={setEmailData} onSend={handleSendEmail} />
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-wrap gap-2 sm:space-x-2">
          {activeTab === "preview" && (
            <>
              <Button variant="outline" onClick={handlePrintPDF}>
                <Printer className="mr-2 h-4 w-4" /> Imprimir
              </Button>
              <Button variant="outline" onClick={handleSavePDF}>
                <Save className="mr-2 h-4 w-4" /> Guardar
              </Button>
              <Button variant="outline" onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" /> Descargar PDF
              </Button>
              <Button onClick={() => setActiveTab("email")} className="bg-purple-700 hover:bg-purple-800">
                <Send className="mr-2 h-4 w-4" /> Enviar
              </Button>
            </>
          )}
          {activeTab === "options" && (
            <Button onClick={() => setActiveTab("preview")} className="bg-purple-700 hover:bg-purple-800">
              Ver previsualización
            </Button>
          )}
          {activeTab === "email" && (
            <Button onClick={handleSendEmail} className="bg-purple-700 hover:bg-purple-800">
              <Send className="mr-2 h-4 w-4" /> Enviar factura
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
