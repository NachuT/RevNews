"use client"

import * as React from "react"
import { useInView } from "react-intersection-observer"
import { NewsResult } from "@/lib/types"
import { NewsCard } from "./news-card"
import { Loader2 } from "lucide-react"

interface InfiniteNewsFeedProps {
    initialArticles: NewsResult[]
    query: string
}

export function InfiniteNewsFeed({ initialArticles, query }: InfiniteNewsFeedProps) {
    const [articles, setArticles] = React.useState<NewsResult[]>(initialArticles)
    const [offset, setOffset] = React.useState(initialArticles.length)
    const [hasMore, setHasMore] = React.useState(true)
    const [isLoading, setIsLoading] = React.useState(false)

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: "400px", // Load before reaching the very bottom
    })

    // IMPORTANT: Reset feed when query changes (user updated preferences)
    React.useEffect(() => {
        setArticles(initialArticles)
        setOffset(initialArticles.length)
        setHasMore(true)
        setIsLoading(false)
    }, [initialArticles, query])

    const loadMoreArticles = React.useCallback(async () => {
        if (isLoading || !hasMore) return

        setIsLoading(true)
        try {
            const res = await fetch(`/api/news?q=${encodeURIComponent(query)}&offset=${offset}&count=24`)
            const data = await res.json()

            if (data.results && data.results.length > 0) {
                // Filter out any duplicates just in case
                const newArticles = data.results.filter(
                    (newArt: NewsResult) => !articles.some((existingArt) => existingArt.url === newArt.url)
                )

                if (newArticles.length === 0 && data.results.length > 0) {
                    // If we got results but they were all duplicates, try one more offset jump or just stop
                    setOffset((prev) => prev + data.results.length)
                } else {
                    setArticles((prev) => [...prev, ...newArticles])
                    setOffset((prev) => prev + data.results.length)
                }
            } else {
                setHasMore(false)
            }
        } catch (error) {
            console.error("Failed to load more news:", error)
            setHasMore(false)
        } finally {
            setIsLoading(false)
        }
    }, [query, offset, isLoading, hasMore, articles])

    React.useEffect(() => {
        if (inView && hasMore && !isLoading) {
            loadMoreArticles()
        }
    }, [inView, hasMore, isLoading, loadMoreArticles])

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((item, idx) => (
                    <NewsCard key={`${item.url}-${idx}`} news={item} />
                ))}
            </div>

            {hasMore && (
                <div ref={ref} className="flex justify-center py-10">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Fetching more news...</p>
                        </div>
                    ) : (
                        <div className="h-20" /> /* Reserved space for intersection */
                    )}
                </div>
            )}

            {!hasMore && articles.length > 0 && (
                <div className="text-center py-10 text-muted-foreground italic border-t">
                    You've reached the end of the spectrum.
                </div>
            )}
        </div>
    )
}
