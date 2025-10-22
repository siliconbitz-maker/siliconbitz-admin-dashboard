'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2, Eye, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { LoadingSpinner } from '../../../components/ui/loading'

type Blog = {
  id: string
  title: string
  description: string
  author: string
  images: string[]
  createdAt: string
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchBlogs() {
    try {
      setLoading(true)
      const res = await fetch('/api/blog')
      if (!res.ok) throw new Error('Failed to fetch blogs')
      const data = await res.json()
      setBlogs(data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load blogs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this blog?')) return
    try {
      const res = await fetch('/api/blog', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('Failed to delete')
      toast.success('Blog deleted successfully')
      fetchBlogs()
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete blog')
    }
  }

  if (loading) return <LoadingSpinner text="Loading blogs..." />

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Card
        className="shadow-lg border"
        style={{ borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', borderRadius: '0.5rem' }}
      >
        <CardHeader className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 sm:py-6 gap-4 sm:gap-0">
          <h2 className="text-3xl sm:text-4xl font-semibold" style={{ color: '#1F2937' }}>
             All Blogs
          </h2>
          <Link href="/blog/new">
            <Button
              style={{ backgroundColor: '#6366F1', color: '#FFFFFF' }}
              className="hover:bg-[#4F46E5]"
            >
              + New Blog
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="px-6 sm:px-8 py-6 sm:py-8">
          {blogs.length === 0 ? (
            <p className="text-center py-6" style={{ color: '#6B7280' }}>
              No blogs available yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow style={{ backgroundColor: '#F3F4F6', color: '#374151' }}>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Images</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map(blog => (
                    <TableRow
                      key={blog.id}
                      className="hover:bg-gray-50 transition-colors"
                      style={{ borderBottom: '1px solid #E5E7EB' }}
                    >
                      <TableCell className="font-medium" style={{ color: '#111827' }}>
                        {blog.title}
                      </TableCell>
                      <TableCell style={{ color: '#1F2937' }}>{blog.author}</TableCell>
                      <TableCell style={{ color: '#374151' }}>
                        {new Date(blog.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {blog.images.slice(0, 3).map((img, i) => (
                            <Image
                              key={i}
                              src={img}
                              alt="blog"
                              width={40}
                              height={40}
                              className="rounded-md border object-cover"
                              style={{ borderColor: '#D1D5DB' }}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button
                          className="hover:scale-105 transition-transform"
                          style={{ borderColor: '#D1D5DB', color: '#EF4444' }}
                          onClick={() => handleDelete(blog.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
