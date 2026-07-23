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

    const apiBaseUrl = process.env.API_BASE_URL?.trim();
    if (!apiBaseUrl) {
      return NextResponse.json({ error: "API_BASE_URL is not configured" }, { status: 500 });
    }
    const token = request.cookies.get("user_token")?.value;
    const endpoint = new URL("location-by-polygon", `${apiBaseUrl.replace(/\/$/, "")}/`).toString();
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY || "",
        ...(token && { Authorization: `Bearer ${token}` }),
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
    console.error("location-by-polygon proxy error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch locations by polygon" },
      { status: 500 }
    );
  }
}
