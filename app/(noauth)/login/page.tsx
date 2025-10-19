'use client'

import IconFacebook from '@/components/icons/icon-facebook'
import IconGoogle from '@/components/icons/icon-google'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AtSign, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.email || !form.password) {
      setError('Email and password are required.')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-[400px] space-y-[30px] p-5 shadow-sm md:w-[400px]">
        <CardHeader className="space-y-2 text-center">
          <h2 className="text-lg font-semibold text-black lg:text-xl/tight">
            Sign In to your account
          </h2>
          <p className="font-medium leading-tight">
            Enter your details to proceed future
          </p>
        </CardHeader>

        <CardContent className="space-y-[30px]">
          <div className="flex items-center gap-2.5">
            <span className="h-px w-full bg-[#E2E4E9]" />
            <p className="shrink-0 font-medium leading-tight">Login with email</p>
            <span className="h-px w-full bg-[#E2E4E9]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-[30px]">
            <div>
              <label className="block font-semibold leading-none text-black">
                Email address
              </label>
              <Input
                type="email"
                placeholder="username@domain.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                iconRight={<AtSign className="size-[18px]" />}
              />
            </div>

            <div>
              <label className="block font-semibold leading-none text-black">
                Password
              </label>
              <Input
                type="password"
                placeholder="Abc*********"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-500">
                <TriangleAlert className="size-[18px] shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Link
              href="/forgot"
              className="block text-right text-xs font-semibold text-black underline underline-offset-[3px] hover:text-[#3C3C3D]"
            >
              Forgot password?
            </Link>

            <Button
              type="submit"
              variant="black"
              size="large"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
