import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Forward cookies to Django backend
    const djangoRes = await fetch('http://localhost:8000/administrators/admin/session/check/', {
      method: 'GET',
      headers: {
        Cookie: req.headers.get('cookie') || '', // Forward client's cookie
      },
    });

    const data = await djangoRes.json();
    return new NextResponse(JSON.stringify(data), {
      status: djangoRes.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
