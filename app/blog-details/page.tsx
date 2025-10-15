'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Blog = {
  id: string
  title: string
  author: string
  image: string
  content: string
  date: string
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('blogs') || '[]')
    setBlogs(data)
  }, [])

  return (
    <div className="py-10 px-6 md:px-20">
      <h1 className="text-3xl font-bold text-center mb-8">Latest Blogs</h1>
      {blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found. Add one!</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Card
              key={blog.id}
              className="overflow-hidden hover:shadow-2xl transition-transform hover:-translate-y-1 border border-gray-200 rounded-2xl"
            >
              <Image
                src={blog.image}
                alt={blog.title}
                width={500}
                height={300}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">By {blog.author} • {blog.date}</p>
                <p className="text-gray-600 line-clamp-3 mb-4">{blog.content}</p>
                <Link href={`/blogs/${blog.id}`}>
                  <Button variant="outline" className="w-full">Read More</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
