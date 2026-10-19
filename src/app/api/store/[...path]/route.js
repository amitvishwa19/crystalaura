import { NextResponse } from "next/server";

const BACKEND_URL = (
    process.env.DEVLOMATIX_BACKEND_URL || 
    process.env.APP_URL || 
    "https://dev.devlomatix.com"
).replace(/\/$/, "");

const STORE_API_KEY = (
    process.env.DEVLOMATIX_STORE_API_KEY || 
    process.env.API_KEY || 
    ""
).trim();

async function proxyRequest(req, { params }) {
    const { path } = await params;
    const subpath = Array.isArray(path) ? path.join("/") : (path || "");
    const { search } = new URL(req.url);

    const targetUrl = `${BACKEND_URL}/api/v1/storefront/${subpath}${search}`;

    const headers = {
        "Content-Type": "application/json",
        "x-api-key": STORE_API_KEY,
    };

    try {
        const fetchOptions = {
            method: req.method,
            headers,
        };

        if (req.method !== "GET" && req.method !== "HEAD") {
            const body = await req.text();
            if (body) {
                fetchOptions.body = body;
            }
        }

        const backendResponse = await fetch(targetUrl, fetchOptions);
        const data = await backendResponse.json().catch(() => ({}));

        return NextResponse.json(data, {
            status: backendResponse.status,
        });
    } catch (error) {
        console.error("[STORE_PROXY_ERROR]", targetUrl, error);
        return NextResponse.json(
            { success: false, error: "Failed to connect to store backend" },
            { status: 502 }
        );
    }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
