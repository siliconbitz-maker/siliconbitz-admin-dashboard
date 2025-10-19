'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type Item = { id?: string; description: string; price: number }
type Invoice = {
  id: string
  name: string
  company: string
  amount: number
  date: string
  items: Item[]
  user: { email: string }
}

export default function InvoiceDetails() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/invoiceDetails', { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch invoices')
      const data: Invoice[] = await res.json()
      setInvoices(data)
    } catch (err) {
      console.error(err)
      alert('Failed to fetch invoices. Are you logged in?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  const handlePrint = (invoice: Invoice) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const dateStr = new Date(invoice.date).toLocaleString()

    const html = `
<html>
  <head>
    <title>Invoice</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; color: #222; }
      header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
      h1 { margin: 0; font-size: 28px; }
      h2 { margin-bottom: 5px; font-size: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #333; padding: 8px; text-align: left; }
      tfoot td { font-weight: bold; }
      .declaration { margin-top: 40px; font-size: 14px; line-height: 1.6; }
      .signature-section { display: flex; justify-content: space-between; margin-top: 60px; }
      .signature { text-align: center; width: 45%; }
      .signature-line { margin-top: 40px; border-top: 1px solid #000; width: 100%; }
    </style>
  </head>
  <body>
    <header>
      <div>
        <h1>Siliconbitz</h1>
      </div>
      <div>
        <p>${dateStr}</p>
      </div>
    </header>

    <h2>${invoice.name}</h2>
    <p> Company/Transaction ID: ${invoice.company}</p>
    <p>Created by: ${invoice.user.email}</p>

    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.items
          .map(
            (item, i) =>
              `<tr>
                <td>${i + 1}</td>
                <td>${item.description}</td>
                <td>${item.price.toFixed(2)} Taka</td>
              </tr>`
          )
          .join('')}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2">Total</td>
          <td>${invoice.amount.toFixed(2)} Taka</td>
        </tr>
      </tfoot>
    </table>

    <div class="declaration">
      <h3>Declaration</h3>
      <p>
        We hereby declare that the information provided in this invoice is true and correct.
        Goods and/or services mentioned herein have been supplied as per the terms agreed.
      </p>
    </div>

    <div class="signature-section">
      <div class="signature">
      <strong>Sabbir Hasan</strong>
        <div class="signature-line"></div>
        <p>Authorised Signature</p>
        
      </div>
      <div class="signature">
      <strong>${invoice.name}</strong>
        <div class="signature-line"></div>
        <p>Customer Signature</p>
        
      </div>
    </div>
  </body>
</html>
`

    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.print()
  }

  if (loading) return <p className="text-center mt-8">Loading invoices...</p>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Invoices</h1>

      {invoices.length === 0 && <p>No invoices found.</p>}

      <div className="space-y-4">
        {invoices.map((inv, idx) => (
          <div
            key={inv.id}
            className="flex justify-between items-center p-4 border rounded-lg bg-gray-50 hover:shadow-md cursor-pointer"
            onClick={() => setSelectedInvoice(inv)}
          >
            {/* Left side: Company and Name */}
            <div className="flex flex-col">
              <p className="font-semibold text-gray-800">Company Name/Transection Id: {inv.company}</p>
              <p className="text-sm text-gray-600">{inv.name}</p>
            </div>

            {/* Right side: Date/Time */}
            <div className="text-right text-xs text-gray-500">
              {new Date(inv.date).toLocaleDateString()} <br />
              {new Date(inv.date).toLocaleTimeString()}
            </div>

            <div className="flex gap-2 ml-4">
              <Button variant="default" onClick={() => handlePrint(inv)}>
                Print
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl">
            <table className="w-full border mt-4 border-collapse">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.description}</td>
                    <td>{item.price.toFixed(2)} Taka</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-right font-bold mt-2">
              Total: {selectedInvoice.amount.toFixed(2)} Taka
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={() => setSelectedInvoice(null)}>Close</Button>
              <Button
                onClick={() => {
                  handlePrint(selectedInvoice)
                  setSelectedInvoice(null)
                }}
              >
                Print
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
