import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only enforce PHPSESSID for non-public API routes
  const requireAuth = !pathname.startsWith("/api/login") && !pathname.startsWith("/api/register");

  if (requireAuth && !request.cookies.get("PHPSESSID")) {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiBase = process.env.API_INTERNAL_URL;
  if (!apiBase) {
    return new NextResponse("API_INTERNAL_URL not set", { status: 500 });
  }

  const { search } = request.nextUrl;

  // Remove `/api` prefix
  const targetUrl = `${apiBase}${pathname.replace(/^\/api/, "")}${search}`;

  // Prepare headers
  const forwardedHeaders = new Headers(request.headers as any);
  forwardedHeaders.delete("host");
  forwardedHeaders.delete("content-length");

  const method = request.method.toUpperCase();
  const fetchOptions: RequestInit = {
    method,
    headers: forwardedHeaders,
    redirect: "manual",
  };

  if (method !== "GET" && method !== "HEAD") {
    try {
      const buf = await request.arrayBuffer();
      fetchOptions.body = Buffer.from(buf);
    } catch (e) {
      try {
        fetchOptions.body = await request.text();
      } catch {
        fetchOptions.body = undefined;
      }
    }
  }

  const proxied = await fetch(targetUrl, fetchOptions);

  const proxiedBody = await proxied.arrayBuffer();
  const responseHeaders: Record<string, string> = {};
  proxied.headers.forEach((value, key) => {
    if (key.toLowerCase() === "transfer-encoding") return;
    responseHeaders[key] = value;
  });

  return new NextResponse(Buffer.from(proxiedBody), {
    status: proxied.status,
    headers: responseHeaders,
  });
}

export const config = {
  matcher: [
    {
      source: "/api/:path*",
      locale: false,
    },
  ],
};
