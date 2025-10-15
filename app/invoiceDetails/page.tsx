'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type Item = {
  description: string
  price: number
}

type Invoice = {
  id: string
  name: string
  company: string
  amount: number
  date: string
  items: Item[]
}

export default function InvoiceDetails() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]')
    storedInvoices.sort(
      (a: Invoice, b: Invoice) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    setInvoices(storedInvoices)
  }, [])

  const handleDelete = (id: string) => {
    const filtered = invoices.filter((inv) => inv.id !== id)
    setInvoices(filtered)
    localStorage.setItem('invoices', JSON.stringify(filtered))
  }

  const handlePrint = (invoice: Invoice) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const html = `
      <html>
        <head>
          <title>Invoice - ${invoice.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            h1 { text-align: center; color: #222; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f0f0f0; }
            tfoot td { font-weight: bold; }
            .company { text-align: right; margin-top: -40px; font-size: 14px; color: #555; }
            .info { margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Invoice</h1>
          <div class="company">Siliconbitz</div>
          <div class="info">
            <p><strong>Invoice Name:</strong> ${invoice.name}</p>
            <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Price ($)</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.items
                .map(
                  (item, idx) =>
                    `<tr>
                      <td>${idx + 1}</td>
                      <td>${item.description}</td>
                      <td>${item.price.toFixed(2)}</td>
                    </tr>`
                )
                .join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2">Total</td>
                <td>$${invoice.amount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Invoices</h1>

      <div className="space-y-4">
        {invoices.map((inv, idx) => (
          <div
            key={inv.id}
            className="flex justify-between items-center p-4 border rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            <div onClick={() => setSelectedInvoice(inv)} className="flex-1">
              <p className="font-semibold">
                {idx + 1}. {inv.name}
              </p>
              <p className="text-sm text-gray-500">Company Name: {inv.company}</p>
              <p className="text-sm text-gray-400">
                {new Date(inv.date).toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
               
                onClick={() => handleDelete(inv.id)}
              >
                Delete
              </Button>
              <Button
                variant="default"
               
                onClick={() => handlePrint(inv)}
              >
                Print
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl relative animate-fadeIn">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setSelectedInvoice(null)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Invoice Preview
            </h2>
            <p className="text-gray-700 mb-2">
              <strong>Invoice Name:</strong> {selectedInvoice.name}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Company:</strong> {selectedInvoice.company}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Date:</strong>{' '}
              {new Date(selectedInvoice.date).toLocaleString()}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 border">#</th>
                    <th className="px-3 py-2 border">Description</th>
                    <th className="px-3 py-2 border">Price ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      <td className="px-3 py-2 border">{i + 1}</td>
                      <td className="px-3 py-2 border">{item.description}</td>
                      <td className="px-3 py-2 border">{item.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={2} className="px-3 py-2 border font-bold">
                      Total
                    </td>
                    <td className="px-3 py-2 border font-bold">
                      ${selectedInvoice.amount.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  handlePrint(selectedInvoice)
                  setSelectedInvoice(null)
                }}
              >
                Print Invoice
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
