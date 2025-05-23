"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface FacturaOptionsProps {
  options: {
    includeCompanyLogo: boolean
    includeFooter: boolean
    includeBankDetails: boolean
    includePaymentTerms: boolean
    includeSignature: boolean
    template: string
    color: string
  }
  setOptions: (options: any) => void
}

export function FacturaOptions({ options, setOptions }: FacturaOptionsProps) {
  const handleToggleOption = (option: string) => {
    setOptions({
      ...options,
      [option]: !options[option as keyof typeof options],
    })
  }

  const handleTemplateChange = (value: string) => {
    setOptions({
      ...options,
      template: value,
    })
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions({
      ...options,
      color: e.target.value,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Elementos de la factura</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="include-logo" className="cursor-pointer">
              Incluir logo de la empresa
            </Label>
            <Switch
              id="include-logo"
              checked={options.includeCompanyLogo}
              onCheckedChange={() => handleToggleOption("includeCompanyLogo")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="include-footer" className="cursor-pointer">
              Incluir pie de página
            </Label>
            <Switch
              id="include-footer"
              checked={options.includeFooter}
              onCheckedChange={() => handleToggleOption("includeFooter")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="include-bank" className="cursor-pointer">
              Incluir datos bancarios
            </Label>
            <Switch
              id="include-bank"
              checked={options.includeBankDetails}
              onCheckedChange={() => handleToggleOption("includeBankDetails")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="include-payment" className="cursor-pointer">
              Incluir condiciones de pago
            </Label>
            <Switch
              id="include-payment"
              checked={options.includePaymentTerms}
              onCheckedChange={() => handleToggleOption("includePaymentTerms")}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="include-signature" className="cursor-pointer">
              Incluir espacio para firma
            </Label>
            <Switch
              id="include-signature"
              checked={options.includeSignature}
              onCheckedChange={() => handleToggleOption("includeSignature")}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Plantilla</h3>
        <RadioGroup value={options.template} onValueChange={handleTemplateChange}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="standard" id="standard" />
              <Label htmlFor="standard" className="cursor-pointer">
                <Card className="overflow-hidden">
                  <div className="h-2 bg-teal-600"></div>
                  <CardContent className="p-2">
                    <div className="text-xs">Estándar</div>
                  </CardContent>
                </Card>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="modern" id="modern" />
              <Label htmlFor="modern" className="cursor-pointer">
                <Card className="overflow-hidden">
                  <div className="h-2 bg-blue-600"></div>
                  <CardContent className="p-2">
                    <div className="text-xs">Moderna</div>
                  </CardContent>
                </Card>
              </Label>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="minimal" id="minimal" />
              <Label htmlFor="minimal" className="cursor-pointer">
                <Card className="overflow-hidden">
                  <div className="h-2 bg-gray-800"></div>
                  <CardContent className="p-2">
                    <div className="text-xs">Minimalista</div>
                  </CardContent>
                </Card>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Color principal</h3>
        <div className="flex items-center gap-4">
          <Input
            type="color"
            value={options.color}
            onChange={handleColorChange}
            className="w-16 h-10 p-1 cursor-pointer"
          />
          <div className="text-sm">{options.color}</div>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {["#20B2AA", "#2563EB", "#10B981", "#F97316", "#EF4444", "#000000"].map((color) => (
            <div
              key={color}
              className="w-8 h-8 rounded-full cursor-pointer border"
              style={{ backgroundColor: color }}
              onClick={() => setOptions({ ...options, color })}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
