// app/api/logout/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Forward the cookie to Django backend
    const cookie = req.headers.get("cookie");

    const res = await fetch("http://localhost:8000/administrators/admin/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ✅ Send cookie to backend
        cookie: cookie || "",
      },
    });

    const data = await res.json();

    // Also clear the cookie on the client side
    const response = NextResponse.json(data, { status: res.status });
    response.cookies.set("sessionToken", "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
