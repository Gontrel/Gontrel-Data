import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Get token from cookies
    const token = request.cookies.get('user_token')?.value;

    const response = await fetch(`${process.env.API_BASE_URL}admin-post`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY || '',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || errorData?.error || response.statusText || 'Failed to save timestamps';
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    );
  }
}
