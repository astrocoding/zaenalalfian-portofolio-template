import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const typePrefix = (formData.get("prefix") as string) || "blogs";

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

      // Generate format: blogs-randomizecodenumber.webp
      const randomCode = `${Math.floor(10000000 + Math.random() * 90000000)}-${Date.now().toString().slice(-6)}`;
      const filename = `${typePrefix}-${randomCode}.webp`;
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
  } catch (error: unknown) {
    console.error("Error processing image upload:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to process image upload.";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let url = searchParams.get("url");

    if (!url) {
      const body = await req.json().catch(() => ({}));
      url = body.url;
    }

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { success: false, error: "Image URL is required for deletion." },
        { status: 400 }
      );
    }

    // Only allow deleting images inside /upload/img/
    if (url.startsWith("/upload/img/") || url.includes("upload/img")) {
      const filename = path.basename(url);
      const filePath = path.join(process.cwd(), "public/upload/img", filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return NextResponse.json({
          success: true,
          message: `File ${filename} deleted physically.`,
        });
      }
    }

    return NextResponse.json(
      { success: false, message: "File not found or not in upload directory." },
      { status: 404 }
    );
  } catch (error: unknown) {
    console.error("Error deleting image file:", error);
    const errMessage = error instanceof Error ? error.message : "Failed to delete image file.";
    return NextResponse.json(
      { success: false, error: errMessage },
      { status: 500 }
    );
  }
}
