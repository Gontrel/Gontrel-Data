import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const userId = formData.get("userId");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    if (userId) {
      uploadFormData.append("userId", userId as string);
    }

    const apiBaseUrl = process.env.API_BASE_URL?.trim();
    if (!apiBaseUrl) {
      return NextResponse.json({ error: "API_BASE_URL is not configured" }, { status: 500 });
    }
    const endpoint = new URL("upload-file", `${apiBaseUrl.replace(/\/$/, "")}/`).toString();
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "x-api-key": process.env.API_KEY || "",
      },
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.message || errorData?.error || response.statusText || "Upload failed";
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
