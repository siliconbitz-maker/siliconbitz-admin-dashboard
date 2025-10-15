'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type Blog = {
  id: string
  title: string
  author: string
  image: string
  content: string
  date: string
}

export default function AddBlogPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title: '', author: '', image: '', content: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newBlog: Blog = {
      id: Date.now().toString(),
      title: form.title,
      author: form.author,
      image: form.image || '/placeholder.png',
      content: form.content,
      date: new Date().toLocaleDateString(),
    }

    const existing = JSON.parse(localStorage.getItem('blogs') || '[]')
    localStorage.setItem('blogs', JSON.stringify([...existing, newBlog]))
    router.push('/blog-details')
  }

  return (
    <div className="flex justify-center py-12">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Add New Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Title</Label>
              <Input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <Label>Author</Label>
              <Input name="author" value={form.author} onChange={handleChange} required />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
            </div>
            <div>
              <Label>Content</Label>
              <Textarea name="content" value={form.content} onChange={handleChange} required />
            </div>
            <Button type="submit" className="w-full">Publish Blog</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
