//api/blog

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(blogs);
  } catch (err) {
    console.error("GET /api/blog error:", err);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const author = formData.get("author") as string;
    const files = formData.getAll("images") as File[];

    const uploadedUrls = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
        const res = await cloudinary.v2.uploader.upload(base64, {
          folder: "blogs",
        });
        return res.secure_url;
      })
    );

    const blog = await prisma.blog.create({
      data: { title, description, author, images: uploadedUrls },
    });

    return NextResponse.json(blog);
  } catch (err) {
    console.error("POST /api/blog error:", err);
    return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/blog error:", err);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
