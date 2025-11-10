/** Next.js API route that proxies non-stream chat requests to FastAPI. */

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // default runtime works fine

export async function POST(req: NextRequest) {
  /** Forwards JSON payload to FastAPI /chat and returns the JSON response. */
  const body = await req.json();
  const r = await fetch(`${process.env.BACKEND_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    // optionally forward cookies/headers as needed
  });
  const text = await r.text();
  return new NextResponse(text, {
    status: r.status,
    headers: { "Content-Type": r.headers.get("content-type") ?? "application/json" },
  });
}
