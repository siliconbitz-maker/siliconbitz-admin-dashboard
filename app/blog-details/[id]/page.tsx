'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

type Blog = {
  id: string
  title: string
  author: string
  image: string
  content: string
  date: string
}

export default function BlogDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<Blog | null>(null)

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('blogs') || '[]')
    const found = data.find((b: Blog) => b.id === id)
    setBlog(found || null)
  }, [id])

  if (!blog) return <p className="text-center py-20 text-gray-500">Blog not found.</p>

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <Button  onClick={() => router.back()} className="mb-4">← Back</Button>
      <div className="overflow-hidden rounded-2xl shadow-lg border border-gray-200">
        <Image
          src={blog.image}
          alt={blog.title}
          width={800}
          height={500}
          className="w-full h-80 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
          <p className="text-sm text-gray-500 mb-6">By {blog.author} • {blog.date}</p>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{blog.content}</p>
        </div>
      </div>
    </div>
  )
}
