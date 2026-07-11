import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const quantity = searchParams.get("quantity") || "5";
    const sessionToken = searchParams.get("sessionToken") || "";

    const response = await fetch(
      `${process.env.API_BASE_URL}get-user-search-suggestions?query=${encodeURIComponent(query)}&quantity=${quantity}&sessionToken=${sessionToken}`,
      {
        headers: {
          "x-api-key": process.env.API_KEY || "",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to search creators" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to search creators" },
      { status: 500 }
    );
  }
}
