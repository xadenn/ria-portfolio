import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isServerAdminAuthenticated } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const isAuth = await isServerAdminAuthenticated(req);
    if (!isAuth) {
      return NextResponse.json(
        { error: "Administrative authentication required" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided in form data" },
        { status: 400 }
      );
    }

    // Limit upload file size to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Ensure public/uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Clean filename
    const ext = path.extname(file.name) || ".png";
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .slice(0, 30);
    const filename = `${baseName}-${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    // 2. Save file copy to public/uploads
    await fs.writeFile(filePath, buffer);

    // 3. Generate base64 Data URI for direct database storage
    const mimeType = file.type || "image/png";
    const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;
    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json(
      {
        success: true,
        filename,
        publicUrl,
        dataUri,
        size: file.size,
        mimeType,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process image upload" },
      { status: 500 }
    );
  }
}
