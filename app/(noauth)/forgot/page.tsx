'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AtSign } from 'lucide-react'

export default function Forgot() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/me') // fetch logged-in user info
      .then((res) => res.json())
      .then((data) => data.user?.email && setEmail(data.user.email))
      .catch(() => setEmail(''))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!email) {
      setError('Email is required')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send reset email')
      setMessage('Password reset instructions sent to your email!')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full gap-5 p-4">
      <div className="flex overflow-y-auto py-2">
        <Card className="m-auto w-full max-w-[400px] space-y-[30px] p-5 shadow-sm md:w-[400px]">
          <CardHeader className="space-y-2">
            <h2 className="text-xl/tight font-semibold text-black">Forgot password</h2>
            <p className="font-medium leading-tight">Click submit to send password reset instructions to your email.</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-[30px]">
              <div className="relative space-y-3">
                <label className="block font-semibold leading-none text-black">Email address</label>
                <Input
                  type="email"
                  variant="input-form"
                  placeholder="username@domain.com"
                  value={email}
                  readOnly
                  iconRight={<AtSign className="size-[18px]" />}
                />
              </div>

              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
              {message && <p className="text-xs text-green-500 font-medium">{message}</p>}

              <Button type="submit" variant="black" size="large" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
