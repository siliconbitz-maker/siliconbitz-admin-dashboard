'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { ImagePlus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CreateBlogPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')
  const [images, setImages] = useState<FileList | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !description || !author) {
      toast.warning('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('author', author)
      if (images) Array.from(images).forEach(img => formData.append('images', img))

      const res = await fetch('/api/blog', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Failed to create blog')

      toast.success('Blog created successfully!')
      router.push('/blog')
    } catch (err) {
      console.error(err)
      toast.error('Error creating blog')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card className="shadow-lg border" style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: '0.5rem' }}>
        <CardHeader className="px-6 py-4 sm:py-6">
          <h2 className="text-3xl sm:text-4xl font-semibold" style={{ color: '#1F2937', textAlign: 'center',}}>
            📝 Create New Blog
          </h2>
        </CardHeader>
        <CardContent className="px-6 sm:px-8 py-6 sm:py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="Blog Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="border"
                style={{ borderColor: '#D1D5DB', color: '#111827', outlineColor: '#6366F1' }}
                required
              />
              <Input
                placeholder="Author Name"
                value={author}
                onChange={e => setAuthor(e.target.value)}
                className="border"
                style={{ borderColor: '#D1D5DB', color: '#111827', outlineColor: '#6366F1' }}
                required
              />
            </div>

            <Textarea
              placeholder="Write your blog description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="border"
              style={{ minHeight: '150px', borderColor: '#D1D5DB', color: '#111827', outlineColor: '#6366F1' }}
              required
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium" style={{ color: '#4B5563' }}>
                <ImagePlus className="w-5 h-5" style={{ color: '#6366F1' }} />
                <span>Upload Images</span>
                <Input
                  type="file"
                  multiple
                  onChange={e => setImages(e.target.files)}
                  className="hidden"
                />
              </label>
              {images && (
                <span className="text-sm" style={{ color: '#6B7280', marginTop: '0.25rem',  }}>
                  {images.length} file(s) selected
                </span>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center w-full sm:w-auto px-6 py-2 rounded-md"
              style={{
                backgroundColor: loading ? '#A5B4FC' : '#6366F1',
                color: '#FFFFFF',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" /> Publishing...
                </>
              ) : (
                'Publish Blog'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
