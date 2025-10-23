'use client'

import { useState } from 'react'

export default function ApplyPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const formData = new FormData(e.currentTarget)

    const res = await fetch('/api/apply', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      setMessage('CV submitted successfully!')
     
    } else {
      const err = await res.json()
      setMessage(err.error || 'Failed to submit')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Apply Now</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Full Name" required className="w-full border p-2 rounded" />
        <input type="email" name="email" placeholder="Email" required className="w-full border p-2 rounded" />
        <input name="phone" placeholder="Phone" required className="w-full border p-2 rounded" />
        <textarea name="about" placeholder="Tell something about you (max 100 words)" maxLength={600} required className="w-full border p-2 rounded" />
        <input type="file" name="cv" accept="application/pdf" required className="w-full border p-2 rounded" />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {loading ? 'Submitting...' : 'Submit CV'}
        </button>
      </form>
      {message && <p className="mt-3 text-center text-green-600">{message}</p>}
    </div>
  )
}
