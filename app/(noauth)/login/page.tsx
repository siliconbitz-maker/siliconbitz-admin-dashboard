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
  const [fullPageLoading, setFullPageLoading] = useState(false) // full page loader

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.email || !form.password) {
      setError('Email and password are required.')
      return
    }

    try {
      setLoading(true)
      setFullPageLoading(true)

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

      // Successful login -> redirect
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setFullPageLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      {/* Full Page Loader */}
      {fullPageLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <Card className="w-full max-w-[400px] p-6 space-y-6 shadow-lg rounded-lg md:w-[400px]">
        <CardHeader className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-[#1E3A8A]">Sign In to your account</h2>
          <p className="text-sm text-gray-600">Enter your credentials to continue</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Email</label>
              <Input
                type="email"
                placeholder="username@domain.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                iconRight={<AtSign className="w-5 h-5" />}
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Password</label>
              <Input
                type="password"
                placeholder="********"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm font-medium">
                <TriangleAlert className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}

            <Link
              href="/forgot"
              className="block text-right text-xs font-semibold text-gray-700 underline hover:text-gray-900"
            >
              Forgot password?
            </Link>

            <Button
              type="submit"
              variant="black"
              size="large"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
