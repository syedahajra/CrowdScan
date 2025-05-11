import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Define TypeScript interfaces for the API responses
interface DjangoMatch {
  name: string;
  address: string;
  cnic_number: string;
  image: string;
  similarity: number;
  model_used?: string;
  occlusion_percentage?: number;
  matched_models?: Array<[string, number]>;
}

interface DjangoImageResult {
  image_index: number;
  query_image: string;
  matches: DjangoMatch[];
}

interface DjangoApiResponse {
  results?: DjangoImageResult[];
}

// Frontend-compatible interface (matches your MatchResult)
interface ProcessedMatch {
  name: string;
  address: string;
  cnic_number: string;
  image: string;
  similarity: number;
  isUnknown: boolean;
  description?: string;
  matched_models: string[];
  model_used?: string;
  occlusion_percentage?: number;
  query_image: string;
  model_scores: Record<string, number>;
}

interface ProcessedImageResult {
  image_index: number;
  query_image: string;
  matches: ProcessedMatch[];
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const threshold = formData.get('threshold') || '0.6';
    const thresholdValue = Number(threshold);

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files were uploaded.' },
        { status: 400 }
      );
    }

    // Convert files to base64 with proper typing
    const fileConversionPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      return {
        base64: Buffer.from(arrayBuffer).toString('base64'),
        type: file.type
      };
    });

    const fileData = await Promise.all(fileConversionPromises);
    const images = fileData.map(fd => fd.base64);

    // Call Django API with proper typing
    const djangoResponse = await fetch("http://localhost:8000/users/find/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: images,
        threshold: thresholdValue
      }),
    });

    if (!djangoResponse.ok) {
      const errorData = await djangoResponse.json().catch(() => ({}));
      throw new Error(
        `Django API error: ${djangoResponse.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    const data: DjangoApiResponse | DjangoImageResult[] = await djangoResponse.json();

    // Process the response with proper typing
    let results: DjangoImageResult[] = [];

    if (Array.isArray(data)) {
      results = data;
    } else if (data.results && Array.isArray(data.results)) {
      results = data.results;
    } else {
      console.warn('Unexpected response format');
      results = [];
    }

    // Transform each image result with its matches
    const transformedResults = results.map((result: any, index: number) => {
  const matches = result.matches?.map((match: any) => {
        // Convert matched_models to the required frontend format
        const modelScores: Record<string, number> = {};
        const modelNames: string[] = [];

        if (match.matched_models) {
          match.matched_models.forEach(([model, score]: [string, number]) => {
            modelScores[model] = score;
            modelNames.push(model);
          });
        } else if (match.model_used) {
          modelScores[match.model_used] = match.similarity;
          modelNames.push(match.model_used);
        }

        return {
      ...match,
      query_image: `data:image/jpeg;base64,${result.query_image}`,
          similarity: (match.similarity || 0) * 100,
          isUnknown: (match.similarity || 0) < thresholdValue,
          description: (match.similarity || 0) < thresholdValue
            ? "Potential match from database"
            : undefined,
          matched_models: modelNames,
          model_scores: modelScores,
          name: match.name || 'Unknown',
          address: match.address || 'Not available',
          cnic_number: match.cnic_number || 'Not available',
          image: match.image || '',
          occlusion_percentage: match.occlusion_percentage || 0
        };
      });

      return {
        image_index: index,
    query_image: `data:image/jpeg;base64,${result.query_image}`,
    matches: matches || []
      };
    });
    // Flatten and sort matches
    const allMatches: ProcessedMatch[] = transformedResults.flatMap(result => result.matches);
    const sortedMatches = allMatches.sort((a, b) => {
      const modelCountDiff = b.matched_models.length - a.matched_models.length;
      if (modelCountDiff !== 0) return modelCountDiff;
      return b.similarity - a.similarity;
    });

    return NextResponse.json({
      results: transformedResults,
      matches: sortedMatches
    });

  } catch (error: unknown) {
    console.error('Scan error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process scan';
    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ?
          (error instanceof Error ? error.stack : null) : null
      },
      { status: 500 }
    );
  }
}