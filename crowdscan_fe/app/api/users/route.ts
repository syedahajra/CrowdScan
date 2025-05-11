// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
    try {
        const headersList = await headers();
        const authHeader = headersList.get('Authorization');

        const response = await fetch("http://localhost:8000/administrators/admin/", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader || ''
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const headersList = await headers();
        const authHeader = headersList.get('Authorization');
        const body = await request.json();

        const response = await fetch("http://localhost:8000/administrators/admin/create/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader || ''
            },
            body: JSON.stringify({
                name: body.name,
                email: body.email,
                password: body.password,
                role: body.role === 'admin' ? 'admin' : 'officer'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create user');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 400 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const headersList = await headers();
        const authHeader = headersList.get('Authorization');

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            throw new Error('User ID is required');
        }

        const response = await fetch(`http://localhost:8000/administrators/admin/${id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': authHeader || ''
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 400 }
        );
    }
}