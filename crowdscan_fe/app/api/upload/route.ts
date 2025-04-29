import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const djangoResponse = await fetch("http://localhost:8000/users/create/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!djangoResponse.ok) {
      const errorData = await djangoResponse.json();
      return NextResponse.json({ error: errorData.error || "Upload failed" }, { status: djangoResponse.status });
    }

    return NextResponse.json(await djangoResponse.json());

  } catch (error: unknown) {
    console.error('Upload error:', error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
