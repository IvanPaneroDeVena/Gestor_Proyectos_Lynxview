"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Send, Paperclip } from "lucide-react"

interface FacturaEmailFormProps {
  emailData: {
    to: string
    cc: string
    subject: string
    message: string
  }
  setEmailData: (data: any) => void
  onSend: () => void
}

export function FacturaEmailForm({ emailData, setEmailData, onSend }: FacturaEmailFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEmailData({
      ...emailData,
      [name]: value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="to">Para</Label>
        <Input id="to" name="to" value={emailData.to} onChange={handleChange} placeholder="cliente@empresa.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cc">CC (opcional)</Label>
        <Input id="cc" name="cc" value={emailData.cc} onChange={handleChange} placeholder="otrapersona@empresa.com" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Asunto</Label>
        <Input id="subject" name="subject" value={emailData.subject} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mensaje</Label>
        <Textarea
          id="message"
          name="message"
          value={emailData.message}
          onChange={handleChange}
          rows={8}
          className="resize-none"
        />
      </div>

      <div className="space-y-4">
        <div className="border rounded-md p-3 bg-gray-50">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Archivos adjuntos</span>
          </div>
          <div className="mt-2 pl-6">
            <div className="flex items-center gap-2">
              <Checkbox id="attach-pdf" defaultChecked />
              <Label htmlFor="attach-pdf" className="text-sm">
                Factura en PDF
              </Label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Checkbox id="attach-excel" />
              <Label htmlFor="attach-excel" className="text-sm">
                Desglose de horas (Excel)
              </Label>
            </div>
          </div>
        </div>

        <Button onClick={onSend} className="w-full bg-purple-700 hover:bg-purple-800">
          <Send className="mr-2 h-4 w-4" /> Enviar factura
        </Button>
      </div>
    </div>
  )
}
