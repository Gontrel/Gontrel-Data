import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const videoUrl = request.nextUrl.searchParams.get("url");

  if (!videoUrl) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 }
    );
  }

  try {
    const range = request.headers.get("range");
    const response = await fetch(videoUrl, {
      headers: range ? { Range: range } : undefined,
    });

    if (!response.ok && response.status !== 206) {
      return NextResponse.json(
        { error: "Failed to fetch video" },
        { status: response.status }
      );
    }

    const headers = new Headers();
    headers.set("Content-Type", response.headers.get("content-type") || "video/mp4");
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Range");
    headers.set("Access-Control-Expose-Headers", "Accept-Ranges, Content-Length, Content-Range, Content-Type");

    for (const headerName of ["accept-ranges", "content-length", "content-range"]) {
      const headerValue = response.headers.get(headerName);
      if (headerValue) {
        headers.set(headerName, headerValue);
      }
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to proxy video" },
      { status: 500 }
    );
  }
}
