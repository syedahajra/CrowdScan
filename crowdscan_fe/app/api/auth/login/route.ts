// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const djangoRes = await fetch("http://localhost:8000/administrators/admin/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await djangoRes.json();

    const response = new NextResponse(JSON.stringify(data), {
      status: djangoRes.status,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // 👇 Pass the Django Set-Cookie header through
    const setCookie = djangoRes.headers.get("set-cookie");
    if (setCookie) {
      response.headers.set("set-cookie", setCookie);
    }

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
