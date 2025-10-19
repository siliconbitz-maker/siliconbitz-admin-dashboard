'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AtSign, User } from 'lucide-react'

import { toast } from 'sonner'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const isAdmin = userEmail === 'admin@siliconbitz.com'
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.name || !form.email || !form.password)
      return setError('All fields are required.')

    if (form.password !== form.confirm)
      return setError('Passwords do not match.')

    try {
      setLoading(true)
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to register')

      setSuccess(true)
      setForm({ name: '', email: '', password: '', confirm: '' })
      toast.success('Your account has been created successfully!')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch logged-in user
    fetch('/api/me')
      .then(res => res.json())
      .then(data => setUserEmail(data.user?.email || null))
  }, [])

  return (
    <div className="w-full gap-5 p-4">
      {isAdmin && (
        <div className="flex overflow-y-auto py-2">
          <Card className="m-auto w-full max-w-[400px] space-y-[30px] p-5 shadow-sm md:w-[400px]">
            <CardHeader className="space-y-2">
              <h2 className="text-xl font-semibold text-black">Getting started</h2>
              <p className="font-medium leading-tight">Create an account to connect with people.</p>
            </CardHeader>

            <CardContent className="space-y-[30px]">
              <div className="flex items-center gap-2.5">
                <span className="h-px w-full bg-[#E2E4E9]" />
                <p className="shrink-0 font-medium leading-tight">register with email</p>
                <span className="h-px w-full bg-[#E2E4E9]" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-[30px]">
                <div>
                  <label className="block font-semibold text-black">Your name</label>
                  <Input
                    type="text"
                    placeholder="Victoria Gillham"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    iconRight={<User className="size-[18px]" />}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-black">Email address</label>
                  <Input
                    type="email"
                    placeholder="username@domain.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    iconRight={<AtSign className="size-[18px]" />}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-black">Create password</label>
                  <Input
                    type="password"
                    placeholder="Abc*********"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-black">Confirm password</label>
                  <Input
                    type="password"
                    placeholder="Abc*********"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  />
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <Button type="submit" variant="black" size="large" disabled={loading} className="w-full">
                  {loading ? 'Registering...' : 'Register'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

      )}


    </div>
  )
}
