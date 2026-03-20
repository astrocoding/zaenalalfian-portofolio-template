import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files provided for upload." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public/upload/img");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename with .webp extension
      const filename = `project-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.webp`;
      const filePath = path.join(uploadDir, filename);

      // Compress and convert image to WebP using sharp
      await sharp(buffer)
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(filePath);

      uploadedUrls.push(`/upload/img/${filename}`);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (error: any) {
    console.error("Error processing image upload:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process image upload." },
      { status: 500 }
    );
  }
}
