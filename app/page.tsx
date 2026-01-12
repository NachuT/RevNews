import { fetchNews } from "@/lib/api";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InfiniteNewsFeed } from "@/components/news/infinite-news-feed";
import { CustomizeFeedDialog } from "@/components/news/customize-feed-dialog";
import { RefreshButton } from "@/components/news/refresh-button";

import { SearchResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();
  let userPrefs = null;

  if (session?.user?.id) {
    userPrefs = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
  }

  const query = (userPrefs as any)?.searchQuery || "latest news";
  const newsInterest = (userPrefs as any)?.newsInterest;

  // Fetch initial news server-side (30 articles for a robust start)
  let initialNews: SearchResponse = { results: [] };
  try {
    initialNews = await fetchNews(query, { count: 30 });
  } catch (e) {
    console.error("Home feed fetch error:", e);
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-black italic">
            The Feed
          </h1>
          {newsInterest ? (
            <p className="text-muted-foreground flex items-center gap-2">
              Curated for: <span className="text-primary font-bold">"{newsInterest}"</span>
            </p>
          ) : (
            <p className="text-muted-foreground">Catch up on the world's most recent events.</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <RefreshButton />
          <CustomizeFeedDialog
            initialInterest={newsInterest || ""}
            isLoggedIn={!!session?.user}
          />
        </div>
      </header>

      <InfiniteNewsFeed initialArticles={initialNews.results} query={query} />
    </div>
  );
}
