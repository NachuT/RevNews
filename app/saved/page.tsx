import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NewsCard } from "@/components/news/news-card";
import { redirect } from "next/navigation";
import { Bookmark } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    const savedArticles = await prisma.savedArticle.findMany({
        where: { userId: session.user.id },
        orderBy: { savedAt: "desc" }
    });

    return (
        <div className="space-y-8">
            <header className="space-y-1">
                <h1 className="text-4xl font-black tracking-tight text-black italic">
                    Saved Stories
                </h1>
                <p className="text-muted-foreground">Your personal collection of analyzed news.</p>
            </header>

            {savedArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                        <Bookmark className="w-8 h-8 text-slate-400" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-bold text-black">No saved articles yet</h2>
                        <p className="text-muted-foreground max-w-xs">
                            Stories you bookmark will appear here for easy access later.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedArticles.map((article) => (
                        <NewsCard
                            key={article.id}
                            showActions={true}
                            isSaved={true}
                            news={{
                                url: article.articleUrl,
                                title: article.title,
                                description: article.description || "",
                                source: article.source || "Unknown",
                                age: new Date(article.savedAt).toLocaleDateString(),
                                thumbnail: article.thumbnail ? { src: article.thumbnail } : undefined
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
