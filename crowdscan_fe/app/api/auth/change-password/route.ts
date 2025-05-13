import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const cookie = req.headers.get("cookie"); // Get cookies from client request

  const res = await fetch('http://localhost:8000/administrators/admin/change-password/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Forward cookies to Django
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return new NextResponse(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
