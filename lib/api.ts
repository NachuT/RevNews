import { SearchResponse } from "./types";

const API_BASE = "https://search.hackclub.com/res/v1/news/search";

export async function fetchNews(query: string = "latest", options: { freshness?: string; count?: number; offset?: number } = {}): Promise<SearchResponse> {
    // Injecting a subtle diversifying keyword for the 'latest' query to ensure pool rotation
    const busters = ["today", "recent", "breaking", "update", "current"];
    const randomBuster = busters[Math.floor(Math.random() * busters.length)];

    // If it's the generic latest, we mix it up. 
    // If it's a specific user interest, we keep it as is but ensure freshness.
    const effectiveQuery = (query === "latest news" || query === "latest")
        ? `${query} ${randomBuster}`
        : query;

    const params = new URLSearchParams({
        q: effectiveQuery,
        count: (options.count || 20).toString(),
        ...(options.offset && { offset: options.offset.toString() }),
        freshness: options.freshness || "day",
    });

    const apiKey = process.env.HACK_CLUB_SEARCH_API_KEY;
    if (!apiKey) {
        console.warn("HACK_CLUB_SEARCH_API_KEY is missing");
    }

    const res = await fetch(`${API_BASE}?${params.toString()}`, {
        headers: {
            "Authorization": `Bearer ${apiKey}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch news: ${res.statusText}`);
    }

    return res.json();
}

export async function fetchRelatedNews(title: string): Promise<SearchResponse> {
    const query = title.split(" ").slice(0, 8).join(" ");
    return fetchNews(query, { count: 8 });
}
