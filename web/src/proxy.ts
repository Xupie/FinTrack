import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
    if (!request.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.next();
    }

    if (!request.cookies.get('PHPSESSID')) {
        return NextResponse.redirect("/login");
    }

    const apiBase = process.env.API_INTERNAL_URL;
    if (!apiBase) {
        return new NextResponse("API_INTERNAL_URL not set", { status: 500 });
    }

    const { pathname, search } = request.nextUrl;

    // Remove `/api` prefix
    const targetUrl = `${apiBase}${pathname.replace(/^\/api/, "")}${search}`;

    // Prepare headers for proxying: clone and remove hop-by-hop / length headers
    const forwardedHeaders = new Headers(request.headers as any);
    forwardedHeaders.delete("host");
    forwardedHeaders.delete("content-length");

    const method = request.method.toUpperCase();

    const fetchOptions: RequestInit = {
        method,
        headers: forwardedHeaders,
        // do not follow redirects automatically
        redirect: "manual",
    };

    // Only attach a body for methods that allow one
    if (method !== "GET" && method !== "HEAD") {
        try {
            const buf = await request.arrayBuffer();
            fetchOptions.body = Buffer.from(buf);
        } catch (e) {
            // fallback to text if arrayBuffer not supported
            try {
                fetchOptions.body = await request.text();
            } catch (err) {
                fetchOptions.body = undefined;
            }
        }
    }

    const proxied = await fetch(targetUrl, fetchOptions);

    // Build a NextResponse from the proxied response
    const proxiedBody = await proxied.arrayBuffer();
    const responseHeaders: Record<string, string> = {};
    proxied.headers.forEach((value, key) => {
        // Skip hop-by-hop headers
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