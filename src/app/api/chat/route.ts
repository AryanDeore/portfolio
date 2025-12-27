/** Next.js API route that proxies non-stream chat requests to FastAPI. */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
      return NextResponse.json(
        { error: "Backend URL not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const url = `${backendUrl}/chat`;
    
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.API_KEY || "",
      },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const errorText = await r.text();
      return NextResponse.json(
        { error: errorText || `Backend error: ${r.status}` },
        { status: r.status }
      );
    }

    const text = await r.text();
    return new NextResponse(text, {
      status: r.status,
      headers: { "Content-Type": r.headers.get("content-type") ?? "application/json" },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to connect to backend" },
      { status: 500 }
    );
  }
}
