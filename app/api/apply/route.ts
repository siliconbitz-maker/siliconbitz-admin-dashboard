import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const about = formData.get("about") as string;
    const file = formData.get("cv") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "cvs" },
      async (error, result) => {
        if (error) throw error;
      }
    );

    // Cloudinary upload promise wrapper
    const pdfUrl = await new Promise<string>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { resource_type: "raw", folder: "cvs" },
        (err, result) => {
          if (err) return reject(err);
          resolve(result!.secure_url);
        }
      );
      upload.end(buffer);
    });

    // Save to DB
    const cv = await prisma.cV.create({
      data: { name, email, phone, about, pdfUrl },
    });

    return NextResponse.json(cv);
  } catch (err) {
    console.error("Apply error:", err);
    return NextResponse.json({ error: "Failed to submit CV" }, { status: 500 });
  }
}
