// app/api/scan/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Optional: for Edge Runtime

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files were uploaded.' },
        { status: 400 }
      );
    }

    // Process each file and prepare for API request
    const results = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString('base64');
        
        // Call your Django API for each image
        const djangoResponse = await fetch("http://localhost:8000/users/find/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: base64String,
            threshold: 0.6 // You can make this configurable
          }),
        });

        if (!djangoResponse.ok) {
          throw new Error(`Django API error: ${djangoResponse.statusText}`);
        }

        return await djangoResponse.json();
      })
    );

    // Combine results from all images
    const combinedResults = results.flatMap(result => result.similar_users || []);

    // Sort by highest similarity and get top 5 unique matches
    const uniqueMatches = Array.from(new Map(
      combinedResults
        .sort((a, b) => b.similarity - a.similarity)
        .map(item => [item.cnic_number, item])
    ).values()).slice(0, 5);

    return NextResponse.json({ matches: uniqueMatches });

  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: 'Failed to process scan.' },
      { status: 500 }
    );
  }
}