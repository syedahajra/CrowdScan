import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const name = formData.get("name") as string;
    const cnic = formData.get("cnic") as string;
    const address = formData.get("address") as string;

    // Validation checks
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    if (!name || !cnic || !address) {
      return NextResponse.json({ error: "Name, CNIC, and address are required" }, { status: 400 });
    }

    if (cnic.length !== 13) {
      return NextResponse.json({ error: "CNIC must be exactly 13 characters long" }, { status: 400 });
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

    // Send to Django backend
    const djangoResponse = await fetch("http://localhost:8000/users/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        name, 
        cnic, 
        address, 
        images: uploadedFiles.map(file => file.base64) 
      }),
    });

    const djangoResult = await djangoResponse.json();

    if (!djangoResponse.ok) {
      return NextResponse.json({ error: djangoResult.error }, { status: djangoResponse.status });
    }

    return NextResponse.json({
      message: "Search completed successfully",
      result: djangoResult,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
