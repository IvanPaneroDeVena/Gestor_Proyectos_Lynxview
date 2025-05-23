"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"

interface FacturaTemplateProps {
  factura: any
  options: {
    includeCompanyLogo: boolean
    includeFooter: boolean
    includeBankDetails: boolean
    includePaymentTerms: boolean
    includeSignature: boolean
    template: string
    color: string
  }
}

export function FacturaTemplate({ factura, options }: FacturaTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Aplicar el color personalizado a los elementos de la factura
  useEffect(() => {
    if (containerRef.current) {
      const headers = containerRef.current.querySelectorAll(".factura-header")
      headers.forEach((header) => {
        ;(header as HTMLElement).style.borderColor = options.color
        ;(header as HTMLElement).style.color = options.color
      })

      const borders = containerRef.current.querySelectorAll(".factura-border")
      borders.forEach((border) => {
        ;(border as HTMLElement).style.borderColor = options.color
      })
    }
  }, [options.color])

  // Calcular subtotal, impuestos y total
  const subtotal = factura.detalles.reduce((sum: number, item: any) => sum + item.importe, 0)
  const impuestos = (subtotal * factura.impuestos) / 100
  const total = subtotal + impuestos

  return (
    <div ref={containerRef} className="factura-container text-sm">
      {/* Cabecera de la factura */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1">
          {options.includeCompanyLogo && (
            <div className="mb-4">
              <Image
                src="/placeholder.svg?height=60&width=200"
                alt="Logo de Lynx View"
                width={200}
                height={60}
                className="object-contain"
              />
            </div>
          )}
          <div>
            <h2 className="text-lg font-bold">Lynx View S.L.</h2>
            <p>Calle Tecnología, 42</p>
            <p>03001 Alicante, España</p>
            <p>CIF: B12345678</p>
            <p>Teléfono: +34 965 123 456</p>
            <p>Email: facturacion@lynxview.es</p>
          </div>
        </div>

        <div className="text-right">
          <h1 className="text-2xl font-bold factura-header pb-1 border-b-2 mb-4">FACTURA</h1>
          <table className="ml-auto">
            <tbody>
              <tr>
                <td className="font-semibold pr-4">Nº Factura:</td>
                <td>{factura.id}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Fecha de emisión:</td>
                <td>{factura.fechaEmision}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Fecha de vencimiento:</td>
                <td>{factura.fechaVencimiento}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Proyecto:</td>
                <td>{factura.proyecto}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Datos del cliente */}
      <div className="mb-8 p-4 border rounded-md factura-border">
        <h3 className="font-bold mb-2 factura-header">DATOS DEL CLIENTE</h3>
        <div>
          <p className="font-semibold">{factura.clienteInfo.nombre}</p>
          <p>{factura.clienteInfo.direccion}</p>
          <p>
            {factura.clienteInfo.codigoPostal} {factura.clienteInfo.ciudad}
          </p>
          <p>CIF/NIF: {factura.clienteInfo.cif}</p>
          <p>Email: {factura.clienteInfo.email}</p>
          <p>Teléfono: {factura.clienteInfo.telefono}</p>
        </div>
      </div>

      {/* Detalles de la factura */}
      <div className="mb-8">
        <h3 className="font-bold mb-2 pb-1 border-b-2 factura-header">DETALLES DE LA FACTURA</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Concepto</th>
              <th className="border p-2 text-right">Horas</th>
              <th className="border p-2 text-right">Tarifa (€/h)</th>
              <th className="border p-2 text-right">Importe (€)</th>
            </tr>
          </thead>
          <tbody>
            {factura.detalles.map((detalle: any, index: number) => (
              <tr key={index}>
                <td className="border p-2">{detalle.concepto}</td>
                <td className="border p-2 text-right">{detalle.horas}</td>
                <td className="border p-2 text-right">{detalle.tarifa.toFixed(2)} €</td>
                <td className="border p-2 text-right">{detalle.importe.toFixed(2)} €</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen de la factura */}
      <div className="flex justify-end mb-8">
        <table className="w-64">
          <tbody>
            <tr>
              <td className="font-semibold p-2">Subtotal:</td>
              <td className="text-right p-2">{subtotal.toFixed(2)} €</td>
            </tr>
            <tr>
              <td className="font-semibold p-2">IVA ({factura.impuestos}%):</td>
              <td className="text-right p-2">{impuestos.toFixed(2)} €</td>
            </tr>
            <tr className="border-t">
              <td className="font-bold p-2">TOTAL:</td>
              <td className="text-right font-bold p-2">{total.toFixed(2)} €</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Condiciones de pago */}
      {options.includePaymentTerms && (
        <div className="mb-8">
          <h3 className="font-bold mb-2 pb-1 border-b-2 factura-header">CONDICIONES DE PAGO</h3>
          <p>El pago debe realizarse en un plazo de 30 días a partir de la fecha de emisión de la factura.</p>
          <p>En caso de retraso en el pago, se aplicarán intereses de demora según la legislación vigente.</p>
        </div>
      )}

      {/* Datos bancarios */}
      {options.includeBankDetails && (
        <div className="mb-8">
          <h3 className="font-bold mb-2 pb-1 border-b-2 factura-header">DATOS BANCARIOS</h3>
          <p>Banco: Banco Sabadell</p>
          <p>IBAN: ES12 0081 1234 5678 9012 3456</p>
          <p>SWIFT/BIC: BSABESBB</p>
          <p>Titular: Lynx View S.L.</p>
          <p className="mt-2">
            <span className="font-semibold">Referencia:</span> {factura.id}
          </p>
        </div>
      )}

      {/* Firma */}
      {options.includeSignature && (
        <div className="mb-8">
          <div className="flex justify-end">
            <div className="text-center">
              <div className="mb-4 h-20 border-b border-dashed border-gray-400 w-48"></div>
              <p className="font-semibold">Firma y sello</p>
              <p>Lynx View S.L.</p>
            </div>
          </div>
        </div>
      )}

      {/* Pie de página */}
      {options.includeFooter && (
        <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t">
          <p>Lynx View S.L. - CIF: B12345678</p>
          <p>Calle Tecnología, 42, 03001 Alicante - Tel: +34 965 123 456 - www.lynxview.es</p>
          <p>Inscrita en el Registro Mercantil de Alicante, Tomo 1234, Folio 56, Hoja A-12345, Inscripción 1ª</p>
        </div>
      )}
    </div>
  )
}
