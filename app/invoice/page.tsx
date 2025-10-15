'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

export default function InvoiceForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [items, setItems] = useState<Item[]>([{ description: '', price: 0 }])
  const [showModal, setShowModal] = useState(false)
  const [savedInvoice, setSavedInvoice] = useState<Invoice | null>(null)

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string | number
  ) => {
    setItems((prevItems) => {
      const newItems = [...prevItems]
      if (field === 'price') {
        newItems[index][field] = Number(value) as any
      } else {
        newItems[index][field] = String(value) as any
      }
      return newItems
    })
  }

  const addItem = () => setItems([...items, { description: '', price: 0 }])
  const removeItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index))

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0)

  const handleSave = () => {
    const invoice: Invoice = {
      id: Date.now().toString(),
      name,
      company,
      amount: totalAmount,
      date: new Date().toISOString(),
      items,
    }

    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]')
    localStorage.setItem(
      'invoices',
      JSON.stringify([...storedInvoices, invoice])
    )

    setSavedInvoice(invoice)
    setShowModal(true)
  }

  return (
    <div className="p-8 mt-24 max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Invoice</h1>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label>Invoice Name</Label>
          <Input
            className="bg-gray-100 text-gray-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label>Company Name</Label>
          <Input
            className="bg-gray-100 text-gray-800"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
      </div>

      {/* Items Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Items</h2>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 mb-2 bg-gray-100 p-2 rounded"
          >
            <Input
              placeholder="Description"
              className="flex-1 bg-gray-100 text-gray-800"
              value={item.description}
              onChange={(e) =>
                handleItemChange(index, 'description', e.target.value)
              }
            />
            <Input
              type="number"
              placeholder="Price"
              className="w-24 bg-gray-100 text-gray-800"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
            />
            {items.length > 1 && (
              <Button
               
                className="px-2 py-1"
                onClick={() => removeItem(index)}
              >
                ✕
              </Button>
            )}
          </div>
        ))}
        <Button variant="outline" onClick={addItem} className="mt-2">
          + Add Item
        </Button>
      </div>

      <div className="mb-6 text-right">
        <p className="text-gray-700 font-semibold">Total: ${totalAmount}</p>
      </div>

      <Button onClick={handleSave}>Save Invoice</Button>

      {/* Modern Modal */}
      {showModal && savedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl relative animate-fadeIn">
            {/* Close Icon */}
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Invoice Preview
            </h2>
            <p className="text-gray-700 mb-2">
              <strong>Invoice Name:</strong> {savedInvoice.name}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Company:</strong> {savedInvoice.company}
            </p>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-3 py-2 border text-gray-700">#</th>
                    <th className="px-3 py-2 border text-gray-700">Description</th>
                    <th className="px-3 py-2 border text-gray-700">Price ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {savedInvoice.items.map((item, i) => (
                    <tr key={i} className="even:bg-gray-50">
                      <td className="px-3 py-2 border">{i + 1}</td>
                      <td className="px-3 py-2 border">{item.description}</td>
                      <td className="px-3 py-2 border">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <p className="text-right font-bold mt-4 text-gray-800">
              Total: ${savedInvoice.amount}
            </p>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-2">
              <Button
               
                onClick={() => setShowModal(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowModal(false)
                  router.push('/invoiceDetails')
                }}
              >
                Go to Invoice Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
