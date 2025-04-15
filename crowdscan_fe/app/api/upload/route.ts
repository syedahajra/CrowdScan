import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    // Validation check for file upload
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadedFiles: { name: string; base64: string }[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64String = buffer.toString("base64");

      uploadedFiles.push({
        name: file.name,
        base64: base64String,
      });
    }

    // Send images to Django backend
    const djangoResponse = await fetch("http://localhost:8000/images/upload/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ images: uploadedFiles.map(file => file.base64) }),
    });

    const djangoResult = await djangoResponse.json();

    if (!djangoResponse.ok) {
      return NextResponse.json({ error: djangoResult.error }, { status: djangoResponse.status });
    }

    return NextResponse.json({
      message: "Image upload completed successfully",
      result: djangoResult,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
