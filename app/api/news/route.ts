import { NextRequest, NextResponse } from "next/server";
import { fetchNews } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "latest";
    const count = parseInt(searchParams.get("count") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    try {
        const data = await fetchNews(query, { count, offset });
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }
}
