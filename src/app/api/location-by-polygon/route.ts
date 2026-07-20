import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.polygon || !Array.isArray(body.polygon)) {
      return NextResponse.json(
        { error: "Polygon array is required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.API_BASE_URL}location-by-polygon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY || "",
      },
      body: JSON.stringify({ polygon: body.polygon }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.message || errorData?.error || response.statusText || "Failed to fetch locations";
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch locations by polygon" },
      { status: 500 }
    );
  }
}
