/** Next.js API route that proxies streaming chat requests to FastAPI. */

import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  /** Pipes the FastAPI /chat/stream text stream through to the browser. */
  const body = await req.text(); // keep raw so we can forward as-is
  const r = await fetch(`${process.env.BACKEND_URL}/chat/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json",
      "X-API-Key": process.env.API_KEY || "",
     },
    body,
  });

  // Stream the backend response directly
  return new Response(r.body, {
    status: r.status,
    headers: {
      "Content-Type": r.headers.get("content-type") ?? "text/plain; charset=utf-8",
      // Important for streaming in some browsers/proxies:
      "Cache-Control": "no-cache",
      "Transfer-Encoding": "chunked",
    },
  });
}
