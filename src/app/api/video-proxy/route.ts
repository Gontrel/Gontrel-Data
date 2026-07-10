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
    const response = await fetch(videoUrl);

    if (!response.ok) {
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
    headers.set("Access-Control-Expose-Headers", "Content-Length, Content-Range");

    const contentLength = response.headers.get("content-length");
    if (contentLength) {
      headers.set("Content-Length", contentLength);
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
