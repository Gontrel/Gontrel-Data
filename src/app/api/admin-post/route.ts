import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Get token from cookies
    const token = request.cookies.get('user_token')?.value;

    const response = await fetch('https://gontrel-test.up.railway.app/admin-post', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '5qegXo2xfJ7UypzWsA3Sq1WbQoL9ARtK2dcGFCDC',
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
