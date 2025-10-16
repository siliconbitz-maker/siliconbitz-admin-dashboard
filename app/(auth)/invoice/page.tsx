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

  const handleSave = async () => {
  try {
    const token = localStorage.getItem('token') // store JWT after login
    const res = await fetch('/api/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, company, items }),
    })

    if (!res.ok) throw new Error('Failed to save invoice')

    router.push('/invoiceDetails') 
  } catch (err) {
    console.error(err)
    alert('Failed to save invoice. Make sure you are logged in.')
  }
}


  return (
    <div className="p-8 mt-24 max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Invoice</h1>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <Label>Invoice Name </Label>
          <Input
            className="bg-gray-100 text-gray-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label>Company Name / Transection ID</Label>
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
        <p className="text-gray-700 font-semibold">Total: {totalAmount} Taka</p>
      </div>

      <Button onClick={handleSave}>Show Invoice</Button>
    </div>
  )
}
